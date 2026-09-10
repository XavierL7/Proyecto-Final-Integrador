// backend/controllers/stats/getTopProductosVendidos.js
import prisma from '../../db.js'

// GET /api/estadisticas/productos-mas-vendidos?desde=YYYY-MM-DD&hasta=YYYY-MM-DD&limit=10
export const getTopProductosVendidos = async (req, res) => {
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

    // No usamos groupBy con _sum porque el "ingreso" de cada línea es un
    // cálculo (cantidad * precio_unitario_momento - monto_descuento_total),
    // no una columna que se pueda sumar directo. Por eso se trae cada línea
    // y se acumula en JS, igual que en getTopEtiquetas.js.
    const detalles = await prisma.detalle_Venta.findMany({
      where: Object.keys(filtroFecha).length
        ? { venta: { fecha_hora: filtroFecha } }
        : undefined,
      select: {
        id_producto: true,
        cantidad: true,
        precio_unitario_momento: true,
        monto_descuento_total: true,
        producto: { select: { nombre_producto: true } }
      }
    })

    const acumulado = new Map() // id_producto -> { nombre_producto, unidades_vendidas, ingresos }

    for (const d of detalles) {
      const ingresoLinea =
        d.cantidad * Number(d.precio_unitario_momento) - Number(d.monto_descuento_total || 0)

      const actual = acumulado.get(d.id_producto) || {
        id_producto: d.id_producto,
        nombre_producto: d.producto?.nombre_producto || '(producto eliminado)',
        unidades_vendidas: 0,
        ingresos: 0
      }
      actual.unidades_vendidas += d.cantidad
      actual.ingresos += ingresoLinea
      acumulado.set(d.id_producto, actual)
    }

    const resultado = Array.from(acumulado.values())
      .map(p => ({ ...p, ingresos: Number(p.ingresos.toFixed(2)) }))
      .sort((a, b) => b.unidades_vendidas - a.unidades_vendidas)
      .slice(0, limit)

    res.json(resultado)
  } catch (error) {
    console.error('Error obteniendo top productos vendidos:', error)
    res.status(500).json({ error: 'Error al obtener estadística de productos más vendidos' })
  }
}