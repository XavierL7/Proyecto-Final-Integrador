// backend/controllers/admin/trabajadores/updateTrabajador.js
import prisma from '../../../db.js'

export const updateTrabajador = async (req, res) => {
  try {
    const { id } = req.params
    const { nombre, apellido, dni, id_rol } = req.body

    const trabajador = await prisma.trabajador.update({
      where: { id_trabajador: parseInt(id) },
      data: {
        nombre,
        apellido,
        dni: parseInt(dni),
        id_rol: parseInt(id_rol)
      },
      include: { rol: true }
    })

    res.json(trabajador)
  } catch (error) {
    console.error('Error actualizando trabajador:', error)
    res.status(500).json({ error: 'Error al actualizar el trabajador' })
  }
}