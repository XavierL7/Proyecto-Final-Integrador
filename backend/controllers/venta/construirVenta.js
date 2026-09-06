// backend/controllers/venta/construirVenta.js
import prisma from '../../db.js'

const MAX_LARGO_IDENTIFICADOR = 34

export function sanearIdentificador(identificador) {
  if (!identificador) return null
  const limpio = String(identificador).trim().slice(0, MAX_LARGO_IDENTIFICADOR)
  return limpio.length > 0 ? limpio : null
}

function redondear2(numero) {
  return Math.round(numero * 100) / 100
}

// Valida que un item realmente pueda usar la promoción que dice tener, y
// devuelve el monto de descuento correcto. Nunca confiamos en el monto de
// descuento que mande el navegador: lo recalculamos acá con los datos
// reales de la promo (activa, vigente, productos permitidos, condiciones).
function calcularDescuentoItem(item, promo, metodoPagoNombre) {
  if (!promo) return { error: `La promoción del producto "${item.nombre_producto || item.id_producto}" ya no existe.` }

  const ahora = new Date()
  if (!promo.activa) {
    return { error: `La promoción "${promo.nombre_promo}" ya no está activa.` }
  }
  if (ahora < new Date(promo.fecha_inicio) || ahora > new Date(promo.fecha_fin)) {
    return { error: `La promoción "${promo.nombre_promo}" no está vigente en este momento.` }
  }

  const productosPermitidos = promo.productos_promociones.map(pp => pp.id_producto)
  if (productosPermitidos.length > 0 && !productosPermitidos.includes(item.id_producto)) {
    return { error: `La promoción "${promo.nombre_promo}" no aplica a ese producto.` }
  }

  if (promo.tipo_promo === 'por_volumen' && item.cantidad < promo.cantidad_minima) {
    return { error: `La promoción "${promo.nombre_promo}" requiere comprar al menos ${promo.cantidad_minima} unidades.` }
  }

  if (promo.tipo_promo === 'por_metodo_pago' && promo.metodo_pago_requerido !== metodoPagoNombre) {
    return { error: `La promoción "${promo.nombre_promo}" solo aplica pagando con ${promo.metodo_pago_requerido}.` }
  }

  const montoDescuento = redondear2(
    item.cantidad * item.precio_unitario * (Number(promo.porcentaje_descuento) / 100)
  )

  return { montoDescuento }
}

// Valida método de pago, promociones y cliente. Devuelve { error } si algo
// no es válido, o los datos ya listos para persistir. No escribe nada en
// la base todavía (eso lo hace guardarVenta) — separar esto permite que
// una venta se "valide" ahora y se "guarde" recién cuando se confirme con
// huella, en el caso de caja compartida.
export async function validarVenta({ items, total, metodo_pago, id_cliente }) {
  if (!items || items.length === 0) {
    return { error: 'La venta debe tener al menos un producto' }
  }

  const metodoPago = await prisma.metodoPago.findFirst({ where: { nombre: metodo_pago } })
  if (!metodoPago) {
    return { error: 'Método de pago no válido' }
  }

  const idsPromociones = [...new Set(
    items.filter(i => i.id_promocion).map(i => Number(i.id_promocion))
  )]

  const promocionesUsadas = idsPromociones.length > 0
    ? await prisma.promocion.findMany({
        where: { id_promocion: { in: idsPromociones } },
        include: { productos_promociones: { select: { id_producto: true } } }
      })
    : []

  const promoPorId = new Map(promocionesUsadas.map(p => [p.id_promocion, p]))

  const itemsConDescuento = []
  for (const item of items) {
    let montoDescuento = 0
    let idPromocionValidado = null

    if (item.id_promocion) {
      const promo = promoPorId.get(Number(item.id_promocion))
      const resultado = calcularDescuentoItem(item, promo, metodoPago.nombre)
      if (resultado.error) return { error: resultado.error }
      montoDescuento = resultado.montoDescuento
      idPromocionValidado = promo.id_promocion
    }

    itemsConDescuento.push({ ...item, montoDescuento, idPromocionValidado })
  }

  const totalCalculado = itemsConDescuento.reduce((sum, item) => {
    return sum + (item.cantidad * item.precio_unitario) - item.montoDescuento
  }, 0)

  if (Math.abs(totalCalculado - total) > 0.01) {
    return { error: 'El total no coincide con los items y sus descuentos.' }
  }

  let idClienteValidado = null
  if (id_cliente !== null && id_cliente !== undefined && id_cliente !== '') {
    const clienteExiste = await prisma.cliente.findUnique({ where: { id_cliente: parseInt(id_cliente) } })
    if (!clienteExiste) return { error: 'El cliente seleccionado no existe.' }
    idClienteValidado = clienteExiste.id_cliente
  }

  return { metodoPago, itemsConDescuento, idClienteValidado }
}

// Persiste una venta ya validada. id_trabajador e id_caja se pasan aparte
// porque, según el flujo, pueden salir de lugares distintos:
// - venta directa: id_trabajador = quien está logueado (JWT).
// - caja compartida: id_trabajador = quien identificó su huella al
//   confirmar el pago (puede no ser quien abrió la caja).
// id_log_huella_trabajador, si se pasa, además dispara el registro en
// Log_Ventas_Huella (solo aplica al flujo de caja compartida).
export async function guardarVenta({
  itemsConDescuento,
  total,
  metodoPago,
  datos_pago,
  idClienteValidado,
  id_trabajador,
  id_caja,
  id_log_huella_trabajador = null
}) {
  const identificador = sanearIdentificador(datos_pago?.identificador)

  const nuevaVenta = await prisma.$transaction(async (tx) => {
    const venta = await tx.venta.create({
      data: {
        fecha_hora: new Date(),
        fecha: new Date(),
        total_neto: total,
        id_trabajador,
        id_caja,
        id_cliente: idClienteValidado,
        cambio_total: datos_pago?.cambio || null,
      }
    })

    for (const item of itemsConDescuento) {
      await tx.detalle_Venta.create({
        data: {
          id_venta: venta.id_venta,
          id_producto: item.id_producto,
          cantidad: item.cantidad,
          precio_unitario_momento: item.precio_unitario,
          id_promocion: item.idPromocionValidado,
          monto_descuento_total: item.montoDescuento
        }
      })

      await tx.producto.update({
        where: { id_producto: item.id_producto },
        data: { stock_actual: { decrement: item.cantidad } }
      })
    }

    await tx.detalle_Pago_Venta.create({
      data: {
        id_venta: venta.id_venta,
        id_metodo_pago: metodoPago.id_metodo_pago,
        monto: total,
        cambio_devuelto: datos_pago?.cambio || null,
        identificador
      }
    })

    if (idClienteValidado) {
      await tx.cliente.update({
        where: { id_cliente: idClienteValidado },
        data: { fecha_ultima_compra: new Date() }
      })
    }

    // Caja compartida: dejamos registrado quién confirmó esta venta
    // puntual con su huella (independiente de quién abrió la caja).
    if (id_log_huella_trabajador) {
      await tx.log_Ventas_Huella.create({
        data: {
          id_venta: venta.id_venta,
          id_trabajador: id_log_huella_trabajador,
          id_caja
        }
      })
    }

    return venta
  })

  return nuevaVenta
}
