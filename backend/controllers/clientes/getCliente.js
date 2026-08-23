import prisma from '../../db.js'

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