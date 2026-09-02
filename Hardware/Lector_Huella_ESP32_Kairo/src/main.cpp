#include <Arduino.h>
#include <Adafruit_Fingerprint.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

// --- Prototipos de Funciones (Requeridos en PlatformIO) ---
void encenderRGB(int r, int g, int b);
int getFingerprintIDez();
bool ejecutarRegistroPorTerminal(int id);
void conectarWiFi();
bool enviarHuellaAlBackend(int fingerprintId);
bool consultarHuellaPendiente(int &idOut, String &nombreOut);
bool confirmarHuellaEnBackend(int fingerprintId);

// --- Configuración de Red / Backend ---
// Reemplazá estos valores con los de tu red y tu servidor Express.
const char* WIFI_SSID     = "Aula68";
const char* WIFI_PASSWORD = "alumnos24";

// Ej: "http://192.168.1.100:3000" si el backend corre en tu LAN,
// o el dominio público si está desplegado.
const char* BACKEND_URL    = "http://172.16.68.80:3000";
const char* DEVICE_API_KEY = "3jK8dFgH9lM2nBvC5xZqWpErTyUiOpAsDfGhJkLzXcVbNmQwErTyUiOpAsDfGhJkLYTljZWZlNTYtZmRkNi00NTBjLWFlNGYtZWJkYmQ4NDZiZTYyNTcyYWIzMjYtY2Y4NS00YWQ0LThhNDEtOTIwZjgxNGJkZTgx"; // debe coincidir con DEVICE_API_KEY del .env del backend

// --- Configuración del Módulo LED RGB ---
const int PIN_RGB_ROJO  = 12; 
const int PIN_RGB_VERDE = 13;
const int PIN_RGB_AZUL  = 14;

// --- Configuración del Sensor (HardwareSerial nativo para ESP32) ---
// Conexión: RX del sensor al pin 16 (RX2) | TX del sensor al pin 17 (TX2)
HardwareSerial mySerial(2);
Adafruit_Fingerprint finger = Adafruit_Fingerprint(&mySerial);

// Estados del sistema
enum Estados { MODO_LECTURA, MODO_REGISTRO };
Estados estadoActual = MODO_LECTURA;

int idSeleccionado = 1;
bool registroEsAutomatico = false; // true si vino de "huellas-pendientes" (panel admin), false si vino del comando 'R' manual

// Cada cuánto se consulta al backend si hay una huella nueva para capturar
const unsigned long INTERVALO_CONSULTA_PENDIENTES_MS = 4000;
unsigned long ultimaConsultaPendientes = 0;

void setup()  
{
  Serial.begin(9600); // Velocidad recomendada para ESP32
  while (!Serial); 
  delay(1000); 

  mySerial.begin(9600, SERIAL_8N1, 16, 17);
  
  // Configuración de pines RGB
  pinMode(PIN_RGB_ROJO, OUTPUT);
  pinMode(PIN_RGB_VERDE, OUTPUT);
  pinMode(PIN_RGB_AZUL, OUTPUT);

  Serial.println(F("\n=== SISTEMA DE HUELLA + RGB POR TERMINAL ==="));
  Serial.println(F("Comando disponible: Envía 'R' para registrar una huella manualmente."));
  Serial.println(F("También se registran solas las huellas pendientes que cargue el admin desde el panel."));

  conectarWiFi();

  finger.begin(57600);
  if (finger.verifyPassword()) {
    Serial.println(F("[OK] Sensor AS608 detectado de forma correcta."));
    encenderRGB(0, 0, 50); // Azul tenue: Esperando huella
  } else {
    Serial.println(F("[ERROR] No se encontró el sensor. Revisa las conexiones."));
    while (1) { 
      encenderRGB(255, 0, 0); delay(500); 
      encenderRGB(0, 0, 0); delay(500); 
    }
  }

  finger.getTemplateCount();
  Serial.print(F("[INFO] Huellas guardadas en memoria: ")); Serial.println(finger.templateCount);
  Serial.println(F("-> Coloca tu dedo para verificar acceso...\n"));
}

