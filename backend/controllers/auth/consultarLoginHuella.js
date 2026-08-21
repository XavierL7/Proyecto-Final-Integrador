// backend/controllers/auth/consultarLoginHuella.js
import { consumirLoginPorHuella } from '../../lib/loginHuellaState.js'

// GET /api/auth/huella/resultado
// La pantalla de login llama esto en loop corto (cada ~2s) mientras el
// usuario tiene el dedo apoyado en el lector físico. No requiere JWT
// porque se usa justamente para ANTES de loguearse.
export const consultarLoginHuella = (req, res) => {
  const resultado = consumirLoginPorHuella()

  if (!resultado) {
    return res.status(204).end() // nada nuevo todavía
  }

  res.json(resultado) // { token, trabajador, funcionalidades }
}
