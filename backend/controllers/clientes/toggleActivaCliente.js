// backend/controllers/clientes/toggleActivaCliente.js
import prisma from '../../db.js'

// PUT /api/clientes/:id/activa   { activo: true|false }
export const toggleActivaCliente = async (req, res) => {
  try {
    const { id } = req.params
    const { activo } = req.body

    const cliente = await prisma.cliente.update({
      where: { id_cliente: Number(id) },
      data: { activo: Boolean(activo) }
    })

    res.json({
      success: true,
      message: `Cliente ${cliente.activo ? 'habilitado' : 'deshabilitado'} correctamente.`,
      cliente
    })
  } catch (error) {
    console.error('Error cambiando estado del cliente:', error)
    res.status(500).json({ error: 'Error al cambiar el estado del cliente' })
  }
}
