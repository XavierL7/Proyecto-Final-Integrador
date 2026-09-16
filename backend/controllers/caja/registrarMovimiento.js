// backend/controllers/caja/registrarMovimiento.js
import prisma from '../../db.js'
import { iniciarMovimientoPendiente, hayMovimientoPendiente } from '../../lib/movimientoPendienteState.js'
import { hayVentaPendiente } from '../../lib/ventaPendienteState.js'

// POST /api/cajas/:id/movimientos   { tipo: 'ingreso' | 'egreso', monto, descripcion }
// Para movimientos manuales de dinero NO relacionados a una venta
// (ej. un retiro de efectivo, un aporte extra, el pago de un gasto
// chico). Se registran en la misma tabla que usan las ventas
// (Movimientos_Caja), pero con id_venta en null.
//
// Caja individual (sesion_inicial): se guarda directo, atribuido a quien
// está logueado (igual que antes).
//
// Caja compartida (por_venta): cualquiera puede estar operando la caja,
// así que no alcanza con el usuario logueado en la PC para saber quién
// hizo el movimiento. No se persiste todavía: queda "pendiente" hasta
// que alguien confirma poniendo el dedo en el lector de huella
// (identificarHuella.js), igual que ya pasa con las ventas de caja
// compartida.
export const registrarMovimiento = async (req, res) => {
  try {
    const userId = req.userId
    const idCaja = parseInt(req.params.id)
    const { tipo, monto, descripcion } = req.body

    if (!['ingreso', 'egreso'].includes(tipo)) {
      return res.status(400).json({ error: "El tipo debe ser 'ingreso' o 'egreso'." })
    }

    if (monto === undefined || monto === null || isNaN(monto) || Number(monto) <= 0) {
      return res.status(400).json({ error: 'El monto es obligatorio y debe ser un número mayor a 0.' })
    }

    if (!descripcion || !descripcion.trim()) {
      return res.status(400).json({ error: 'La descripción es obligatoria para movimientos manuales.' })
    }

    const caja = await prisma.caja.findUnique({ where: { id_caja: idCaja } })

    if (!caja) {
      return res.status(404).json({ error: 'Caja no encontrada.' })
    }

    if (caja.estado !== 'abierta') {
      return res.status(400).json({ error: 'Solo se pueden registrar movimientos en una caja abierta.' })
    }

    // --- Caja compartida: esperar confirmación por huella ---
    if (caja.modo_autenticacion === 'por_venta') {
      if (hayVentaPendiente() || hayMovimientoPendiente()) {
        return res.status(409).json({
          error: 'Ya hay una operación esperando confirmación por huella. Esperá a que se resuelva antes de iniciar otra.'
        })
      }

      iniciarMovimientoPendiente({
        id_caja: idCaja,
        tipo,
        monto: Number(monto),
        descripcion: descripcion.trim()
      })

      return res.status(202).json({
        success: true,
        message: 'Movimiento validado. Esperando que alguien confirme con el lector de huella.'
      })
    }

    // --- Caja individual: se guarda directo ---
    // El enum TipoMovimiento ahora solo tiene 'ingreso' o 'egreso',
    // así que el tipo que llega del body se usa directo.
    const movimiento = await prisma.movimiento_Caja.create({
      data: {
        id_caja: idCaja,
        tipo_movimiento: tipo,
        monto: Number(monto),
        descripcion: descripcion.trim(),
        id_trabajador_registra: userId
      }
    })

    res.status(201).json(movimiento)
  } catch (error) {
    console.error('Error registrando movimiento de caja:', error)
    res.status(500).json({ error: 'Error al registrar el movimiento de caja.' })
  }
}
