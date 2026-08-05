// backend/controllers/etiqueta/updateEtiqueta.js
import prisma from '../../db.js'

export const updateEtiqueta = async (req, res) => {
  try {
    const { id } = req.params
    const { nombre_etiqueta, descripcion } = req.body

    if (!nombre_etiqueta || nombre_etiqueta.trim() === '') {
      return res.status(400).json({ error: 'El nombre de la etiqueta es obligatorio' })
    }

    if (nombre_etiqueta.length > 20) {
      return res.status(400).json({ error: 'El nombre no puede tener más de 20 caracteres' })
    }

    const etiqueta = await prisma.etiqueta.update({
      where: { id_etiqueta: parseInt(id) },
      data: {
        nombre_etiqueta: nombre_etiqueta.trim(),
        descripcion: descripcion?.trim() || null
      }
    })

    res.json(etiqueta)
  } catch (error) {
    console.error('Error actualizando etiqueta:', error)
    res.status(500).json({ error: 'Error al actualizar la etiqueta' })
  }
}