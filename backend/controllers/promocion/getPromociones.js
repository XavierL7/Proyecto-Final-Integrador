// backend/controllers/promocion/getPromociones.js
import prisma from '../../db.js'

// GET /api/promociones
export const getPromociones = async (req, res) => {
  try {
    const promociones = await prisma.promocion.findMany({
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
      orderBy: [{ activa: 'desc' }, { fecha_inicio: 'desc' }]
    })

    res.json(promociones)
  } catch (error) {
    console.error('Error obteniendo promociones:', error)
    res.status(500).json({ error: 'Error al obtener las promociones' })
  }
}
