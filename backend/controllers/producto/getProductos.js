// backend/controllers/producto/getProductos.js
import prisma from '../../db.js'

export const getProductos = async (req, res) => {
  try {
    const productos = await prisma.producto.findMany({
      include: {
        productos_etiquetas: {
          include: { etiqueta: true }
        }
      },
      orderBy: { id_producto: 'desc' }
    })
    res.json(productos)
  } catch (error) {
    console.error('Error obteniendo productos:', error)
    res.status(500).json({ error: 'Error al obtener productos' })
  }
}