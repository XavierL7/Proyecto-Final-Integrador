// backend/controllers/caja/getCajaDetalle.js
import prisma from '../../db.js'

function redondear2(numero) {
  return Math.round(Number(numero) * 100) / 100
}

// GET /api/cajas/:id/detalle
// Devuelve todo lo necesario para el popup de detalle de una caja:
// - Datos generales de la caja (igual que en el historial)
// - Resumen de ingresos desglosado por método de pago
// - Egresos manuales registrados durante esa caja
// - Saldo esperado (total y solo efectivo) vs. lo que realmente se contó
// - El listado completo de ventas de esa caja, con sus productos y pagos
export const getCajaDetalle = async (req, res) => {
  try {
    const { id } = req.params
    const idCaja = parseInt(id)

    const caja = await prisma.caja.findUnique({
      where: { id_caja: idCaja },
      include: {
        trabajador_apertura: { select: { nombre: true, apellido: true } },
        trabajador_cierre: { select: { nombre: true, apellido: true } },
        arqueos_caja: {
          orderBy: { fecha_hora: 'desc' },
          include: { trabajador: { select: { nombre: true, apellido: true } } }
        }
      }
    })

    if (!caja) {
      return res.status(404).json({ error: 'Caja no encontrada.' })
    }

    const ventas = await prisma.venta.findMany({
      where: { id_caja: idCaja },
      include: {
        trabajador: { select: { nombre: true, apellido: true } },
        cliente: { select: { id_cliente: true, nombre: true, apellido: true, dni: true } },
        detalle_ventas: {
          include: { producto: { select: { nombre_producto: true } } }
        },
        detalle_pago_venta: {
          include: { metodo_pago: true }
        }
      },
      orderBy: { fecha_hora: 'asc' }
    })

    const movimientos = await prisma.movimiento_Caja.findMany({
      where: { id_caja: idCaja },
      include: { trabajador: { select: { nombre: true, apellido: true } } },
      orderBy: { fecha_hora: 'asc' }
    })

    // --------------------------------------------------------
    // Desglose de ingresos por método de pago
    // --------------------------------------------------------
    const ingresosPorMetodo = new Map() // nombre -> monto acumulado

    for (const venta of ventas) {
      for (const pago of venta.detalle_pago_venta) {
        const nombre = pago.metodo_pago.nombre
        const actual = ingresosPorMetodo.get(nombre) || 0
        ingresosPorMetodo.set(nombre, redondear2(actual + Number(pago.monto)))
      }
    }

    const totalIngresos = redondear2(
      [...ingresosPorMetodo.values()].reduce((sum, monto) => sum + monto, 0)
    )

    const totalEfectivo = ingresosPorMetodo.get('Efectivo') || 0

    // --------------------------------------------------------
    // Egresos manuales (retiros / ajustes negativos) hechos durante la caja
    // --------------------------------------------------------
    const egresos = movimientos.filter(m =>
      m.tipo_movimiento === 'egreso_retiro' || m.tipo_movimiento === 'egreso_ajuste_negativo'
    )
    const totalEgresos = redondear2(egresos.reduce((sum, m) => sum + Number(m.monto), 0))

    // --------------------------------------------------------
    // Saldos: si la caja ya está cerrada usamos lo que se guardó al
    // cerrarla (monto_final_esperado / monto_final_real), que es el
    // registro "oficial". Si sigue abierta, lo calculamos en vivo.
    // --------------------------------------------------------
    const montoInicial = Number(caja.monto_inicial)

    const saldoEfectivoEsperado = caja.estado === 'cerrada' && caja.monto_final_esperado !== null
      ? Number(caja.monto_final_esperado)
      : redondear2(montoInicial + totalEfectivo - totalEgresos)

    const saldoTotalEsperado = redondear2(montoInicial + totalIngresos - totalEgresos)

    const montoContado = caja.monto_final_real !== null ? Number(caja.monto_final_real) : null
    const diferencia = caja.arqueos_caja?.[0]?.diferencia !== undefined && caja.arqueos_caja?.[0] !== null
      ? Number(caja.arqueos_caja[0].diferencia)
      : (montoContado !== null ? redondear2(montoContado - saldoEfectivoEsperado) : null)

    res.json({
      caja: {
        id_caja: caja.id_caja,
        estado: caja.estado,
        modo_autenticacion: caja.modo_autenticacion,
        fecha_hora_apertura: caja.fecha_hora_apertura,
        fecha_hora_cierre: caja.fecha_hora_cierre,
        monto_inicial: montoInicial,
        monto_final_esperado: caja.monto_final_esperado !== null ? Number(caja.monto_final_esperado) : null,
        monto_final_real: montoContado,
        trabajador_apertura: caja.trabajador_apertura,
        trabajador_cierre: caja.trabajador_cierre,
        observaciones: caja.arqueos_caja?.[0]?.observaciones || null
      },
      resumen: {
        ingresosPorMetodo: Object.fromEntries(ingresosPorMetodo),
        totalIngresos,
        totalEgresos,
        saldoEfectivoEsperado,
        saldoTotalEsperado,
        montoContado,
        diferencia,
        cantidadVentas: ventas.length
      },
      ventas: ventas.map(v => ({
        id_venta: v.id_venta,
        fecha_hora: v.fecha_hora,
        total_neto: Number(v.total_neto),
        trabajador: v.trabajador,
        cliente: v.cliente,
        productos: v.detalle_ventas.map(d => ({
          nombre_producto: d.producto.nombre_producto,
          cantidad: d.cantidad,
          precio_unitario_momento: Number(d.precio_unitario_momento),
          monto_descuento_total: d.monto_descuento_total !== null ? Number(d.monto_descuento_total) : 0
        })),
        metodos_pago: v.detalle_pago_venta.map(p => ({
          nombre: p.metodo_pago.nombre,
          monto: Number(p.monto)
        }))
      })),
      egresos: egresos.map(m => ({
        id_movimiento: m.id_movimiento,
        fecha_hora: m.fecha_hora,
        monto: Number(m.monto),
        descripcion: m.descripcion,
        trabajador: m.trabajador
      }))
    })
  } catch (error) {
    console.error('Error obteniendo detalle de caja:', error)
    res.status(500).json({ error: 'Error al obtener el detalle de la caja' })
  }
}
