// backend/controllers/configuracion/getConfiguracion.js
import { obtenerTodaLaConfiguracion } from '../../lib/configuracion.js'

// GET /api/configuracion
// Devuelve todas las claves de configuración como un objeto plano
// { clave: valor }, con los defaults ya aplicados si algo no fue
// guardado todavía.
export const getConfiguracion = async (req, res) => {
  try {
    const configuracion = await obtenerTodaLaConfiguracion()
    res.json(configuracion)
  } catch (error) {
    console.error('Error obteniendo configuración:', error)
    res.status(500).json({ error: 'Error en el servidor al obtener la configuración.' })
  }
}
