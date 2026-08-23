import prisma from '../../db.js'

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