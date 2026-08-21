// backend/controllers/admin/trabajadores/vincularHuella.js
import prisma from '../../../db.js'

// Se llama desde el panel de administración, DESPUÉS de que un admin haya
// grabado la huella en el sensor por terminal (comando 'R' en main.cpp) y
// anotado con qué ID (1-127) quedó guardada. Este endpoint solo persiste
// la relación id_fingerprint <-> trabajador en la base de datos; no habla
// directamente con el ESP32.
export const vincularHuella = async (req, res) => {
  try {
    const { id } = req.params // id_trabajador
    const { fingerprintId } = req.body

    if (fingerprintId === undefined || fingerprintId === null) {
      return res.status(400).json({ error: 'fingerprintId es obligatorio.' })
    }

    const idFingerprintNum = parseInt(fingerprintId)
    if (isNaN(idFingerprintNum) || idFingerprintNum < 1 || idFingerprintNum > 127) {
      return res.status(400).json({ error: 'fingerprintId debe ser un número entre 1 y 127.' })
    }

    const trabajador = await prisma.trabajador.findUnique({
      where: { id_trabajador: parseInt(id) }
    })

    if (!trabajador) {
      return res.status(404).json({ error: 'Trabajador no encontrado.' })
    }

    // hash_huella es @unique: si ese ID ya está tomado por otro trabajador,
    // Prisma va a tirar un error de constraint (P2002) que capturamos abajo.
    const actualizado = await prisma.trabajador.update({
      where: { id_trabajador: parseInt(id) },
      data: { hash_huella: String(idFingerprintNum) }
    })

    res.json({
      success: true,
      message: `Huella #${idFingerprintNum} vinculada a ${actualizado.nombre} ${actualizado.apellido}.`,
      trabajador: {
        id: actualizado.id_trabajador,
        nombre: actualizado.nombre,
        apellido: actualizado.apellido,
        hash_huella: actualizado.hash_huella
      }
    })
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(400).json({
        error: 'Ese ID de huella ya está vinculado a otro trabajador.'
      })
    }
    console.error('Error en vincularHuella:', error)
    res.status(500).json({ error: 'Error interno al vincular la huella.' })
  }
}
