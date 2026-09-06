// backend/controllers/caja/abrirCaja.js
import prisma from '../../db.js'

// POST /api/cajas   { monto_inicial, compartida? }
export const abrirCaja = async (req, res) => {
  try {
    const userId = req.userId
    const { monto_inicial, compartida } = req.body

    if (monto_inicial === undefined || monto_inicial === null || isNaN(monto_inicial)) {
      return res.status(400).json({ error: 'El monto inicial es obligatorio y debe ser un número.' })
    }

    if (Number(monto_inicial) < 0) {
      return res.status(400).json({ error: 'El monto inicial no puede ser negativo.' })
    }

    // La regla es: VOS (este trabajador) no podés tener dos cajas
    // abiertas a la vez. Otro compañero en otra PC puede tener la suya.
    const sesionAbierta = await prisma.sesion_Vendedor.findFirst({
      where: { id_trabajador: userId, fecha_hora_fin: null },
      include: { caja: true }
    })

    if (sesionAbierta) {
      return res.status(400).json({
        error: `Ya tenés una caja abierta (#${sesionAbierta.id_caja}). Cerrala antes de abrir otra.`
      })
    }

    // Individual (sesion_inicial): la caja queda registrada a este
    // trabajador. Compartida (por_venta): cualquiera puede vender en
    // ella, pero cada venta se confirma con huella.
    const modoAutenticacion = compartida ? 'por_venta' : 'sesion_inicial'

    const { caja } = await prisma.$transaction(async (tx) => {
      const caja = await tx.caja.create({
        data: {
          id_trabajador_apertura: userId,
          monto_inicial: Number(monto_inicial),
          modo_autenticacion: modoAutenticacion
        }
      })

      const sesion = await tx.sesion_Vendedor.create({
        data: {
          id_caja: caja.id_caja,
          id_trabajador: userId
        }
      })

      return { caja, sesion }
    })

    res.status(201).json(caja)
  } catch (error) {
    console.error('Error abriendo caja:', error)
    res.status(500).json({ error: 'Error al abrir la caja' })
  }
}
