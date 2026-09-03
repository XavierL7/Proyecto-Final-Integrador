// backend/controllers/venta/createVenta.js
import prisma from '../../db.js'

// Límite defensivo: el identificador solo debería ser "1234" (últimos 4
// dígitos de tarjeta) o un alias de Mercado Pago/CBU. Nunca debería
// necesitar más de 34 caracteres (el máximo de un CBU son 22 dígitos).
// Esto es una segunda barrera por si el front cambia; la barrera real
// (no mandar el número completo ni CVV/vencimiento/nombre) está en
// PagoTarjeta.vue y PagoTransferencia.vue.
const MAX_LARGO_IDENTIFICADOR = 34

function sanearIdentificador(identificador) {
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

  // Si la promo tiene productos específicos asociados, el producto del
  // item tiene que estar entre ellos. Si no tiene ninguno asociado,
  // aplica a cualquier producto.
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

export const createVenta = async (req, res) => {
  try {
    const userId = req.userId
    const { items, total, metodo_pago, datos_pago, id_cliente } = req.body

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'La venta debe tener al menos un producto' })
    }

    const metodoPago = await prisma.metodoPago.findFirst({
      where: { nombre: metodo_pago }
    })

    if (!metodoPago) {
      return res.status(400).json({ error: 'Método de pago no válido' })
    }

    // Traemos de una sola vez todas las promociones que los items dicen
    // usar, para validar cada una contra la base de datos (no contra lo
    // que mandó el navegador).
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

    // Calculamos el descuento real de cada item y, de paso, validamos
    // que cada promoción usada sea legítima.
    const itemsConDescuento = []
    for (const item of items) {
      let montoDescuento = 0
      let idPromocionValidado = null

      if (item.id_promocion) {
        const promo = promoPorId.get(Number(item.id_promocion))
        const resultado = calcularDescuentoItem(item, promo, metodoPago.nombre)

        if (resultado.error) {
          return res.status(400).json({ error: resultado.error })
        }

        montoDescuento = resultado.montoDescuento
        idPromocionValidado = promo.id_promocion
      }

      itemsConDescuento.push({ ...item, montoDescuento, idPromocionValidado })
    }

    const totalCalculado = itemsConDescuento.reduce((sum, item) => {
      return sum + (item.cantidad * item.precio_unitario) - item.montoDescuento
    }, 0)

    if (Math.abs(totalCalculado - total) > 0.01) {
      return res.status(400).json({ error: 'El total no coincide con los items y sus descuentos.' })
    }

    // La venta se registra en LA CAJA DE ESTE TRABAJADOR (no en "la" caja
    // abierta del sistema: puede haber varias PCs vendiendo en paralelo,
    // cada una con su propio cajero y su propia caja abierta).
    // Nos fijamos en su Sesion_Vendedor activa para saber cuál es.
    const sesionActiva = await prisma.sesion_Vendedor.findFirst({
      where: { id_trabajador: userId, fecha_hora_fin: null },
      include: { caja: true }
    })

    if (!sesionActiva) {
      return res.status(400).json({
        error: 'No tenés ninguna caja abierta. Abrí una caja antes de registrar ventas.'
      })
    }

    const cajaActiva = sesionActiva.caja

    // id_cliente es opcional: null/ausente = "Cliente General".
    // Si viene, validamos que exista para no guardar una FK inválida.
    let idClienteValidado = null
    if (id_cliente !== null && id_cliente !== undefined && id_cliente !== '') {
      const clienteExiste = await prisma.cliente.findUnique({
        where: { id_cliente: parseInt(id_cliente) }
      })
      if (!clienteExiste) {
        return res.status(400).json({ error: 'El cliente seleccionado no existe.' })
      }
      idClienteValidado = clienteExiste.id_cliente
    }

    const identificador = sanearIdentificador(datos_pago?.identificador)

    const nuevaVenta = await prisma.$transaction(async (tx) => {
      const venta = await tx.venta.create({
        data: {
          fecha_hora: new Date(),
          fecha: new Date(),
          total_neto: total,
          id_trabajador: userId,
          id_caja: cajaActiva.id_caja,
          id_cliente: idClienteValidado, // null = Cliente General
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
          // Últimos 4 dígitos de tarjeta o alias de transferencia/Mercado
          // Pago. Nunca CVV, vencimiento ni nombre del titular.
          identificador
        }
      })

      // Si la venta es de un cliente identificado (no "Cliente General"),
      // actualizamos su fecha de última compra -> así el listado de
      // clientes (que ordena por esta fecha) refleja la actividad real.
      if (idClienteValidado) {
        await tx.cliente.update({
          where: { id_cliente: idClienteValidado },
          data: { fecha_ultima_compra: new Date() }
        })
      }

      return venta
    })

    res.status(201).json({
      success: true,
      message: 'Venta registrada con éxito',
      venta: nuevaVenta
    })

  } catch (error) {
    console.error('Error creando venta:', error)
    res.status(500).json({ error: 'Error al registrar la venta' })
  }
}
