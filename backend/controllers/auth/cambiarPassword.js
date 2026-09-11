// backend/controllers/auth/cambiarPassword.js
import prisma from '../../db.js'
import bcrypt from 'bcrypt'

// PATCH /api/auth/cambiar-password
// Requiere estar autenticado (verificarToken pone req.userId).
// Se usa tanto desde el perfil (cambio voluntario) como en el primer
// ingreso al sistema (cambio obligatorio de la contraseña provisoria).
export const cambiarPassword = async (req, res) => {
  try {
    const { passwordActual, passwordNueva } = req.body

    if (!passwordActual || !passwordNueva) {
      return res.status(400).json({
        error: 'La contraseña actual y la nueva contraseña son obligatorias.'
      })
    }

    if (passwordNueva.length < 6) {
      return res.status(400).json({
        error: 'La nueva contraseña debe tener al menos 6 caracteres.'
      })
    }

    if (passwordNueva === passwordActual) {
      return res.status(400).json({
        error: 'La nueva contraseña debe ser distinta de la actual.'
      })
    }

    const trabajador = await prisma.trabajador.findUnique({
      where: { id_trabajador: req.userId }
    })

    if (!trabajador) {
      return res.status(404).json({ error: 'Trabajador no encontrado.' })
    }

    // Verificamos que sepa la contraseña actual antes de dejarlo cambiarla
    const contrasenaValida = await bcrypt.compare(passwordActual, trabajador.contraseña_hash)
    if (!contrasenaValida) {
      return res.status(401).json({ error: 'La contraseña actual es incorrecta.' })
    }

    const salt = await bcrypt.genSalt(10)
    const nuevaHash = await bcrypt.hash(passwordNueva, salt)

    await prisma.trabajador.update({
      where: { id_trabajador: req.userId },
      data: { contraseña_hash: nuevaHash }
    })

    res.json({
      success: true,
      message: 'Contraseña actualizada con éxito.'
    })
  } catch (error) {
    console.error('Error al cambiar la contraseña:', error)
    res.status(500).json({ error: 'Error en el servidor al cambiar la contraseña.' })
  }
}
