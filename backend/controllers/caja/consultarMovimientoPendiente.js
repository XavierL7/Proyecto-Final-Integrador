// backend/controllers/caja/consultarMovimientoPendiente.js
import { consumirResultadoMovimientoPendiente } from '../../lib/movimientoPendienteState.js'

// GET /api/cajas/movimientos/pendiente/resultado
// ResumenDineroCajaModal.vue llama esto en loop corto (cada ~2s) después
// de que POST /api/cajas/:id/movimientos devuelve 202, mientras espera
// que alguien ponga el dedo en el lector. 204 = todavía nada.
// 200 = ya se resolvió (éxito o error).
export const consultarMovimientoPendiente = (req, res) => {
  const resultado = consumirResultadoMovimientoPendiente()

  if (!resultado) {
    return res.status(204).end()
  }

  res.json(resultado) // { success: true, movimiento } o { success: false, error }
}
