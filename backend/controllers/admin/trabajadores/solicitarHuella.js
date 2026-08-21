// backend/controllers/admin/trabajadores/solicitarHuella.js
import prisma from '../../../db.js'

const MAX_HUELLAS = 127

// PUT /api/admin/trabajadores/:id/huella
// Para un trabajador que ya existe y todavía no tiene huella (o canceló
// una anterior): le asigna el próximo ID libre de la secuencia y lo deja
// "pendiente" para que el ESP32 lo capture físicamente.
export const solicitarHuella = async (req, res) => {
  try {
    const { id } = req.params

    const trabajador = await prisma.trabajador.findUnique({
      where: { id_trabajador: parseInt(id) }
    })

    if (!trabajador) {
      return res.status(404).json({ error: 'Trabajador no encontrado.' })
    }

    if (trabajador.hash_huella) {
      return res.status(400).json({
        error: trabajador.huella_pendiente
          ? 'Este trabajador ya tiene una huella pendiente de captura.'
          : 'Este trabajador ya tiene una huella registrada. Cancelala primero si querés reasignarla.'
      })
    }

    const [{ id: nextId }] = await prisma.$queryRaw`SELECT nextval('huella_id_seq') AS id`
    const fingerprintIdAsignado = Number(nextId)

    if (fingerprintIdAsignado > MAX_HUELLAS) {
      return res.status(400).json({
        error: `No quedan IDs de huella libres (máximo ${MAX_HUELLAS} en el sensor).`
      })
    }

    const actualizado = await prisma.trabajador.update({
      where: { id_trabajador: parseInt(id) },
      data: { hash_huella: String(fingerprintIdAsignado), huella_pendiente: true }
    })

    res.json({
      success: true,
      message: `Huella #${fingerprintIdAsignado} reservada para ${actualizado.nombre} ${actualizado.apellido}. Llevalo al lector para completar el registro.`,
      huellaAsignada: fingerprintIdAsignado
    })
  } catch (error) {
    console.error('Error solicitando huella:', error)
    res.status(500).json({ error: 'Error interno al solicitar la huella.' })
  }
}
