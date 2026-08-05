// backend/controllers/producto/createProducto.js
import prisma from '../../db.js'

export const createProducto = async (req, res) => {
  try {
    const {
      codigo_barras,
      nombre_producto,
      precio_unitario,
      costo_unitario,
      stock_actual,
      stock_minimo,
      etiquetas
    } = req.body

    // Validaciones
    if (!nombre_producto || nombre_producto.trim() === '') {
      return res.status(400).json({ error: 'El nombre del producto es obligatorio' })
    }

    if (!precio_unitario || precio_unitario <= 0) {
      return res.status(400).json({ error: 'El precio debe ser mayor a 0' })
    }

    if (stock_actual === undefined || stock_actual < 0) {
      return res.status(400).json({ error: 'El stock no puede ser negativo' })
    }

    // Verificar código de barras único (si se proporcionó)
    if (codigo_barras) {
      const existe = await prisma.producto.findFirst({
        where: { codigo_barras }
      })
      if (existe) {
        return res.status(400).json({ error: 'Ya existe un producto con ese código de barras' })
      }
    }

    // Crear producto con etiquetas
    const nuevoProducto = await prisma.producto.create({
      data: {
        codigo_barras: codigo_barras || null,
        nombre_producto: nombre_producto.trim(),
        precio_unitario: parseFloat(precio_unitario),
        costo_unitario: parseFloat(costo_unitario) || 0,
        stock_actual: parseInt(stock_actual),
        stock_minimo: parseInt(stock_minimo) || 5,
        productos_etiquetas: {
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

    res.status(201).json(nuevoProducto)
  } catch (error) {
    console.error('Error creando producto:', error)
    res.status(500).json({ error: 'Error al crear el producto' })
  }
}