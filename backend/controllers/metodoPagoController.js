// backend/controllers/metodoPagoController.js
import prisma from '../db.js'

// Obtener todos los métodos de pago activos
export const getMetodosPago = async (req, res) => {
  try {
    const metodos = await prisma.metodoPago.findMany({
      where: { activo: true },
      orderBy: { id_metodo_pago: 'asc' }
    })
    res.json(metodos)
  } catch (error) {
    console.error('Error obteniendo métodos de pago:', error)
    res.status(500).json({ error: 'Error al obtener métodos de pago' })
  }
}