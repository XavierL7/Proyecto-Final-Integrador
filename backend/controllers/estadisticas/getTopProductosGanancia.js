// backend/controllers/stats/getTopProductosGanancia.js
import prisma from '../../db.js'

/**
 * ⚠️ La ganancia se calcula con el costo_unitario ACTUAL del producto
 * (tabla Producto), porque no vi un campo tipo `costo_unitario_momento`
 * en Detalle_Venta (si en tu schema sí existe un snapshot del costo por
 * línea, avisame y lo cambio para que la ganancia histórica sea exacta
 * aunque el costo del producto haya cambiado después).
 *
 * Los ingresos por línea sí son históricamente correctos porque usan
 * precio_unitario_momento (el precio real al momento de esa venta).
 */

// GET /api/estadisticas/productos-mas-ganancia?desde=&hasta=&limit=10
export const getTopProductosGanancia = async (req, res) => {
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
        id_producto: true,
        cantidad: true,
        precio_unitario_momento: true,
        monto_descuento_total: true,
        producto: { select: { nombre_producto: true, costo_unitario: true } }
      }
    })

    const acumulado = new Map() // id_producto -> { nombre_producto, unidades_vendidas, ingresos, ganancia }

    for (const d of detalles) {
      const ingresoLinea =
        d.cantidad * Number(d.precio_unitario_momento) - Number(d.monto_descuento_total || 0)
      const costoLinea = d.cantidad * Number(d.producto?.costo_unitario || 0)

      const actual = acumulado.get(d.id_producto) || {
        id_producto: d.id_producto,
        nombre_producto: d.producto?.nombre_producto || '(producto eliminado)',
        unidades_vendidas: 0,
        ingresos: 0,
        ganancia: 0
      }
      actual.unidades_vendidas += d.cantidad
      actual.ingresos += ingresoLinea
      actual.ganancia += ingresoLinea - costoLinea
      acumulado.set(d.id_producto, actual)
    }

    const resultado = Array.from(acumulado.values())
      .map(p => ({
        ...p,
        ingresos: Number(p.ingresos.toFixed(2)),
        ganancia: Number(p.ganancia.toFixed(2))
      }))
      .sort((a, b) => b.ganancia - a.ganancia)
      .slice(0, limit)

    res.json(resultado)
  } catch (error) {
    console.error('Error obteniendo top productos por ganancia:', error)
    res.status(500).json({ error: 'Error al obtener estadística de ganancia por producto' })
  }
}