// backend/controllers/venta/createVenta.js (~80 líneas)
import prisma from '../../db.js'

export const createVenta = async (req, res) => {
  try {
    const userId = req.userId
    const { items, total, metodo_pago, datos_pago } = req.body

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'La venta debe tener al menos un producto' })
    }

    const totalCalculado = items.reduce((sum, item) => {
      return sum + (item.cantidad * item.precio_unitario)
    }, 0)

    if (Math.abs(totalCalculado - total) > 0.01) {
      return res.status(400).json({ error: 'El total no coincide con los items' })
    }

    const metodoPago = await prisma.metodoPago.findFirst({
      where: { nombre: metodo_pago }
    })

    if (!metodoPago) {
      return res.status(400).json({ error: 'Método de pago no válido' })
    }

    const nuevaVenta = await prisma.$transaction(async (tx) => {
      const venta = await tx.venta.create({
        data: {
          fecha_hora: new Date(),
          fecha: new Date(),
          total_neto: total,
          id_trabajador: userId,
          id_caja: 1,
        }
      })

      for (const item of items) {
        await tx.detalle_Venta.create({
          data: {
            id_venta: venta.id_venta,
            id_producto: item.id_producto,
            cantidad: item.cantidad,
            precio_unitario_momento: item.precio_unitario,
            monto_descuento_total: 0
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
          cambio_devuelto: datos_pago?.cambio || null
        }
      })

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