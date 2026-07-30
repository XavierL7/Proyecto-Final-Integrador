// backend/controllers/productoController.js
import prisma from '../db.js'

// ============================================================
// OBTENER TODOS LOS PRODUCTOS (con sus etiquetas)
// ============================================================
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

// ============================================================
// OBTENER UN PRODUCTO POR ID
// ============================================================
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

// ============================================================
// BUSCAR PRODUCTOS (por código o nombre) - YA EXISTE
// ============================================================
export const buscarProducto = async (req, res) => {
  try {
    const { q } = req.query

    if (!q || q.trim() === '') {
      return res.status(400).json({ error: 'Falta el término de búsqueda' })
    }

    const producto = await prisma.producto.findFirst({
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

// ============================================================
// CREAR PRODUCTO
// ============================================================
export const createProducto = async (req, res) => {
  try {
    const {
      codigo_barras,
      nombre_producto,
      precio_unitario,
      costo_unitario,
      stock_actual,
      stock_minimo,
      etiquetas // array de IDs
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

// ============================================================
// ACTUALIZAR PRODUCTO
// ============================================================
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
        // Actualizar etiquetas: eliminar todas y crear nuevas
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

// ============================================================
// ELIMINAR PRODUCTO
// ============================================================
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