// backend/controllers/producto/buscarProducto.js
import prisma from '../../db.js'

export const buscarProducto = async (req, res) => {
  try {
    const { q } = req.query

    if (!q || q.trim() === '') {
      return res.status(400).json({ error: 'Falta el término de búsqueda' })
    }

    const producto = await prisma.producto.findMany({
      where: {
        OR: [
          { codigo_barras: q.trim() },
          { nombre_producto: { contains: q.trim(), mode: 'insensitive' } }
        ]
      },
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
    console.error('Error buscando producto:', error)
    res.status(500).json({ error: 'Error al buscar producto' })
  }
}