// backend/controllers/etiqueta/toggleActivaEtiqueta.js
import prisma from '../../db.js'

// PUT /api/etiquetas/:id/activa   { activo: true|false }
export const toggleActivaEtiqueta = async (req, res) => {
  try {
    const { id } = req.params
    const { activo } = req.body

    const etiqueta = await prisma.etiqueta.update({
      where: { id_etiqueta: parseInt(id) },
      data: { activo: Boolean(activo) }
    })

    res.json({
      success: true,
      message: `Etiqueta ${etiqueta.activo ? 'habilitada' : 'deshabilitada'} correctamente.`,
      etiqueta
    })
  } catch (error) {
    console.error('Error cambiando estado de la etiqueta:', error)
    res.status(500).json({ error: 'Error al cambiar el estado de la etiqueta' })
  }
}
