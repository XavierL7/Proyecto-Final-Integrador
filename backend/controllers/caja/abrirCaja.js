// backend/controllers/caja/abrirCaja.js
import prisma from '../../db.js'

// POST /api/cajas   { monto_inicial }
export const abrirCaja = async (req, res) => {
  try {
    const userId = req.userId
    const { monto_inicial } = req.body

    if (monto_inicial === undefined || monto_inicial === null || isNaN(monto_inicial)) {
      return res.status(400).json({ error: 'El monto inicial es obligatorio y debe ser un número.' })
    }

    if (Number(monto_inicial) < 0) {
      return res.status(400).json({ error: 'El monto inicial no puede ser negativo.' })
    }

    // La regla ya NO es "no puede haber ninguna caja abierta en todo el
    // sistema" (eso rompía si dos PCs quieren trabajar en paralelo).
    // La regla correcta es: VOS (este trabajador) no podés tener dos
    // cajas abiertas a la vez. Otro compañero en otra PC puede tener la
    // suya, tranquilamente.
    const sesionAbierta = await prisma.sesion_Vendedor.findFirst({
      where: { id_trabajador: userId, fecha_hora_fin: null },
      include: { caja: true }
    })

    if (sesionAbierta) {
      return res.status(400).json({
        error: `Ya tenés una caja abierta (#${sesionAbierta.id_caja}). Cerrala antes de abrir otra.`
      })
    }

    // Creamos la caja y, en la misma transacción, la sesión de vendedor
    // que la ata a este trabajador. Esa sesión es la que después usa
    // createVenta.js para saber "esta venta es de la caja de quién".
    const { caja, sesion } = await prisma.$transaction(async (tx) => {
      const caja = await tx.caja.create({
        data: {
          id_trabajador_apertura: userId,
          monto_inicial: Number(monto_inicial)
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
