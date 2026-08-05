// backend/controllers/etiqueta/deleteEtiqueta.js
import prisma from '../../db.js'

export const deleteEtiqueta = async (req, res) => {
  try {
    const { id } = req.params

    // Verificar que no esté siendo usada por algún producto
    const enUso = await prisma.productos_Etiquetas.findFirst({
      where: { id_etiqueta: parseInt(id) }
    })

    if (enUso) {
      return res.status(400).json({
        error: 'No se puede eliminar una etiqueta que está siendo usada por un producto'
      })
    }

    await prisma.etiqueta.delete({
      where: { id_etiqueta: parseInt(id) }
    })

    res.json({ message: 'Etiqueta eliminada correctamente' })
  } catch (error) {
    console.error('Error eliminando etiqueta:', error)
    res.status(500).json({ error: 'Error al eliminar la etiqueta' })
  }
}