// backend/controllers/admin/roles/createRol.js
import prisma from '../../../db.js'

export const createRol = async (req, res) => {
  try {
    const { nombre_rol, funcionalidades } = req.body

    if (!nombre_rol) {
      return res.status(400).json({ error: 'El nombre del rol es obligatorio' })
    }

    const existe = await prisma.rol.findFirst({
      where: { nombre_rol }
    })

    if (existe) {
      return res.status(400).json({ error: 'Ya existe un rol con ese nombre' })
    }

    const nuevoRol = await prisma.rol.create({
      data: {
        nombre_rol,
        roles_funcionalidades: {
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

    res.status(201).json(nuevoRol)
  } catch (error) {
    console.error('Error creando rol:', error)
    res.status(500).json({ error: 'Error al crear el rol' })
  }
}