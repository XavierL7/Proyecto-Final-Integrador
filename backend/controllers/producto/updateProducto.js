// backend/controllers/producto/updateProducto.js
import prisma from '../../db.js'

export const updateProducto = async (req, res) => {
  try {
    const { id } = req.params
    const {
      codigo_barras,
      nombre_producto,
      precio_unitario,
      costo_unitario,
      stock_actual,
      stock_minimo,
      etiquetas
    } = req.body

    // Verificar que existe
    const producto = await prisma.producto.findUnique({
      where: { id_producto: parseInt(id) }
    })

    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' })
    }

    // Verificar código de barras único (si se proporcionó y cambió)
    if (codigo_barras && codigo_barras !== producto.codigo_barras) {
      const existe = await prisma.producto.findFirst({
        where: { codigo_barras }
      })
      if (existe) {
        return res.status(400).json({ error: 'Ya existe un producto con ese código de barras' })
      }
    }

    // Actualizar
    const productoActualizado = await prisma.producto.update({
      where: { id_producto: parseInt(id) },
      data: {
        codigo_barras: codigo_barras || null,
        nombre_producto: nombre_producto.trim(),
        precio_unitario: parseFloat(precio_unitario),
        costo_unitario: parseFloat(costo_unitario) || 0,
        stock_actual: parseInt(stock_actual),
        stock_minimo: parseInt(stock_minimo) || 5,
        productos_etiquetas: {
          deleteMany: {},
          create: etiquetas?.map(id_etiqueta => ({
            id_etiqueta
          })) || []
        }
      },
      include: {
        productos_etiquetas: {
          include: { etiqueta: true }
        }
      }
    })

    res.json(productoActualizado)
  } catch (error) {
    console.error('Error actualizando producto:', error)
    res.status(500).json({ error: 'Error al actualizar el producto' })
  }
}