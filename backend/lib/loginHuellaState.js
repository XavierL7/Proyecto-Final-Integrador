// backend/lib/loginHuellaState.js
//
// Puente simple entre el ESP32 (que identifica la huella) y la página de
// login en el navegador (que no tiene forma de "escuchar" al sensor
// directamente). Cuando el dispositivo identifica a alguien, guardamos acá
// el resultado por unos segundos; el login web lo consulta por polling y,
// apenas lo lee, se consume (no se puede volver a leer ni reusar).
//
// Vive en memoria del proceso: alcanza y sobra para un solo POS/terminal.
// Si en el futuro corrés varias instancias del backend detrás de un load
// balancer, esto habría que moverlo a Redis.

const TTL_MS = 20_000 // el login web tiene 20s para "recoger" el resultado

let ultimoResultado = null // { token, trabajador, funcionalidades, expiraEn }

export function publicarLoginPorHuella({ token, trabajador, funcionalidades }) {
  ultimoResultado = {
    token,
    trabajador,
    funcionalidades,
    expiraEn: Date.now() + TTL_MS
  }
}

export function consumirLoginPorHuella() {
  if (!ultimoResultado) return null
  if (Date.now() > ultimoResultado.expiraEn) {
    ultimoResultado = null
    return null
  }
  const resultado = ultimoResultado
  ultimoResultado = null // se consume: un solo login web por identificación
  return resultado
}
