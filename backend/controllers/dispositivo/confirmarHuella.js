// backend/controllers/dispositivo/confirmarHuella.js
import prisma from '../../db.js'

// POST /api/dispositivo/confirmar-huella  { fingerprintId: 7 }
// El ESP32 llama esto justo después de que finger.storeModel(id) devuelve
// FINGERPRINT_OK. Marca la huella como capturada (deja de estar pendiente).
export const confirmarHuella = async (req, res) => {
  try {
    const { fingerprintId } = req.body

    if (fingerprintId === undefined || fingerprintId === null) {
      return res.status(400).json({ error: 'fingerprintId es obligatorio.' })
    }

    const trabajador = await prisma.trabajador.findUnique({
      where: { hash_huella: String(fingerprintId) }
    })

    if (!trabajador) {
      return res.status(404).json({ error: 'No hay ningún trabajador con ese fingerprintId.' })
    }

    await prisma.trabajador.update({
      where: { id_trabajador: trabajador.id_trabajador },
      data: { huella_pendiente: false }
    })

    res.json({
      success: true,
      message: `Huella #${fingerprintId} confirmada para ${trabajador.nombre} ${trabajador.apellido}.`
    })
  } catch (error) {
    console.error('Error confirmando huella:', error)
    res.status(500).json({ error: 'Error interno al confirmar la huella.' })
  }
}
