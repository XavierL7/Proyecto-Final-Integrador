// backend/controllers/admin/trabajadores/deleteTrabajador.js
import prisma from '../../../db.js'

export const deleteTrabajador = async (req, res) => {
  try {
    const { id } = req.params

    await prisma.trabajador.delete({
      where: { id_trabajador: parseInt(id) }
    })

    res.json({ message: 'Trabajador eliminado correctamente' })
  } catch (error) {
    console.error('Error eliminando trabajador:', error)
    res.status(500).json({ error: 'Error al eliminar el trabajador' })
  }
}