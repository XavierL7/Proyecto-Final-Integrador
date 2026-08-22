import prisma from '../db.js' // Ajustá la ruta a tu instancia de PrismaClient

// GET: Obtener todos los clientes
export const obtenerClientes = async (req, res) => {
  try {
    const clientes = await prisma.cliente.findMany({
      orderBy: {
        fecha_ultima_compra: 'desc'
      }
    })

    res.status(200).json(clientes)
  } catch (error) {
    console.error('Error al obtener clientes:', error.message)
    res.status(500).json({ error: 'Error interno al obtener los clientes' })
  }
}

// POST: Crear un nuevo cliente
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

// PUT: Actualizar un cliente
export const actualizarCliente = async (req, res) => {
  const { id } = req.params
  const { nombre, apellido, dni, telefono, fecha_ultima_compra } = req.body

  try {
    const clienteActualizado = await prisma.cliente.update({
      where: {
        id_cliente: Number(id)
      },
      data: {
        nombre: nombre?.trim(),
        apellido: apellido?.trim(),
        dni: dni ? String(dni).trim() : undefined, // <-- Convertimos a String
        telefono: telefono ? telefono.trim() : null,
        fecha_ultima_compra: fecha_ultima_compra ? new Date(fecha_ultima_compra) : null
      }
    })

    res.status(200).json(clienteActualizado)
  } catch (error) {
    console.error('Error al actualizar cliente:', error.message)
    res.status(400).json({ error: error.message || 'Error al actualizar el cliente' })
  }
}

// DELETE: Eliminar un cliente
export const eliminarCliente = async (req, res) => {
  const { id } = req.params

  try {
    await prisma.cliente.delete({
      where: {
        id_cliente: Number(id) // o String(id) si es UUID
      }
    })

    res.status(200).json({ message: 'Cliente eliminado correctamente' })
  } catch (error) {
    console.error('Error al eliminar cliente:', error.message)
    res.status(400).json({ error: error.message || 'Error al eliminar el cliente' })
  }
}

