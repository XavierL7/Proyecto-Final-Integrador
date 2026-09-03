// backend/controllers/promocion/toggleActivaPromocion.js
import prisma from '../../db.js'

// PUT /api/promociones/:id/activa   { activa: true|false }
export const toggleActivaPromocion = async (req, res) => {
  try {
    const { id } = req.params
    const { activa } = req.body

    const promo = await prisma.promocion.update({
      where: { id_promocion: parseInt(id) },
      data: { activa: Boolean(activa) }
    })

    res.json(promo)
  } catch (error) {
    console.error('Error cambiando estado de promoción:', error)
    res.status(500).json({ error: 'Error al cambiar el estado de la promoción' })
  }
}
