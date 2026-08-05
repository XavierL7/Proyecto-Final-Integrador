// backend/controllers/producto/deleteProducto.js
import prisma from '../../db.js'

export const deleteProducto = async (req, res) => {
  try {
    const { id } = req.params

    const producto = await prisma.producto.findUnique({
      where: { id_producto: parseInt(id) }
    })

    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' })
    }

    // Eliminar relaciones con etiquetas primero
    await prisma.productos_Etiquetas.deleteMany({
      where: { id_producto: parseInt(id) }
    })

    // Eliminar producto
    await prisma.producto.delete({
      where: { id_producto: parseInt(id) }
    })

    res.json({ message: 'Producto eliminado correctamente' })
  } catch (error) {
    console.error('Error eliminando producto:', error)
    res.status(500).json({ error: 'Error al eliminar el producto' })
  }
}