void loop()                     
{
  // Escuchar si el usuario envía comandos por el Monitor Serial
  if (Serial.available() > 0) {
    char comando = Serial.read();
    
    // Limpiar saltos de línea del búfer
    while(Serial.available() > 0) { Serial.read(); } 

    if (comando == 'R' || comando == 'r') {
      registroEsAutomatico = false;
      estadoActual = MODO_REGISTRO;
    }
  }

  // Cada INTERVALO_CONSULTA_PENDIENTES_MS, si estamos libres en modo
  // lectura, preguntamos al backend si hay que capturar una huella nueva
  // (esto es lo que dispara el registro cuando el admin crea un trabajador
  // desde el panel web, sin que nadie toque el Monitor Serial).
  if (estadoActual == MODO_LECTURA &&
      millis() - ultimaConsultaPendientes > INTERVALO_CONSULTA_PENDIENTES_MS) {
    ultimaConsultaPendientes = millis();

    int idPendiente;
    String nombrePendiente;
    if (consultarHuellaPendiente(idPendiente, nombrePendiente)) {
      Serial.print(F("\n[PANEL ADMIN] Huella pendiente para: "));
      Serial.print(nombrePendiente);
      Serial.print(F(" (ID #")); Serial.print(idPendiente); Serial.println(F(")"));
      idSeleccionado = idPendiente;
      registroEsAutomatico = true;
      estadoActual = MODO_REGISTRO;
    }
  }

  // LÓGICA SEGÚN EL ESTADO ACTUAL
  switch (estadoActual) {
    
    case MODO_LECTURA:
      getFingerprintIDez();
      delay(50); 
      break;

    case MODO_REGISTRO:
      encenderRGB(80, 0, 80); // Violeta/Cian: Modo configuración activo

      if (registroEsAutomatico) {
        // Ya sabemos el ID (vino del panel admin): no hace falta tipearlo
        Serial.print(F("\n[MODO REGISTRO AUTOMÁTICO] Coloca el dedo del nuevo empleado (ID #"));
        Serial.print(idSeleccionado); Serial.println(F(")..."));
      } else {
        Serial.println(F("\n[MODO REGISTRO MANUAL] Ingresa el número de ID (1 a 127) y presiona Enter:"));
        while (Serial.available() == 0) { delay(10); }
        idSeleccionado = Serial.parseInt();
      }

      // Validar ID
      if (idSeleccionado < 1 || idSeleccionado > 127) {
        Serial.println(F("[!] ID inválido. Debe ser entre 1 y 127. Abortando registro."));
      } else {
        bool ok = ejecutarRegistroPorTerminal(idSeleccionado);
        if (ok && registroEsAutomatico) {
          confirmarHuellaEnBackend(idSeleccionado);
        }
      }

      // Al terminar (éxito o fallo), regresa automáticamente a lectura
      registroEsAutomatico = false;
      estadoActual = MODO_LECTURA;
      Serial.println(F("\n[SISTEMA] Regresando a MODO LECTURA. Esperando dedo..."));
      encenderRGB(0, 0, 50); // Volver al azul de espera
      break;
  }
}

// --- Conexión WiFi ---
void conectarWiFi() {
  Serial.print(F("[WiFi] Conectando a ")); Serial.println(WIFI_SSID);
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  int intentos = 0;
  while (WiFi.status() != WL_CONNECTED && intentos < 20) {
    delay(500);
    Serial.print(F("."));
    intentos++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println();
    Serial.print(F("[WiFi] Conectado. IP: "));
    Serial.println(WiFi.localIP());
  } else {
    Serial.println();
    Serial.println(F("[WiFi] No se pudo conectar. El lector seguirá funcionando en modo local"));
    Serial.println(F("       (verificación offline), pero no podrá identificar trabajadores en el backend"));
    Serial.println(F("       ni recibir huellas pendientes del panel admin."));
  }
}

