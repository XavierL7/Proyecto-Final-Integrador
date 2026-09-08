// backend/lib/ventaPendienteState.js
//
// Mismo patrón que loginHuellaState.js, pero para el flujo de caja
// compartida: el cajero arma la venta y aprieta "Confirmar pago", pero
// no se guarda todavía. Queda acá esperando hasta que alguien identifica
// su huella en el ESP32 (identificarHuella.js); recién ahí se persiste,
// atribuida a esa persona.
//
// Vive en memoria del proceso: solo soporta UNA venta pendiente a la vez
// en todo el sistema. Alcanza para un solo POS con una caja compartida.
// Si en el futuro hay varias cajas compartidas en paralelo, esto habría
// que indexarlo por id_caja en vez de ser un único slot global.

const TTL_MS = 30_000 // el cajero tiene 30s para que alguien ponga el dedo

let pendiente = null
// { id_caja, total, metodo_pago, datos_pago, itemsConDescuento, metodoPago,
//   idClienteValidado, expiraEn, resultado }
// resultado: undefined mientras se espera la huella.

function limpiarSiExpiro() {
  if (pendiente && Date.now() > pendiente.expiraEn) {
    pendiente = null
  }
}

export function iniciarVentaPendiente(datosVenta) {
  pendiente = {
    ...datosVenta,
    expiraEn: Date.now() + TTL_MS,
    resultado: undefined
  }
}

export function hayVentaPendiente() {
  limpiarSiExpiro()
  return pendiente !== null && pendiente.resultado === undefined
}

export function obtenerVentaPendiente() {
  limpiarSiExpiro()
  return pendiente
}

export function resolverVentaPendiente(resultado) {
  if (pendiente) {
    pendiente.resultado = resultado
  }
}

// La usa el polling del frontend: devuelve el resultado UNA sola vez
// (éxito o error) y limpia el slot. null = todavía no hay nada.
export function consumirResultadoVentaPendiente() {
  limpiarSiExpiro()
  if (!pendiente || pendiente.resultado === undefined) return null
  const resultado = pendiente.resultado
  pendiente = null
  return resultado
}
