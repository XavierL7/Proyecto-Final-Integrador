// backend/controllers/caja/getHistorialMovimientos.js
import prisma from '../../db.js'
import {
  leerPaginacion,
  calcularTotalPaginas,
  rangoFechas,
  palabrasDeBusqueda,
  numeroDe,
  contiene
} from '../../lib/filtrosHistorial.js'

const TIPOS = ['ingreso', 'egreso']

// GET /api/cajas/movimientos/historial?page=1&limit=10&q=texto&tipo=egreso&desde=2026-10-01&hasta=2026-10-12
// Historial global de todos los ingresos/egresos manuales registrados,
// de cualquier caja (abierta o cerrada, individual o compartida).
//
// q busca por descripción, número de caja ("12" o "#12") o nombre/apellido
// de quien registró el movimiento. Todo se resuelve en la base.
export const getHistorialMovimientos = async (req, res) => {
  try {
    const { page, limit, skip } = leerPaginacion(req.query)
    const { q, tipo, desde, hasta } = req.query

    const condiciones = []

    for (const palabra of palabrasDeBusqueda(q)) {
      const numero = numeroDe(palabra)
      const opciones = [
        { descripcion: contiene(palabra) },
        { trabajador: { nombre: contiene(palabra) } },
        { trabajador: { apellido: contiene(palabra) } }
      ]
      if (numero !== null) opciones.push({ id_caja: numero })
      condiciones.push({ OR: opciones })
    }

    if (TIPOS.includes(tipo)) condiciones.push({ tipo_movimiento: tipo })

    const rango = rangoFechas(desde, hasta)
    if (rango) condiciones.push({ fecha_hora: rango })

    const where = condiciones.length > 0 ? { AND: condiciones } : {}

    const [movimientos, total] = await Promise.all([
      prisma.movimiento_Caja.findMany({
        where,
        include: {
          trabajador: { select: { nombre: true, apellido: true } },
          caja: { select: { id_caja: true, modo_autenticacion: true, estado: true } }
        },
        orderBy: { fecha_hora: 'desc' },
        skip,
        take: limit
      }),
      prisma.movimiento_Caja.count({ where })
    ])

    res.json({ movimientos, total, page, totalPages: calcularTotalPaginas(total, limit) })
  } catch (error) {
    console.error('Error obteniendo historial de movimientos de caja:', error)
    res.status(500).json({ error: 'Error al obtener el historial de movimientos de caja.' })
  }
}