// --- Pregunta al backend si hay alguna huella pendiente de captura ---
// (la reservó el admin al crear/editar un trabajador desde el panel web)
bool consultarHuellaPendiente(int &idOut, String &nombreOut) {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println(F("[DEBUG] consultarHuellaPendiente: sin WiFi, no consulto."));
    return false;
  }

  HTTPClient http;
  String url = String(BACKEND_URL) + "/api/dispositivo/huellas-pendientes";

  Serial.print(F("[DEBUG] Consultando: ")); Serial.println(url);

  http.begin(url);
  http.addHeader("x-device-key", DEVICE_API_KEY);
  http.setTimeout(5000);

  int codigoHttp = http.GET();
  bool hayPendiente = false;

  // SIEMPRE mostramos el código HTTP y el cuerpo de la respuesta,
  // así vemos exactamente qué está pasando (sacar estas líneas
  // cuando ya funcione).
  Serial.print(F("[DEBUG] Código HTTP recibido: ")); Serial.println(codigoHttp);

  if (codigoHttp > 0) {
    String respuesta = http.getString();
    Serial.print(F("[DEBUG] Cuerpo de la respuesta: ")); Serial.println(respuesta);

    if (codigoHttp == 200) {
      JsonDocument doc;
      DeserializationError err = deserializeJson(doc, respuesta);

      if (err) {
        Serial.print(F("[DEBUG] Error parseando JSON: ")); Serial.println(err.c_str());
      } else {
        JsonArray pendientes = doc["pendientes"].as<JsonArray>();
        Serial.print(F("[DEBUG] Cantidad de pendientes: ")); Serial.println(pendientes.size());

        if (pendientes.size() > 0) {
          JsonObject primero = pendientes[0];
          idOut = primero["fingerprintId"] | 0;
          const char* nombre = primero["nombre"] | "";
          const char* apellido = primero["apellido"] | "";
          nombreOut = String(nombre) + " " + String(apellido);
          hayPendiente = (idOut >= 1 && idOut <= 127);
        }
      }
    } else if (codigoHttp == 401) {
      Serial.println(F("[BACKEND] Clave de dispositivo (DEVICE_API_KEY) inválida."));
    } else if (codigoHttp == 404) {
      Serial.println(F("[BACKEND] Ruta no encontrada. ¿La URL del backend y el router están bien montados?"));
    }
  } else {
    // codigoHttp negativo = error de conexión (no llegó ni a hablar con el servidor)
    Serial.print(F("[DEBUG] Error de conexión HTTPClient: "));
    Serial.println(http.errorToString(codigoHttp));
    Serial.println(F("[DEBUG] Revisá: ¿la IP en BACKEND_URL es correcta? ¿el backend está prendido?"));
    Serial.println(F("[DEBUG] ¿el ESP32 y el backend están en la MISMA red WiFi/LAN?"));
  }

  http.end();
  return hayPendiente;
}

// --- Avisa al backend que la huella ya se grabó físicamente en el sensor ---
bool confirmarHuellaEnBackend(int fingerprintId) {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println(F("[HTTP] Sin WiFi, no se pudo confirmar la huella en el backend."));
    Serial.println(F("       Quedó grabada en el sensor pero el panel la seguirá viendo como pendiente."));
    return false;
  }

  HTTPClient http;
  String url = String(BACKEND_URL) + "/api/dispositivo/confirmar-huella";

  http.begin(url);
  http.addHeader("Content-Type", "application/json");
  http.addHeader("x-device-key", DEVICE_API_KEY);
  http.setTimeout(5000);

  JsonDocument bodyDoc;
  bodyDoc["fingerprintId"] = fingerprintId;
  String body;
  serializeJson(bodyDoc, body);

  int codigoHttp = http.POST(body);
  bool exito = (codigoHttp == 200);

  if (exito) {
    Serial.println(F("[BACKEND] Huella confirmada. Ya figura completa en el panel admin."));
  } else {
    Serial.print(F("[BACKEND] No se pudo confirmar la huella. Código HTTP: ")); Serial.println(codigoHttp);
  }

  http.end();
  return exito;
}

// --- Envía el ID de huella reconocido localmente al backend Express ---
// El backend traduce ese ID local del sensor al trabajador real y devuelve
// su nombre + token, igual que en el login por usuario/contraseña. Además,
// deja el resultado "publicado" para que la página de login web lo recoja.
bool enviarHuellaAlBackend(int fingerprintId) {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println(F("[HTTP] Sin WiFi, no se pudo consultar al backend."));
    return false;
  }

  HTTPClient http;
  String url = String(BACKEND_URL) + "/api/dispositivo/identificar-huella";

  http.begin(url);
  http.addHeader("Content-Type", "application/json");
  http.addHeader("x-device-key", DEVICE_API_KEY);
  http.setTimeout(5000);

  JsonDocument bodyDoc;
  bodyDoc["fingerprintId"] = fingerprintId;
  String body;
  serializeJson(bodyDoc, body);

  int codigoHttp = http.POST(body);
  bool exito = false;

  if (codigoHttp == 200) {
    String respuesta = http.getString();

    JsonDocument respDoc;
    DeserializationError err = deserializeJson(respDoc, respuesta);

    if (!err) {
      const char* nombre   = respDoc["trabajador"]["nombre"]   | "??";
      const char* apellido = respDoc["trabajador"]["apellido"] | "";
      const char* rol      = respDoc["trabajador"]["rol"]["nombre_rol"] | "";

      Serial.print(F("[BACKEND] Trabajador identificado: "));
      Serial.print(nombre); Serial.print(F(" ")); Serial.print(apellido);
      Serial.print(F(" (")); Serial.print(rol); Serial.println(F(")"));
      Serial.println(F("[BACKEND] Podés iniciar sesión en la web ahora: la página de login lo va a detectar solo."));
      exito = true;
    } else {
      Serial.println(F("[BACKEND] Respuesta OK pero no se pudo parsear el JSON."));
    }
  } else if (codigoHttp == 404) {
    Serial.println(F("[BACKEND] Esa huella no está vinculada a ningún trabajador."));
  } else if (codigoHttp == 401) {
    Serial.println(F("[BACKEND] Clave de dispositivo (DEVICE_API_KEY) inválida."));
  } else if (codigoHttp == 409) {
    Serial.println(F("[BACKEND] Esta huella todavía no fue confirmada por el sistema."));
  } else {
    Serial.print(F("[BACKEND] Error HTTP: ")); Serial.println(codigoHttp);
  }

  http.end();
  return exito;
}

