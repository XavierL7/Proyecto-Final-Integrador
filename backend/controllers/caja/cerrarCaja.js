// backend/controllers/caja/cerrarCaja.js
import prisma from '../../db.js'

// PUT /api/cajas/:id/cerrar   { monto_final_real?, observaciones? }
export const cerrarCaja = async (req, res) => {
  try {
    const userId = req.userId
    const { id } = req.params
    const { monto_final_real, observaciones } = req.body

    const caja = await prisma.caja.findUnique({
      where: { id_caja: parseInt(id) }
    })

    if (!caja) {
      return res.status(404).json({ error: 'Caja no encontrada.' })
    }

    if (caja.estado !== 'abierta') {
      return res.status(400).json({ error: 'Esta caja ya está cerrada.' })
    }

    // Monto esperado en el cajón = monto inicial + lo que entró en
    // efectivo durante esta caja (tarjeta/transferencia no mueven billetes
    // físicos, así que no suman al conteo del cajón).
    const pagosEfectivo = await prisma.detalle_Pago_Venta.aggregate({
      _sum: { monto: true },
      where: {
        venta: { id_caja: caja.id_caja },
        metodo_pago: { nombre: 'Efectivo' }
      }
    })

    const totalEfectivo = Number(pagosEfectivo._sum.monto || 0)
    const montoFinalEsperado = Number(caja.monto_inicial) + totalEfectivo

    const montoContado = monto_final_real !== undefined && monto_final_real !== null && monto_final_real !== ''
      ? Number(monto_final_real)
      : null

    const { cajaActualizada, arqueo } = await prisma.$transaction(async (tx) => {
      const cajaActualizada = await tx.caja.update({
        where: { id_caja: caja.id_caja },
        data: {
          estado: 'cerrada',
          fecha_hora_cierre: new Date(),
          id_trabajador_cierre: userId,
          monto_final_esperado: montoFinalEsperado,
          monto_final_real: montoContado
        }
      })

      // El arqueo es el registro "oficial" del conteo de cierre: queda en
      // Arqueo_Caja para el historial de auditoría, con quién lo hizo y
      // cualquier observación (ej. "faltaron $200, se lo llevó tal cosa").
      // Solo lo creamos si efectivamente se contó algo; si no se contó
      // nada todavía, no tiene sentido un arqueo con diferencia inventada.
      let arqueo = null
      if (montoContado !== null) {
        arqueo = await tx.arqueo_Caja.create({
          data: {
            id_caja: caja.id_caja,
            monto_contado_fisico: montoContado,
            monto_segun_sistema: montoFinalEsperado,
            diferencia: montoContado - montoFinalEsperado,
            id_trabajador: userId,
            observaciones: observaciones || null
          }
        })
      }

      // Cerramos también la(s) sesión(es) de vendedor abiertas sobre esta
      // caja: si no hacemos esto, getCajaActiva.js seguiría pensando que
      // ese trabajador tiene una caja abierta, y no podría abrir una nueva.
      await tx.sesion_Vendedor.updateMany({
        where: { id_caja: caja.id_caja, fecha_hora_fin: null },
        data: { fecha_hora_fin: new Date() }
      })

      return { cajaActualizada, arqueo }
    })

    res.json({
      success: true,
      message: 'Caja cerrada correctamente.',
      caja: cajaActualizada,
      diferencia: arqueo?.diferencia !== undefined ? Number(arqueo.diferencia) : null
    })
  } catch (error) {
    console.error('Error cerrando caja:', error)
    res.status(500).json({ error: 'Error al cerrar la caja' })
  }
}
