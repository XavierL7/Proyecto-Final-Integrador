// backend/controllers/venta/createVenta.js
import prisma from '../../db.js'
import { validarVenta, guardarVenta } from './construirVenta.js'

export const createVenta = async (req, res) => {
  try {
    const userId = req.userId
    const { items, total, metodo_pago, datos_pago, id_cliente } = req.body

    // La venta se registra en LA CAJA DE ESTE TRABAJADOR (no en "la" caja
    // abierta del sistema: puede haber varias PCs vendiendo en paralelo,
    // cada una con su propio cajero y su propia caja abierta).
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

    // Caja compartida (por_venta): acá NO se registra la venta directo.
    // El front tiene que llamar a /api/ventas/pendiente y esperar a que
    // alguien confirme con el lector de huella.
    if (cajaActiva.modo_autenticacion === 'por_venta') {
      return res.status(400).json({
        error: 'Esta caja es compartida: confirmá el pago desde la pantalla de ventas para pedir la huella; no se registra directo.'
      })
    }

    const resultado = await validarVenta({ items, total, metodo_pago, id_cliente })
    if (resultado.error) {
      return res.status(400).json({ error: resultado.error })
    }

    const { metodoPago, itemsConDescuento, idClienteValidado } = resultado

    const nuevaVenta = await guardarVenta({
      itemsConDescuento,
      total,
      metodoPago,
      datos_pago,
      idClienteValidado,
      id_trabajador: userId,
      id_caja: cajaActiva.id_caja
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
