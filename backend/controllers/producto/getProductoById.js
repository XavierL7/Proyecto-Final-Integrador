// backend/controllers/producto/getProductoById.js
import prisma from '../../db.js'

export const getProductoById = async (req, res) => {
  try {
    const { id } = req.params
    const producto = await prisma.producto.findUnique({
      where: { id_producto: parseInt(id) },
      include: {
        productos_etiquetas: {
          include: { etiqueta: true }
        }
      }
    })

    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' })
    }

    res.json(producto)
  } catch (error) {
    console.error('Error obteniendo producto:', error)
    res.status(500).json({ error: 'Error al obtener producto' })
  }
}