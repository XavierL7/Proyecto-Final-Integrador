// backend/controllers/producto/getProductos.js
import prisma from '../../db.js'
import { manejarErrorDb } from '../../lib/manejarErrorDb.js'

// GET /api/productos?page=1&limit=10&q=texto&etiquetas=1,4,7
export const getProductos = async (req, res) => {
  try {
    // Paginación: ?page=1&limit=10 (por defecto)
    const page = Math.max(parseInt(req.query.page) || 1, 1)
    const limit = Math.max(parseInt(req.query.limit) || 10, 1)
    const skip = (page - 1) * limit

    // Búsqueda opcional: ?q=texto
    // Busca en TODOS los productos (no solo en la página que se está
    // viendo) por nombre o código de barras, sin distinguir mayúsculas.
    const q = (req.query.q || '').trim()

    // Filtro opcional por etiquetas: ?etiquetas=1,4,7
    // Se muestran los productos que tengan TODAS las etiquetas
    // seleccionadas (AND). Si no viene el parámetro, no se filtra.
    const idsEtiquetas = (req.query.etiquetas || '')
      .split(',')
      .map(id => parseInt(id))
      .filter(id => !isNaN(id))

    // Las condiciones se combinan con AND: búsqueda de texto + etiquetas.
    const condiciones = []

    if (q) {
      condiciones.push({
        OR: [
          { nombre_producto: { contains: q, mode: 'insensitive' } },
          { codigo_barras: { contains: q, mode: 'insensitive' } }
        ]
      })
    }

    for (const id of idsEtiquetas) {
      condiciones.push({ productos_etiquetas: { some: { id_etiqueta: id } } })
    }

    const where = condiciones.length > 0 ? { AND: condiciones } : {}

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
    if (manejarErrorDb(error, res, 'obtener productos')) return
    console.error('Error obteniendo productos:', error)
    res.status(500).json({ error: 'Error al obtener productos' })
  }
}
