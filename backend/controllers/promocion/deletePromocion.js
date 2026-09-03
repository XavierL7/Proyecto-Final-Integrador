// backend/controllers/promocion/deletePromocion.js
import prisma from '../../db.js'

// DELETE /api/promociones/:id
export const deletePromocion = async (req, res) => {
  try {
    const { id } = req.params
    const idPromocion = parseInt(id)

    const promo = await prisma.promocion.findUnique({ where: { id_promocion: idPromocion } })
    if (!promo) {
      return res.status(404).json({ error: 'Promoción no encontrada.' })
    }

    // Si ya se usó en alguna venta, no la borramos de verdad (rompería el
    // historial de esas ventas): sugerimos desactivarla en su lugar.
    const usosEnVentas = await prisma.detalle_Venta.count({
      where: { id_promocion: idPromocion }
    })

    if (usosEnVentas > 0) {
      return res.status(400).json({
        error: `Esta promoción ya se usó en ${usosEnVentas} venta(s) y no se puede eliminar. Desactivala en su lugar para que deje de ofrecerse.`
      })
    }

    await prisma.$transaction(async (tx) => {
      await tx.productos_Promociones.deleteMany({ where: { id_promocion: idPromocion } })
      await tx.promocion.delete({ where: { id_promocion: idPromocion } })
    })

    res.json({ success: true, message: 'Promoción eliminada.' })
  } catch (error) {
    console.error('Error eliminando promoción:', error)
    res.status(500).json({ error: 'Error al eliminar la promoción' })
  }
}
