// backend/controllers/caja/getMovimientosManuales.js
import prisma from '../../db.js'

// GET /api/cajas/:id/movimientos
// Devuelve los ingresos/egresos manuales de una caja, con el nombre de
// quién los registró.
export const getMovimientosManuales = async (req, res) => {
  try {
    const idCaja = parseInt(req.params.id)

    const movimientos = await prisma.movimiento_Caja.findMany({
      where: { id_caja: idCaja },
      include: {
        trabajador: {
          select: { nombre: true, apellido: true }
        }
      },
      orderBy: { fecha_hora: 'desc' }
    })

    res.json(movimientos)
  } catch (error) {
    console.error('Error obteniendo movimientos de caja:', error)
    res.status(500).json({ error: 'Error al obtener los movimientos de caja.' })
  }
}
