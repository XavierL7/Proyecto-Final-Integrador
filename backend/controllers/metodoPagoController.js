// backend/controllers/metodoPagoController.js
import prisma from '../db.js';

// Obtener todos los métodos de pago activos
export const obtenerMetodosPago = async (req, res) => {
  try {
    const metodos = await prisma.metodoPago.findMany({
      where: { activo: true },
      orderBy: { nombre: 'asc' }
    });
    res.json(metodos);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error al obtener métodos de pago' });
  }
};