// backend/controllers/venta/crearVentaPendiente.js
import prisma from '../../db.js'
import { validarVenta } from './construirVenta.js'
import { iniciarVentaPendiente, hayVentaPendiente } from '../../lib/ventaPendienteState.js'

// POST /api/ventas/pendiente
// Lo llama VentasView.vue cuando el cajero aprieta "Confirmar pago" en una
// caja compartida (modo_autenticacion = 'por_venta'). Valida todo igual
// que una venta normal, pero en vez de guardarla la deja "esperando
// huella". La persistencia real la dispara identificarHuella.js cuando
// alguien pone el dedo en el lector.
export const crearVentaPendiente = async (req, res) => {
  try {
    const userId = req.userId
    const { items, total, metodo_pago, datos_pago, id_cliente } = req.body

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

    if (cajaActiva.modo_autenticacion !== 'por_venta') {
      return res.status(400).json({
        error: 'Esta caja no es compartida: registrá la venta directo con POST /api/ventas.'
      })
    }

    if (hayVentaPendiente()) {
      return res.status(409).json({
        error: 'Ya hay una venta esperando confirmación por huella. Esperá a que se resuelva antes de iniciar otra.'
      })
    }

    const resultado = await validarVenta({ items, total, metodo_pago, id_cliente })
    if (resultado.error) {
      return res.status(400).json({ error: resultado.error })
    }

    const { metodoPago, itemsConDescuento, idClienteValidado } = resultado

    iniciarVentaPendiente({
      id_caja: cajaActiva.id_caja,
      total,
      datos_pago,
      metodoPago,
      itemsConDescuento,
      idClienteValidado
    })

    res.status(202).json({
      success: true,
      message: 'Venta validada. Esperando que alguien confirme con el lector de huella.'
    })
  } catch (error) {
    console.error('Error creando venta pendiente:', error)
    res.status(500).json({ error: 'Error al iniciar la venta pendiente' })
  }
}
