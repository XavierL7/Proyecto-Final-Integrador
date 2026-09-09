// backend/controllers/clientes/deleteCliente.js
import prisma from '../../db.js'

export const eliminarCliente = async (req, res) => {
  const { id } = req.params

  try {
    const usosEnVentas = await prisma.venta.count({
      where: { id_cliente: Number(id) }
    })

    if (usosEnVentas > 0) {
      return res.status(400).json({
        error: `Este cliente ya tiene ${usosEnVentas} venta(s) registradas y no se puede eliminar. Deshabilitalo en su lugar.`
      })
    }

    await prisma.cliente.delete({
      where: { id_cliente: Number(id) }
    })

    res.status(200).json({ message: 'Cliente eliminado correctamente' })
  } catch (error) {
    console.error('Error al eliminar cliente:', error.message)
    res.status(400).json({ error: error.message || 'Error al eliminar el cliente' })
  }
}
