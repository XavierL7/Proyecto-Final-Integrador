// backend/controllers/promocion/getPromocionesVigentes.js
import prisma from '../../db.js'

// GET /api/promociones/vigentes
// Solo las que están activas Y dentro de su rango de fechas ahora mismo.
// La usa VentasView.vue para saber qué descuentos ofrecerle al cajero
// para cada producto del carrito.
export const getPromocionesVigentes = async (req, res) => {
  try {
    const ahora = new Date()

    const promociones = await prisma.promocion.findMany({
      where: {
        activa: true,
        fecha_inicio: { lte: ahora },
        fecha_fin: { gte: ahora }
      },
      include: {
        productos_promociones: {
          select: { id_producto: true }
        }
      }
    })

    res.json(promociones)
  } catch (error) {
    console.error('Error obteniendo promociones vigentes:', error)
    res.status(500).json({ error: 'Error al obtener las promociones vigentes' })
  }
}
