// backend/controllers/caja/getHistorialMovimientos.js
import prisma from '../../db.js'

// GET /api/cajas/movimientos/historial
// Historial global de todos los ingresos/egresos manuales registrados,
// de cualquier caja (abierta o cerrada, individual o compartida).
// Pantalla nueva en la sección Historial (HistorialMovimientosCajaView.vue).
export const getHistorialMovimientos = async (req, res) => {
  try {
    const movimientos = await prisma.movimiento_Caja.findMany({
      include: {
        trabajador: { select: { nombre: true, apellido: true } },
        caja: { select: { id_caja: true, modo_autenticacion: true, estado: true } }
      },
      orderBy: { fecha_hora: 'desc' }
    })

    res.json(movimientos)
  } catch (error) {
    console.error('Error obteniendo historial de movimientos de caja:', error)
    res.status(500).json({ error: 'Error al obtener el historial de movimientos de caja.' })
  }
}
