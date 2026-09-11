// backend/controllers/producto/getProductos.js
import prisma from '../../db.js'

export const getProductos = async (req, res) => {
  try {
    // Paginación: ?page=1&limit=10 (por defecto)
    const page = Math.max(parseInt(req.query.page) || 1, 1)
    const limit = Math.max(parseInt(req.query.limit) || 10, 1)
    const skip = (page - 1) * limit

    // Filtro opcional por etiquetas: ?etiquetas=1,4,7
    // Se muestran los productos que tengan TODAS las etiquetas
    // seleccionadas (AND). Si no viene el parámetro, no se filtra.
    const idsEtiquetas = (req.query.etiquetas || '')
      .split(',')
      .map(id => parseInt(id))
      .filter(id => !isNaN(id))

    const where = idsEtiquetas.length > 0
      ? {
          AND: idsEtiquetas.map(id => ({
            productos_etiquetas: { some: { id_etiqueta: id } }
          }))
        }
      : {}

    const [productos, total] = await Promise.all([
      prisma.producto.findMany({
        where,
        include: {
          productos_etiquetas: {
            include: { etiqueta: true }
          }
        },
        orderBy: { id_producto: 'desc' },
        skip,
        take: limit
      }),
      prisma.producto.count({ where })
    ])

    res.json({
      productos,
      total,
      page,
      totalPages: Math.max(Math.ceil(total / limit), 1)
    })
  } catch (error) {
    console.error('Error obteniendo productos:', error)
    res.status(500).json({ error: 'Error al obtener productos' })
  }
}