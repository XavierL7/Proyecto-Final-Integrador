// backend/controllers/venta/getVentas.js
import prisma from '../../db.js'
import { manejarErrorDb } from '../../lib/manejarErrorDb.js'
import {
  leerPaginacion,
  calcularTotalPaginas,
  rangoFechas,
  palabrasDeBusqueda,
  numeroDe,
  contiene
} from '../../lib/filtrosHistorial.js'

// GET /api/ventas?page=1&limit=10&q=texto&desde=2026-10-01&hasta=2026-10-12
//
// q busca por número de venta o de caja ("12" o "#12"), nombre/apellido
// del trabajador, nombre/apellido/DNI del cliente o método de pago. Todo
// se resuelve en la base, sobre todas las ventas (antes se traían solo las
// últimas 50 y se miraban en pantalla).
export const getVentas = async (req, res) => {
  try {
    const { page, limit, skip } = leerPaginacion(req.query)
    const { q, desde, hasta } = req.query

    const condiciones = []

    for (const palabra of palabrasDeBusqueda(q)) {
      const numero = numeroDe(palabra)
      const opciones = [
        { trabajador: { nombre: contiene(palabra) } },
        { trabajador: { apellido: contiene(palabra) } },
        { cliente: { nombre: contiene(palabra) } },
        { cliente: { apellido: contiene(palabra) } },
        { cliente: { dni: contiene(palabra) } },
        { detalle_pago_venta: { some: { metodo_pago: { nombre: contiene(palabra) } } } }
      ]
      if (numero !== null) {
        opciones.push({ id_venta: numero }, { id_caja: numero })
      }
      condiciones.push({ OR: opciones })
    }

    const rango = rangoFechas(desde, hasta)
    if (rango) condiciones.push({ fecha_hora: rango })

    const where = condiciones.length > 0 ? { AND: condiciones } : {}

    const [ventas, total] = await Promise.all([
      prisma.venta.findMany({
        where,
        include: {
          trabajador: {
            select: { nombre: true, apellido: true }
          },
          cliente: {
            select: { id_cliente: true, nombre: true, apellido: true, dni: true }
          },
          detalle_ventas: {
            include: {
              producto: {
                select: { nombre_producto: true }
              }
            }
          },
          detalle_pago_venta: {
            include: {
              metodo_pago: true
            }
          }
        },
        orderBy: { fecha_hora: 'desc' },
        skip,
        take: limit
      }),
      prisma.venta.count({ where })
    ])

    res.json({ ventas, total, page, totalPages: calcularTotalPaginas(total, limit) })
  } catch (error) {
    if (manejarErrorDb(error, res, 'obtener ventas')) return
    console.error('Error obteniendo ventas:', error)
    res.status(500).json({ error: 'Error al obtener ventas' })
  }
}
