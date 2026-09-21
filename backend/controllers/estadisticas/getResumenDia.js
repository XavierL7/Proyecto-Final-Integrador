// backend/controllers/estadisticas/getResumenDia.js
import prisma from '../../db.js'

function redondear2(numero) {
  return Math.round(Number(numero) * 100) / 100
}

/**
 * KPIs definidos así (ajustables si tu negocio los calcula distinto):
 * - precio_promedio     = total $ / unidades vendidas (precio de venta promedio por unidad)
 * - productos_por_ticket = unidades vendidas / cantidad de tickets (ítems por venta)
 * - ticket_promedio     = total $ / cantidad de tickets
 */

// GET /api/estadisticas/resumen-dia?fecha=YYYY-MM-DD
// Sin `fecha`, usa el día de hoy. Pensado para el dashboard "cómo va el día".
export const getResumenDia = async (req, res) => {
  try {
    const fechaBase = req.query.fecha ? new Date(req.query.fecha) : new Date()

    const inicio = new Date(fechaBase)
    inicio.setHours(0, 0, 0, 0)
    const fin = new Date(fechaBase)
    fin.setHours(23, 59, 59, 999)

    const ventas = await prisma.venta.findMany({
      where: { fecha_hora: { gte: inicio, lte: fin } },
      select: {
        id_venta: true,
        total_neto: true,
        id_trabajador: true,
        trabajador: { select: { nombre: true, apellido: true } },
        detalle_ventas: {
          select: {
            cantidad: true,
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
        }
      }
    })

    // ---------- KPIs generales ----------
    const tickets = ventas.length
    const total = redondear2(ventas.reduce((sum, v) => sum + Number(v.total_neto), 0))

    let unidades = 0
    for (const v of ventas) {
      for (const d of v.detalle_ventas) unidades += d.cantidad
    }

    const precioPromedio = unidades > 0 ? redondear2(total / unidades) : 0
    const productosPorTicket = tickets > 0 ? redondear2(unidades / tickets) : 0
    const ticketPromedio = tickets > 0 ? redondear2(total / tickets) : 0

    // ---------- Por vendedor ----------
    const porVendedorMap = new Map() // id_trabajador -> { nombre, total, unidades }
    for (const v of ventas) {
      const unidadesVenta = v.detalle_ventas.reduce((sum, d) => sum + d.cantidad, 0)
      const actual = porVendedorMap.get(v.id_trabajador) || {
        id_trabajador: v.id_trabajador,
        nombre: v.trabajador ? `${v.trabajador.nombre} ${v.trabajador.apellido}` : '(trabajador eliminado)',
        total: 0,
        unidades: 0
      }
      actual.total += Number(v.total_neto)
      actual.unidades += unidadesVenta
      porVendedorMap.set(v.id_trabajador, actual)
    }

    const porVendedor = Array.from(porVendedorMap.values())
      .map(v => ({ ...v, total: redondear2(v.total) }))
      .sort((a, b) => b.total - a.total)

    // ---------- Por etiqueta (en % de unidades, para la dona) ----------
    const porEtiquetaMap = new Map() // id_etiqueta -> { nombre_etiqueta, unidades }
    for (const v of ventas) {
      for (const d of v.detalle_ventas) {
        const relaciones = d.producto?.productos_etiquetas || []
        for (const rel of relaciones) {
          const et = rel.etiqueta
          if (!et) continue
          const actual = porEtiquetaMap.get(et.id_etiqueta) || {
            id_etiqueta: et.id_etiqueta,
            nombre_etiqueta: et.nombre_etiqueta,
            unidades: 0
          }
          actual.unidades += d.cantidad
          porEtiquetaMap.set(et.id_etiqueta, actual)
        }
      }
    }

    const totalUnidadesEtiquetadas = Array.from(porEtiquetaMap.values())
      .reduce((sum, e) => sum + e.unidades, 0)

    const porEtiqueta = Array.from(porEtiquetaMap.values())
      .map(e => ({
        ...e,
        porcentaje: totalUnidadesEtiquetadas > 0
          ? redondear2((e.unidades / totalUnidadesEtiquetadas) * 100)
          : 0
      }))
      .sort((a, b) => b.unidades - a.unidades)

    res.json({
      fecha: inicio.toISOString().slice(0, 10),
      tickets,
      total,
      unidades,
      precio_promedio: precioPromedio,
      productos_por_ticket: productosPorTicket,
      ticket_promedio: ticketPromedio,
      porVendedor,
      porEtiqueta
    })
  } catch (error) {
    console.error('Error obteniendo resumen del día:', error)
    res.status(500).json({ error: 'Error al obtener el resumen del día' })
  }
}
