// backend/controllers/admin/trabajadores/getTrabajadores.js
import prisma from '../../../db.js'

export const getTrabajadores = async (req, res) => {
  try {
    const trabajadores = await prisma.trabajador.findMany({
      include: { rol: true }
    })
    res.json(trabajadores)
  } catch (error) {
    console.error('Error obteniendo trabajadores:', error)
    res.status(500).json({ error: 'Error al obtener trabajadores' })
  }
}