// backend/controllers/admin/roles/deleteRol.js
import prisma from '../../../db.js'

export const deleteRol = async (req, res) => {
  try {
    const { id } = req.params

    const trabajadores = await prisma.trabajador.findFirst({
      where: { id_rol: parseInt(id) }
    })

    if (trabajadores) {
      return res.status(400).json({ error: 'No se puede eliminar un rol con trabajadores asignados' })
    }

    await prisma.roles_Funcionalidades.deleteMany({
      where: { id_rol: parseInt(id) }
    })

    await prisma.rol.delete({
      where: { id_rol: parseInt(id) }
    })

    res.json({ message: 'Rol eliminado correctamente' })
  } catch (error) {
    console.error('Error eliminando rol:', error)
    res.status(500).json({ error: 'Error al eliminar el rol' })
  }
}