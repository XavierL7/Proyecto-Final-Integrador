// backend/lib/movimientoPendienteState.js
//
// Mismo patrón que ventaPendienteState.js, pero para el ingreso/egreso
// manual de una caja compartida: el cajero completa el mini formulario
// (monto + descripción) y aprieta "Confirmar", pero no se guarda
// todavía. Queda acá esperando hasta que alguien identifica su huella en
// el ESP32 (identificarHuella.js); recién ahí se persiste, atribuida a
// esa persona.
//
// Vive en memoria del proceso: solo soporta UN movimiento pendiente a la
// vez en todo el sistema (comparte "el lector" con ventaPendienteState).
// Si en el futuro hay varias cajas compartidas en paralelo, esto habría
// que indexarlo por id_caja en vez de ser un único slot global.

const TTL_MS = 30_000 // quien registra el movimiento tiene 30s para que alguien ponga el dedo

let pendiente = null
// { id_caja, tipo, monto, descripcion, expiraEn, resultado }
// resultado: undefined mientras se espera la huella.

function limpiarSiExpiro() {
  if (pendiente && Date.now() > pendiente.expiraEn) {
    pendiente = null
  }
}

export function iniciarMovimientoPendiente(datosMovimiento) {
  pendiente = {
    ...datosMovimiento,
    expiraEn: Date.now() + TTL_MS,
    resultado: undefined
  }
}

export function hayMovimientoPendiente() {
  limpiarSiExpiro()
  return pendiente !== null && pendiente.resultado === undefined
}

export function obtenerMovimientoPendiente() {
  limpiarSiExpiro()
  return pendiente
}

export function resolverMovimientoPendiente(resultado) {
  if (pendiente) {
    pendiente.resultado = resultado
  }
}

// La usa el polling del frontend: devuelve el resultado UNA sola vez
// (éxito o error) y limpia el slot. null = todavía no hay nada.
export function consumirResultadoMovimientoPendiente() {
  limpiarSiExpiro()
  if (!pendiente || pendiente.resultado === undefined) return null
  const resultado = pendiente.resultado
  pendiente = null
  return resultado
}
