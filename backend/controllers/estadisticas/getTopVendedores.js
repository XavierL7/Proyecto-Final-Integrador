// backend/controllers/estadisticas/getTopVendedores.js
import prisma from '../../db.js'

/**
 * ⚠️ SUPUESTO A VERIFICAR:
 * Asumo que el modelo `venta` tiene un campo `id_trabajador` (quien hizo
 * la venta) y `total_neto`, y que existe `prisma.trabajador` con
 * `id_trabajador, nombre, apellido` (esto último ya lo vi confirmado en
 * HistorialVentasView.vue: `venta.trabajador?.nombre`).
 */

// GET /api/estadisticas/vendedores-top?desde=&hasta=&limit=10
export const getTopVendedores = async (req, res) => {
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

    const agrupado = await prisma.venta.groupBy({
      by: ['id_trabajador'],
      where: Object.keys(filtroFecha).length ? { fecha_hora: filtroFecha } : undefined,
      _sum: { total_neto: true },
      _count: { id_venta: true },
      orderBy: { _sum: { total_neto: 'desc' } },
      take: limit
    })

    if (agrupado.length === 0) return res.json([])

    const trabajadores = await prisma.trabajador.findMany({
      where: { id_trabajador: { in: agrupado.map(a => a.id_trabajador) } }
    })
    const mapaTrabajadores = new Map(trabajadores.map(t => [t.id_trabajador, t]))

    const resultado = agrupado.map(a => {
      const t = mapaTrabajadores.get(a.id_trabajador)
      return {
        id_trabajador: a.id_trabajador,
        nombre: t ? `${t.nombre} ${t.apellido}` : '(trabajador eliminado)',
        cantidad_ventas: a._count.id_venta,
        total_vendido: Number(a._sum.total_neto || 0)
      }
    })

    res.json(resultado)
  } catch (error) {
    console.error('Error obteniendo top vendedores:', error)
    res.status(500).json({ error: 'Error al obtener estadística de vendedores' })
  }
}