// backend/controllers/caja/getCajas.js
import prisma from '../../db.js'
import {
  leerPaginacion,
  calcularTotalPaginas,
  rangoFechas,
  palabrasDeBusqueda,
  numeroDe,
  contiene
} from '../../lib/filtrosHistorial.js'

const ESTADOS = ['abierta', 'cerrada', 'auditoria']
const MODOS = ['sesion_inicial', 'por_venta']

// GET /api/cajas?page=1&limit=10&q=texto&estado=cerrada&modo=por_venta&desde=2026-10-01&hasta=2026-10-12
//
// q busca por número de caja ("12" o "#12") o por nombre/apellido de quien
// abrió o cerró la caja. Todo se resuelve en la base, sobre todas las cajas.
export const getCajas = async (req, res) => {
  try {
    const { page, limit, skip } = leerPaginacion(req.query)
    const { q, estado, modo, desde, hasta } = req.query

    const condiciones = []

    for (const palabra of palabrasDeBusqueda(q)) {
      const numero = numeroDe(palabra)
      const opciones = [
        { trabajador_apertura: { nombre: contiene(palabra) } },
        { trabajador_apertura: { apellido: contiene(palabra) } },
        { trabajador_cierre: { nombre: contiene(palabra) } },
        { trabajador_cierre: { apellido: contiene(palabra) } }
      ]
      if (numero !== null) opciones.push({ id_caja: numero })
      condiciones.push({ OR: opciones })
    }

    if (ESTADOS.includes(estado)) condiciones.push({ estado })
    if (MODOS.includes(modo)) condiciones.push({ modo_autenticacion: modo })

    const rango = rangoFechas(desde, hasta)
    if (rango) condiciones.push({ fecha_hora_apertura: rango })

    const where = condiciones.length > 0 ? { AND: condiciones } : {}

    const [cajas, total] = await Promise.all([
      prisma.caja.findMany({
        where,
        include: {
          trabajador_apertura: { select: { nombre: true, apellido: true } },
          trabajador_cierre: { select: { nombre: true, apellido: true } },
          arqueos_caja: {
            orderBy: { fecha_hora: 'desc' },
            include: {
              trabajador: { select: { nombre: true, apellido: true } }
            }
          }
        },
        orderBy: { fecha_hora_apertura: 'desc' },
        skip,
        take: limit
      }),
      prisma.caja.count({ where })
    ])

    res.json({ cajas, total, page, totalPages: calcularTotalPaginas(total, limit) })
  } catch (error) {
    console.error('Error obteniendo cajas:', error)
    res.status(500).json({ error: 'Error al obtener las cajas' })
  }
}
