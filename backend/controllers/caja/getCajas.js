// backend/controllers/caja/getCajas.js
import prisma from '../../db.js'

// GET /api/cajas
export const getCajas = async (req, res) => {
  try {
    const cajas = await prisma.caja.findMany({
      include: {
        trabajador_apertura: { select: { nombre: true, apellido: true } },
        trabajador_cierre: { select: { nombre: true, apellido: true } },
        arqueos_caja: {
          orderBy: { fecha_hora: 'desc' },
          include: {
            trabajador: { select: { nombre: true, apellido: true } }
          }
        }
      },
      orderBy: { fecha_hora_apertura: 'desc' }
    })

    res.json(cajas)
  } catch (error) {
    console.error('Error obteniendo cajas:', error)
    res.status(500).json({ error: 'Error al obtener las cajas' })
  }
}
