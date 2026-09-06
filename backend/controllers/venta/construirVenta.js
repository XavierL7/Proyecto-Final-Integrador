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

// Si esta promo específica aplica al producto del item, devuelve el monto
// de descuento que le correspondería. Si no aplica (producto distinto,
// no llega a la cantidad/condición requerida, etc.) devuelve 0 — nunca
// un error: la selección es automática, así que un candidato que no
// aplica simplemente no se usa, no rompe la venta.
function montoSiAplica(item, promo, metodoPagoNombre) {
  const productosPermitidos = promo.productos_promociones.map(pp => pp.id_producto)
  const aplicaAlProducto = productosPermitidos.length === 0 || productosPermitidos.includes(item.id_producto)
  if (!aplicaAlProducto) return 0

  if (promo.tipo_promo === 'por_metodo_pago') {
    if (promo.metodo_pago_requerido !== metodoPagoNombre) return 0
    return redondear2(item.cantidad * item.precio_unitario * (Number(promo.porcentaje_descuento) / 100))
  }

  if (promo.tipo_promo === 'por_volumen') {
    if (item.cantidad < promo.cantidad_minima) return 0
    return redondear2(item.cantidad * item.precio_unitario * (Number(promo.porcentaje_descuento) / 100))
  }

  if (promo.tipo_promo === 'combo_nxm') {
    // cantidad_minima = "N" (unidades que se llevan por combo, ej. 2 en un 2x1)
    // cantidad_paga   = "M" (unidades que efectivamente se pagan, ej. 1 en un 2x1)
    const n = promo.cantidad_minima
    const m = promo.cantidad_paga
    if (!n || m === null || m === undefined) return 0

    const gruposCompletos = Math.floor(item.cantidad / n)
    if (gruposCompletos === 0) return 0

    // Solo los grupos completos de N unidades entran en el combo; el
    // resto (item.cantidad % n) queda a precio normal. Ej: 2x1, comprás
    // 3 -> 1 grupo completo de 2 (pagás 1 de esas 2) + 1 unidad suelta
    // a precio normal = pagás 2 de las 3.
    return redondear2(item.precio_unitario * gruposCompletos * (n - m))
  }

  // descuento_directo: no depende de cantidad ni método de pago.
  return redondear2(item.cantidad * item.precio_unitario * (Number(promo.porcentaje_descuento) / 100))
}

// Recorre todas las promociones vigentes y devuelve la que le conviene
// más al cliente para este item puntual (mayor descuento). Si ninguna
// aplica, devuelve descuento 0 sin promoción.
function elegirMejorPromo(item, promocionesVigentes, metodoPagoNombre) {
  let mejor = { promo: null, montoDescuento: 0 }

  for (const promo of promocionesVigentes) {
    const monto = montoSiAplica(item, promo, metodoPagoNombre)
    if (monto > mejor.montoDescuento) {
      mejor = { promo, montoDescuento: monto }
    }
  }

  return mejor
}

// Valida método de pago y cliente, y calcula automáticamente el mejor
// descuento para cada item (sin depender de nada que mande el navegador
// sobre qué promoción usar). Devuelve { error } si algo no es válido, o
// los datos ya listos para persistir. No escribe nada en la base todavía
// (eso lo hace guardarVenta) — separar esto permite que una venta se
// "valide" ahora y se "guarde" recién cuando se confirme con huella, en
// el caso de caja compartida.
export async function validarVenta({ items, total, metodo_pago, id_cliente }) {
  if (!items || items.length === 0) {
    return { error: 'La venta debe tener al menos un producto' }
  }

  const metodoPago = await prisma.metodoPago.findFirst({ where: { nombre: metodo_pago } })
  if (!metodoPago) {
    return { error: 'Método de pago no válido' }
  }

  const ahora = new Date()
  const promocionesVigentes = await prisma.promocion.findMany({
    where: {
      activa: true,
      fecha_inicio: { lte: ahora },
      fecha_fin: { gte: ahora }
    },
    include: { productos_promociones: { select: { id_producto: true } } }
  })

  const itemsConDescuento = items.map(item => {
    const { promo, montoDescuento } = elegirMejorPromo(item, promocionesVigentes, metodoPago.nombre)
    return {
      ...item,
      montoDescuento,
      idPromocionValidado: promo ? promo.id_promocion : null
    }
  })

  const totalCalculado = itemsConDescuento.reduce((sum, item) => {
    return sum + (item.cantidad * item.precio_unitario) - item.montoDescuento
  }, 0)

  if (Math.abs(totalCalculado - total) > 0.01) {
    return { error: 'El total no coincide con los items y sus descuentos. Volvé a cargar la venta: puede que las promociones hayan cambiado.' }
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
