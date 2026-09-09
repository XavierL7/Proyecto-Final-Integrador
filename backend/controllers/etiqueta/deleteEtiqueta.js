// backend/controllers/etiqueta/deleteEtiqueta.js
import prisma from '../../db.js'

export const deleteEtiqueta = async (req, res) => {
  try {
    const { id } = req.params
    const idEtiqueta = parseInt(id)

    // Verificar que no esté siendo usada por algún producto...
    const enUsoPorProducto = await prisma.productos_Etiquetas.findFirst({
      where: { id_etiqueta: idEtiqueta }
    })

    // ...ni por ninguna promoción (ahora que las promos pueden aplicarse
    // por etiqueta, no solo por producto puntual).
    const enUsoPorPromocion = await prisma.promociones_Etiquetas.findFirst({
      where: { id_etiqueta: idEtiqueta }
    })

    if (enUsoPorProducto || enUsoPorPromocion) {
      return res.status(400).json({
        error: 'No se puede eliminar: esta etiqueta está en uso (por un producto o una promoción). Deshabilitala en su lugar.'
      })
    }

    await prisma.etiqueta.delete({
      where: { id_etiqueta: idEtiqueta }
    })

    res.json({ message: 'Etiqueta eliminada correctamente' })
  } catch (error) {
    console.error('Error eliminando etiqueta:', error)
    res.status(500).json({ error: 'Error al eliminar la etiqueta' })
  }
}
