// backend/controllers/admin/roles/updateRol.js
import prisma from '../../../db.js'

export const updateRol = async (req, res) => {
  try {
    const { id } = req.params
    const { nombre_rol, funcionalidades } = req.body

    const rol = await prisma.rol.findUnique({
      where: { id_rol: parseInt(id) }
    })

    if (!rol) {
      return res.status(404).json({ error: 'Rol no encontrado' })
    }

    const rolActualizado = await prisma.rol.update({
      where: { id_rol: parseInt(id) },
      data: {
        nombre_rol,
        roles_funcionalidades: {
          deleteMany: {},
          create: funcionalidades?.map(id_func => ({
            id_func,
            activo: true
          })) || []
        }
      },
      include: {
        roles_funcionalidades: {
          include: { funcionalidad: true }
        }
      }
    })

    res.json(rolActualizado)
  } catch (error) {
    console.error('Error actualizando rol:', error)
    res.status(500).json({ error: 'Error al actualizar el rol' })
  }
}