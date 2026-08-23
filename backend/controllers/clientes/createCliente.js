import prisma from '../../db.js'

export const crearCliente = async (req, res) => {
  const { nombre, apellido, dni, telefono, fecha_ultima_compra } = req.body

  if (!nombre || !apellido || !dni) {
    return res.status(400).json({ error: 'Nombre, apellido y DNI son campos obligatorios.' })
  }

  try {
    const nuevoCliente = await prisma.cliente.create({
      data: {
        nombre: nombre.trim(),
        apellido: apellido.trim(),
        dni: String(dni).trim(), // <-- Convertimos a String para coincidir con el Schema
        telefono: telefono ? telefono.trim() : null,
        fecha_ultima_compra: fecha_ultima_compra ? new Date(fecha_ultima_compra) : null
      }
    })

    res.status(201).json(nuevoCliente)
  } catch (error) {
    console.error('Error al crear cliente:', error.message)
    res.status(400).json({ error: error.message || 'Error al guardar el cliente' })
  }
}