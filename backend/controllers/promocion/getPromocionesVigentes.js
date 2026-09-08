// backend/controllers/promocion/getPromocionesVigentes.js
import prisma from '../../db.js'
import { resolverPromocion, includeParaResolver } from '../../lib/resolverPromocion.js'

// GET /api/promociones/vigentes
// Solo las que están activas Y dentro de su rango de fechas ahora mismo.
// La usa VentasView.vue para saber qué descuentos ofrecerle al cajero
// para cada producto del carrito.
//
// Cada promo viaja con "productos_aplicables" (lista plana de ids, ya
// resuelta desde productos directos + productos con alguna de sus
// etiquetas) y "sin_restriccion" (true = aplica a cualquier producto).
// Así el frontend no necesita saber nada de cómo se armó ese alcance.
export const getPromocionesVigentes = async (req, res) => {
  try {
    const ahora = new Date()

    const promociones = await prisma.promocion.findMany({
      where: {
        activa: true,
        fecha_inicio: { lte: ahora },
        fecha_fin: { gte: ahora }
      },
      include: includeParaResolver
    })

    const resueltas = promociones.map(promo => {
      const { productos_aplicables, sin_restriccion } = resolverPromocion(promo)
      return {
        id_promocion: promo.id_promocion,
        nombre_promo: promo.nombre_promo,
        tipo_promo: promo.tipo_promo,
        porcentaje_descuento: promo.porcentaje_descuento,
        cantidad_minima: promo.cantidad_minima,
        cantidad_paga: promo.cantidad_paga,
        metodo_pago_requerido: promo.metodo_pago_requerido,
        productos_aplicables,
        sin_restriccion
      }
    })

    res.json(resueltas)
  } catch (error) {
    console.error('Error obteniendo promociones vigentes:', error)
    res.status(500).json({ error: 'Error al obtener las promociones vigentes' })
  }
}
