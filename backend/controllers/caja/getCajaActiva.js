// backend/controllers/caja/getCajaActiva.js
import prisma from '../../db.js'

// GET /api/cajas/activa
// Devuelve LA CAJA ABIERTA DE ESTE TRABAJADOR (no "la" caja abierta del
// sistema: puede haber varias en paralelo, una por cada cajero logueado
// en su propia PC). Se identifica a través de su Sesion_Vendedor activa
// (la que todavía no tiene fecha_hora_fin).
export const getCajaActiva = async (req, res) => {
  try {
    const userId = req.userId

    const sesionActiva = await prisma.sesion_Vendedor.findFirst({
      where: { id_trabajador: userId, fecha_hora_fin: null },
      include: {
        caja: {
          include: {
            trabajador_apertura: { select: { nombre: true, apellido: true } }
          }
        }
      }
    })

    res.json(sesionActiva ? sesionActiva.caja : null)
  } catch (error) {
    console.error('Error obteniendo caja activa:', error)
    res.status(500).json({ error: 'Error al obtener la caja activa' })
  }
}
