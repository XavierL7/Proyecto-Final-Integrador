import prisma from '../../db.js'
import {
  leerPaginacion,
  calcularTotalPaginas,
  palabrasDeBusqueda,
  contiene
} from '../../lib/filtrosHistorial.js'

// GET /api/clientes
//
// Dos modos, según si se pide paginación:
//
// 1) SIN ?page  -> devuelve el array completo de clientes, igual que
//    siempre. Lo usa VentasView.vue (el selector de cliente de la caja
//    filtra en el navegador), así que no puede cambiar de forma.
//
// 2) CON ?page=1&limit=10&q=texto&estado=activo -> listado paginado para la
//    pantalla de Clientes: { clientes, total, page, totalPages }.
//    - q busca por nombre, apellido, DNI o teléfono, sobre TODOS los clientes.
//    - estado: 'activo' o 'inactivo'.
export const obtenerClientes = async (req, res) => {
  try {
    const orderBy = [{ fecha_ultima_compra: 'desc' }, { id_cliente: 'desc' }]

    // Modo 1: sin paginación (compatibilidad con Ventas)
    if (req.query.page === undefined) {
      const clientes = await prisma.cliente.findMany({ orderBy })
      return res.status(200).json(clientes)
    }

    // Modo 2: paginado, con búsqueda y filtros
    const { page, limit, skip } = leerPaginacion(req.query)
    const { q, estado } = req.query

    const condiciones = []

    for (const palabra of palabrasDeBusqueda(q)) {
      condiciones.push({
        OR: [
          { nombre: contiene(palabra) },
          { apellido: contiene(palabra) },
          { dni: contiene(palabra) },
          { telefono: contiene(palabra) }
        ]
      })
    }

    if (estado === 'activo') condiciones.push({ activo: true })
    if (estado === 'inactivo') condiciones.push({ activo: false })

    const where = condiciones.length > 0 ? { AND: condiciones } : {}

    const [clientes, total] = await Promise.all([
      prisma.cliente.findMany({ where, orderBy, skip, take: limit }),
      prisma.cliente.count({ where })
    ])

    res.status(200).json({ clientes, total, page, totalPages: calcularTotalPaginas(total, limit) })
  } catch (error) {
    console.error('Error al obtener clientes:', error.message)
    res.status(500).json({ error: 'Error interno al obtener los clientes' })
  }
}
