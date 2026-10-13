// backend/controllers/promocion/getPromociones.js
import prisma from '../../db.js'

// GET /api/promociones?page=1&limit=10
export const getPromociones = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1)
    const limit = Math.max(1, parseInt(req.query.limit) || 10)
    const skip = (page - 1) * limit

    const [promociones, total] = await Promise.all([
      prisma.promocion.findMany({
        include: {
          productos_promociones: {
            include: {
              producto: { select: { id_producto: true, nombre_producto: true } }
            }
          },
          promociones_etiquetas: {
            include: {
              etiqueta: { select: { id_etiqueta: true, nombre_etiqueta: true } }
            }
          }
        },
        orderBy: [{ activa: 'desc' }, { fecha_inicio: 'desc' }],
        skip,
        take: limit
      }),
      prisma.promocion.count()
    ])

    res.json({
      promociones,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit))
    })
  } catch (error) {
    console.error('Error obteniendo promociones:', error)
    res.status(500).json({ error: 'Error al obtener las promociones' })
  }
}