// --- Función Auxiliar para Controlar el LED RGB ---
void encenderRGB(int r, int g, int b) {
  analogWrite(PIN_RGB_ROJO, r);
  analogWrite(PIN_RGB_VERDE, g);
  analogWrite(PIN_RGB_AZUL, b);
}

// --- MODO LECTURA ---
int getFingerprintIDez() {
  uint8_t p = finger.getImage();
  if (p != FINGERPRINT_OK) return -1;

  p = finger.image2Tz();
  if (p != FINGERPRINT_OK) return -1;

  p = finger.fingerFastSearch();
  if (p == FINGERPRINT_NOTFOUND) {
    Serial.println(F("[-] Huella NO reconocida."));
    encenderRGB(255, 0, 0); // Rojo de error
    delay(1500);
    encenderRGB(0, 0, 50);  // Volver a azul
    return -1;
  } else if (p != FINGERPRINT_OK) {
    return -1;
  }

  Serial.print(F("[+] ¡HUELLA RECONOCIDA LOCALMENTE! ID #")); Serial.print(finger.fingerID);
  Serial.print(F(" | Confianza: ")); Serial.println(finger.confidence);

  // Consultar al backend quién es este ID (esto también habilita el login
  // web "solo con huella")
  bool identificadoEnBackend = enviarHuellaAlBackend(finger.fingerID);

  if (identificadoEnBackend) {
    encenderRGB(0, 255, 0); // Verde: éxito confirmado por el backend
  } else {
    // Reconocido localmente pero sin confirmación del servidor
    // (sin WiFi, no vinculado, etc.) -> aviso ámbar
    encenderRGB(255, 120, 0);
  }
  delay(2000);
  encenderRGB(0, 0, 50);  // Volver a azul
  return finger.fingerID;
}

// --- MODO REGISTRO (manual por terminal, o automático por huella pendiente) ---
// Devuelve true si el modelo quedó grabado con éxito en el sensor.
bool ejecutarRegistroPorTerminal(int id) {
  Serial.print(F("\n[REGISTRO] Iniciando proceso para el ID #")); Serial.println(id);
  
  int p = -1;
  Serial.println(F("[REGISTRO] Coloca el dedo firmemente en el sensor..."));
  while (p != FINGERPRINT_OK) {
    p = finger.getImage();
    if (p == FINGERPRINT_PACKETRECIEVEERR) return false;
  }

  p = finger.image2Tz(1);
  if (p != FINGERPRINT_OK) {
    Serial.println(F("[!] Error en rasgos de imagen. Abortando."));
    encenderRGB(255, 0, 0); delay(1000);
    return false;
  }

  Serial.println(F("[REGISTRO] Quita el dedo."));
  encenderRGB(0, 0, 0);
  delay(2000);
  p = 0;
  while (p != FINGERPRINT_NOFINGER) { p = finger.getImage(); }

  p = -1;
  Serial.println(F("[REGISTRO] Coloca el MISMO dedo otra vez..."));
  encenderRGB(80, 0, 80);
  while (p != FINGERPRINT_OK) {
    p = finger.getImage();
  }

  p = finger.image2Tz(2);
  if (p != FINGERPRINT_OK) {
    Serial.println(F("[!] Error en segunda imagen. Abortando."));
    encenderRGB(255, 0, 0); delay(1000);
    return false;
  }

  p = finger.createModel();
  if (p == FINGERPRINT_OK) {
    Serial.println(F("[OK] Las capturas coinciden perfectamente."));
  } else {
    Serial.println(F("[!] Error: Las huellas no coinciden."));
    encenderRGB(255, 0, 0); delay(1500);
    return false;
  }

  p = finger.storeModel(id);
  if (p == FINGERPRINT_OK) {
    Serial.print(F("[¡ÉXITO!] Huella grabada localmente en el ID #")); Serial.println(id);
    encenderRGB(0, 255, 0); delay(2000);
    return true;
  } else {
    Serial.println(F("[!] Error físico de escritura en la memoria del AS608."));
    encenderRGB(255, 0, 0); delay(1500);
    return false;
  }
}
