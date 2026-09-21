#include <Arduino.h>
#include <Adafruit_Fingerprint.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

// --- Prototipos de Funciones (Requeridos en PlatformIO) ---
void encenderRGB(int r, int g, int b);
int getFingerprintIDez();
bool registrarHuellaEnSensor(int id);
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

const char* BACKEND_URL    = "http://172.16.68.225:3000";
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

// ID que el panel admin reservó para la huella que hay que grabar (1 a 127)
int idSeleccionado = 1;

// Cada cuánto se consulta al backend si hay una huella nueva para capturar
const unsigned long INTERVALO_CONSULTA_PENDIENTES_MS = 4000;
unsigned long ultimaConsultaPendientes = 0;

void setup()
{
  delay(1000); // Tiempo para que el sensor arranque antes de comunicarse con él

  mySerial.begin(9600, SERIAL_8N1, 16, 17);

  // Configuración de pines RGB
  pinMode(PIN_RGB_ROJO, OUTPUT);
  pinMode(PIN_RGB_VERDE, OUTPUT);
  pinMode(PIN_RGB_AZUL, OUTPUT);

  conectarWiFi();

  finger.begin(57600);
  if (finger.verifyPassword()) {
    encenderRGB(0, 0, 50); // Azul tenue: Esperando huella
  } else {
    // Sensor no detectado: el LED parpadea en rojo indefinidamente
    while (1) {
      encenderRGB(255, 0, 0); delay(500);
      encenderRGB(0, 0, 0); delay(500);
    }
  }
}

void loop()
{
  // Cada INTERVALO_CONSULTA_PENDIENTES_MS, si estamos libres en modo
  // lectura, preguntamos al backend si hay que capturar una huella nueva
  // (esto es lo que dispara el registro cuando el admin crea un trabajador
  // o solicita una huella desde el panel web).
  if (estadoActual == MODO_LECTURA &&
      millis() - ultimaConsultaPendientes > INTERVALO_CONSULTA_PENDIENTES_MS) {
    ultimaConsultaPendientes = millis();

    int idPendiente;
    String nombrePendiente;
    if (consultarHuellaPendiente(idPendiente, nombrePendiente)) {
      idSeleccionado = idPendiente;
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
      encenderRGB(80, 0, 80); // Violeta: Modo registro activo

      // Si la huella se grabó en el sensor, se avisa al backend para que
      // el panel admin la deje de mostrar como pendiente
      if (registrarHuellaEnSensor(idSeleccionado)) {
        confirmarHuellaEnBackend(idSeleccionado);
      }

      // Al terminar (éxito o fallo), regresa automáticamente a lectura
      estadoActual = MODO_LECTURA;
      encenderRGB(0, 0, 50); // Volver al azul de espera
      break;
  }
}

// --- Conexión WiFi ---
// Si no logra conectarse tras ~10 s, el lector sigue funcionando en modo local
// (reconoce dedos), pero no puede identificar trabajadores en el backend
// ni recibir huellas pendientes del panel admin.
void conectarWiFi() {
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  int intentos = 0;
  while (WiFi.status() != WL_CONNECTED && intentos < 20) {
    delay(500);
    intentos++;
  }
}

// --- Pregunta al backend si hay alguna huella pendiente de captura ---
// (la reservó el admin al crear/editar un trabajador desde el panel web)
bool consultarHuellaPendiente(int &idOut, String &nombreOut) {
  if (WiFi.status() != WL_CONNECTED) {
    return false;
  }

  HTTPClient http;
  String url = String(BACKEND_URL) + "/api/dispositivo/huellas-pendientes";

  http.begin(url);
  http.addHeader("x-device-key", DEVICE_API_KEY);
  http.setTimeout(5000);

  int codigoHttp = http.GET();
  bool hayPendiente = false;

  if (codigoHttp == 200) {
    String respuesta = http.getString();

    JsonDocument doc;
    DeserializationError err = deserializeJson(doc, respuesta);

    if (!err) {
      JsonArray pendientes = doc["pendientes"].as<JsonArray>();

      if (pendientes.size() > 0) {
        JsonObject primero = pendientes[0];
        idOut = primero["fingerprintId"] | 0;
        const char* nombre = primero["nombre"] | "";
        const char* apellido = primero["apellido"] | "";
        nombreOut = String(nombre) + " " + String(apellido);
        hayPendiente = (idOut >= 1 && idOut <= 127);
      }
    }
  }

  http.end();
  return hayPendiente;
}

// --- Avisa al backend que la huella ya se grabó físicamente en el sensor ---
// Si falla (sin WiFi, etc.), la huella queda grabada en el sensor pero el
// panel la seguirá viendo como pendiente.
bool confirmarHuellaEnBackend(int fingerprintId) {
  if (WiFi.status() != WL_CONNECTED) {
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

  http.end();
  return exito;
}

// --- Envía el ID de huella reconocido localmente al backend Express ---
// El backend traduce ese ID local del sensor al trabajador real y devuelve
// su nombre + token, igual que en el login por usuario/contraseña. Además,
// deja el resultado "publicado" para que la página de login web lo recoja.
// Devuelve true solo si el backend respondió 200 con un JSON válido.
bool enviarHuellaAlBackend(int fingerprintId) {
  if (WiFi.status() != WL_CONNECTED) {
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

    exito = !err;
  }
  // Cualquier otro código (404 no vinculada, 401 clave inválida,
  // 409 pendiente, 403, 5xx, error de conexión) se trata como fallo.

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
    encenderRGB(255, 0, 0); // Rojo: huella no reconocida
    delay(1500);
    encenderRGB(0, 0, 50);  // Volver a azul
    return -1;
  } else if (p != FINGERPRINT_OK) {
    return -1;
  }

  // Huella reconocida localmente. Consultar al backend quién es este ID
  // (esto también habilita el login web "solo con huella")
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

// --- MODO REGISTRO (huella pendiente reservada desde el panel admin) ---
// Captura el dedo dos veces y guarda la plantilla en la memoria del sensor
// en la posición "id". Devuelve true si quedó grabada con éxito.
bool registrarHuellaEnSensor(int id) {
  int p = -1;

  // Primera captura
  while (p != FINGERPRINT_OK) {
    p = finger.getImage();
    if (p == FINGERPRINT_PACKETRECIEVEERR) return false;
  }

  p = finger.image2Tz(1);
  if (p != FINGERPRINT_OK) {
    encenderRGB(255, 0, 0); delay(1000);
    return false;
  }

  // Esperar que quite el dedo
  encenderRGB(0, 0, 0);
  delay(2000);
  p = 0;
  while (p != FINGERPRINT_NOFINGER) { p = finger.getImage(); }

  // Segunda captura (el mismo dedo)
  p = -1;
  encenderRGB(80, 0, 80);
  while (p != FINGERPRINT_OK) {
    p = finger.getImage();
  }

  p = finger.image2Tz(2);
  if (p != FINGERPRINT_OK) {
    encenderRGB(255, 0, 0); delay(1000);
    return false;
  }

  // Las dos capturas deben coincidir
  p = finger.createModel();
  if (p != FINGERPRINT_OK) {
    encenderRGB(255, 0, 0); delay(1500);
    return false;
  }

  // Grabar la plantilla en la memoria del AS608
  p = finger.storeModel(id);
  if (p == FINGERPRINT_OK) {
    encenderRGB(0, 255, 0); delay(2000);
    return true;
  } else {
    encenderRGB(255, 0, 0); delay(1500);
    return false;
  }
}
