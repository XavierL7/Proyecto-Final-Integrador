// backend/controllers/dispositivo/huellasPendientes.js
import prisma from '../../db.js'

// GET /api/dispositivo/huellas-pendientes
// El ESP32 llama esto periódicamente (cada pocos segundos, en modo lectura
// libre) para saber si hay que capturar alguna huella nueva. Devuelve la
// más antigua primero (FIFO) para procesarlas de a una.
export const huellasPendientes = async (req, res) => {
  try {
    const pendientes = await prisma.trabajador.findMany({
      where: { huella_pendiente: true },
      orderBy: { id_trabajador: 'asc' },
      select: {
        id_trabajador: true,
        nombre: true,
        apellido: true,
        hash_huella: true
      }
    })

    res.json({
      pendientes: pendientes.map(t => ({
        idTrabajador: t.id_trabajador,
        nombre: t.nombre,
        apellido: t.apellido,
        fingerprintId: parseInt(t.hash_huella)
      }))
    })
  } catch (error) {
    console.error('Error obteniendo huellas pendientes:', error)
    res.status(500).json({ error: 'Error al obtener huellas pendientes.' })
  }
}
