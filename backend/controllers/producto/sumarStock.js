// backend/controllers/producto/sumarStock.js
import prisma from '../../db.js'

// POST /api/productos/:id/sumar-stock
// Suma "cantidad" al stock_actual existente (no lo pisa). Usa el
// increment atómico de Prisma en vez de leer-y-escribir, para que dos
// personas cargando stock del mismo producto al mismo tiempo no se
// pisen entre sí.
export const sumarStock = async (req, res) => {
  try {
    const { id } = req.params
    const { cantidad } = req.body

    const cantidadNum = Number(cantidad)

    if (!Number.isInteger(cantidadNum) || cantidadNum <= 0) {
      return res.status(400).json({ error: 'La cantidad a agregar debe ser un número entero mayor a 0' })
    }

    const producto = await prisma.producto.findUnique({
      where: { id_producto: parseInt(id) }
    })

    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' })
    }

    const productoActualizado = await prisma.producto.update({
      where: { id_producto: parseInt(id) },
      data: {
        stock_actual: { increment: cantidadNum }
      },
      include: {
        productos_etiquetas: {
          include: { etiqueta: true }
        }
      }
    })

    res.json(productoActualizado)
  } catch (error) {
    console.error('Error agregando stock:', error)
    res.status(500).json({ error: 'Error al agregar stock' })
  }
}
