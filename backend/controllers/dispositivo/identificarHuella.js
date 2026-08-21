// backend/controllers/dispositivo/identificarHuella.js
import prisma from '../../db.js'
import jwt from 'jsonwebtoken'
import { publicarLoginPorHuella } from '../../lib/loginHuellaState.js'

const JWT_SECRET = process.env.JWT_SECRET

// Llamado por el ESP32 (main.cpp -> enviarHuellaAlBackend) cada vez que el
// AS608 reconoce localmente una huella. El sensor solo sabe "ID #3 con
// confianza 120"; acá se traduce ese ID local al trabajador real, se genera
// un token (igual que en un login normal) y además se deja "publicado" para
// que la página de login en el navegador lo recoja (ver loginHuellaState.js
// y auth/consultarLoginHuella.js).
export const identificarHuella = async (req, res) => {
  try {
    const { fingerprintId } = req.body

    if (fingerprintId === undefined || fingerprintId === null) {
      return res.status(400).json({ error: 'fingerprintId es obligatorio.' })
    }

    const trabajador = await prisma.trabajador.findUnique({
      where: { hash_huella: String(fingerprintId) },
      include: {
        rol: {
          include: {
            roles_funcionalidades: {
              where: { activo: true },
              include: { funcionalidad: true }
            }
          }
        }
      }
    })

    if (!trabajador) {
      return res.status(404).json({
        error: 'Esa huella no está vinculada a ningún trabajador.'
      })
    }

    if (trabajador.huella_pendiente) {
      // Se capturó en el sensor pero el backend todavía no la confirmó
      // (no debería pasar en uso normal, pero por las dudas).
      return res.status(409).json({
        error: 'Esta huella todavía no fue confirmada por el sistema.'
      })
    }

    const funcionalidades = trabajador.rol?.roles_funcionalidades
      ?.map(rf => rf.funcionalidad.nombre_func) || []

    const token = jwt.sign(
      {
        id: trabajador.id_trabajador,
        nombre: trabajador.nombre,
        apellido: trabajador.apellido,
        dni: trabajador.dni
      },
      JWT_SECRET,
      { expiresIn: '8h' }
    )

    const trabajadorRespuesta = {
      id: trabajador.id_trabajador,
      nombre: trabajador.nombre,
      apellido: trabajador.apellido,
      dni: trabajador.dni,
      rol: { nombre_rol: trabajador.rol?.nombre_rol }
    }

    // 1) Respuesta directa al ESP32 (por si querés loguear/mostrar algo ahí)
    res.json({ token, trabajador: trabajadorRespuesta, funcionalidades })

    // 2) Publicar para que el login web lo recoja por polling
    publicarLoginPorHuella({ token, trabajador: trabajadorRespuesta, funcionalidades })
  } catch (error) {
    console.error('Error en identificarHuella:', error)
    res.status(500).json({ error: 'Error en el servidor al identificar la huella.' })
  }
}
