// backend/controllers/stats/getTopEtiquetas.js
import prisma from '../../db.js'

/**
 * Una etiqueta está en N productos y un producto puede tener M etiquetas,
 * así que no se puede resolver con un groupBy directo: se traen las líneas
 * de venta del período con sus etiquetas (vía producto -> productos_etiquetas
 * -> etiqueta) y se suma todo en JS.
 *
 * Si el volumen de ventas crece mucho, conviene pasar esto a una consulta
 * SQL cruda con prisma.$queryRaw haciendo los JOINs y el GROUP BY en la base.
 */

// GET /api/estadisticas/etiquetas-top?desde=&hasta=&limit=10
export const getTopEtiquetas = async (req, res) => {
  try {
    const { desde, hasta } = req.query
    const limit = Math.min(parseInt(req.query.limit) || 10, 50)

    const filtroFecha = {}
    if (desde) filtroFecha.gte = new Date(desde)
    if (hasta) {
      const fin = new Date(hasta)
      fin.setHours(23, 59, 59, 999)
      filtroFecha.lte = fin
    }

    const detalles = await prisma.detalle_Venta.findMany({
      where: Object.keys(filtroFecha).length
        ? { venta: { fecha_hora: filtroFecha } }
        : undefined,
      select: {
        cantidad: true,
        precio_unitario_momento: true,
        monto_descuento_total: true,
        producto: {
          select: {
            productos_etiquetas: {
              select: {
                etiqueta: { select: { id_etiqueta: true, nombre_etiqueta: true } }
              }
            }
          }
        }
      }
    })

    const acumulado = new Map() // id_etiqueta -> { id_etiqueta, nombre_etiqueta, unidades_vendidas, ingresos }

    for (const detalle of detalles) {
      const ingresoLinea =
        detalle.cantidad * Number(detalle.precio_unitario_momento) -
        Number(detalle.monto_descuento_total || 0)

      const relaciones = detalle.producto?.productos_etiquetas || []
      for (const rel of relaciones) {
        const et = rel.etiqueta
        if (!et) continue
        const actual = acumulado.get(et.id_etiqueta) || {
          id_etiqueta: et.id_etiqueta,
          nombre_etiqueta: et.nombre_etiqueta,
          unidades_vendidas: 0,
          ingresos: 0
        }
        actual.unidades_vendidas += detalle.cantidad
        actual.ingresos += ingresoLinea
        acumulado.set(et.id_etiqueta, actual)
      }
    }

    const resultado = Array.from(acumulado.values())
      .map(e => ({ ...e, ingresos: Number(e.ingresos.toFixed(2)) }))
      .sort((a, b) => b.unidades_vendidas - a.unidades_vendidas)
      .slice(0, limit)

    res.json(resultado)
  } catch (error) {
    console.error('Error obteniendo top etiquetas:', error)
    res.status(500).json({ error: 'Error al obtener estadística de etiquetas' })
  }
}