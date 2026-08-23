import prisma from '../../db.js'

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