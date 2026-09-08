// backend/controllers/venta/consultarVentaPendiente.js
import { consumirResultadoVentaPendiente } from '../../lib/ventaPendienteState.js'

// GET /api/ventas/pendiente/resultado
// VentasView.vue llama esto en loop corto (cada ~2s) después de POST
// /api/ventas/pendiente, mientras espera que alguien ponga el dedo en el
// lector. 204 = todavía nada. 200 = ya se resolvió (éxito o error).
export const consultarVentaPendiente = (req, res) => {
  const resultado = consumirResultadoVentaPendiente()

  if (!resultado) {
    return res.status(204).end()
  }

  res.json(resultado) // { success: true, venta } o { success: false, error }
}
