// backend/controllers/auth/registrarTrabajador.js
import prisma from '../../db.js'
import bcrypt from 'bcrypt'

export const registrarTrabajador = async (req, res) => {
  try {
    const { nombre, apellido, dni, password } = req.body

    // Validar campos obligatorios
    if (!nombre || !apellido || !dni || !password) {
      return res.status(400).json({
        error: 'Nombre, apellido, DNI y contraseña son obligatorios.'
      })
    }

    // Validar formato de DNI (8 dígitos)
    if (!/^\d{8}$/.test(String(dni))) {
      return res.status(400).json({
        error: 'DNI inválido. Debe tener 8 dígitos numéricos.'
      })
    }

    // Verificar que no exista la combinación nombre + apellido + dni
    const trabajadorExistente = await prisma.trabajador.findFirst({
      where: {
        nombre: nombre,
        apellido: apellido,
        dni: parseInt(dni)
      }
    })

    if (trabajadorExistente) {
      return res.status(400).json({
        error: 'Ya existe un trabajador con ese nombre, apellido y DNI.'
      })
    }

    // Encriptar contraseña
    const salt = await bcrypt.genSalt(10)
    const contraseña_hash = await bcrypt.hash(password, salt)

    // Crear trabajador
    const nuevoTrabajador = await prisma.trabajador.create({
      data: {
        nombre,
        apellido,
        dni: parseInt(dni),
        contraseña_hash,
        id_rol: 2 // Trabajador común por defecto
      }
    })

    res.status(201).json({
      success: true,
      message: 'Trabajador registrado con éxito en el sistema Kairo.',
      trabajador: {
        id: nuevoTrabajador.id_trabajador,
        nombre: nuevoTrabajador.nombre,
        apellido: nuevoTrabajador.apellido,
        dni: nuevoTrabajador.dni
      }
    })
  } catch (error) {
    console.error('Error en registro:', error)
    res.status(500).json({ error: 'Error interno al guardar.' })
  }
}