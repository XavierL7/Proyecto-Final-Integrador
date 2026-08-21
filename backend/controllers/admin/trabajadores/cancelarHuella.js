// backend/controllers/admin/trabajadores/cancelarHuella.js
import prisma from '../../../db.js'

// PUT /api/admin/trabajadores/:id/huella/cancelar
// Por si el empleado nunca llega a pasar por el lector, o hubo un error
// físico de grabación: libera el hash_huella para poder reintentar
// (la próxima vez se le asigna un ID nuevo de la secuencia).
export const cancelarHuella = async (req, res) => {
  try {
    const { id } = req.params

    const trabajador = await prisma.trabajador.update({
      where: { id_trabajador: parseInt(id) },
      data: { hash_huella: null, huella_pendiente: false }
    })

    res.json({
      success: true,
      message: `Se canceló el registro de huella para ${trabajador.nombre} ${trabajador.apellido}.`
    })
  } catch (error) {
    console.error('Error cancelando huella:', error)
    res.status(500).json({ error: 'Error al cancelar el registro de huella.' })
  }
}
