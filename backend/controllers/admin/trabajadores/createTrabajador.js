// backend/controllers/admin/trabajadores/createTrabajador.js
import prisma from '../../../db.js'
import bcrypt from 'bcrypt'

export const createTrabajador = async (req, res) => {
  try {
    const { nombre, apellido, dni, password, id_rol } = req.body

    if (!nombre || !apellido || !dni || !password || !id_rol) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' })
    }

    const existe = await prisma.trabajador.findFirst({
      where: { dni: parseInt(dni) }
    })

    if (existe) {
      return res.status(400).json({ error: 'Ya existe un trabajador con ese DNI' })
    }

    const salt = await bcrypt.genSalt(10)
    const contraseña_hash = await bcrypt.hash(password, salt)

    const nuevoTrabajador = await prisma.trabajador.create({
      data: {
        nombre,
        apellido,
        dni: parseInt(dni),
        contraseña_hash,
        id_rol: parseInt(id_rol)
      },
      include: { rol: true }
    })

    res.status(201).json(nuevoTrabajador)
  } catch (error) {
    console.error('Error creando trabajador:', error)
    res.status(500).json({ error: 'Error al crear el trabajador' })
  }
}