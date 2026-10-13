// backend/controllers/asistenciaController.js
import prisma from '../db.js'
import {
  leerPaginacion,
  calcularTotalPaginas,
  rangoFechas,
  palabrasDeBusqueda,
  numeroDe,
  contiene
} from '../lib/filtrosHistorial.js'

const MS_POR_MINUTO = 1000 * 60

// Fecha de hoy (YYYY-MM-DD) en hora de Argentina, para el rango por defecto.
const hoyArgentina = () =>
  new Date().toLocaleDateString('en-CA', { timeZone: 'America/Argentina/Buenos_Aires' })

const formatearDuracion = (totalMinutos) => `${Math.floor(totalMinutos / 60)}h ${totalMinutos % 60}m`

// GET /api/asistencias/historial?page=1&limit=10&q=texto&estado=activo&desde=2026-10-01&hasta=2026-10-12
//
// - q busca por nombre, apellido, DNI o rol del trabajador.
// - estado: 'activo' (turno en curso) o 'finalizado'.
// - desde/hasta: por defecto, el día de hoy.
// - id_trabajador: se sigue aceptando por compatibilidad.
//
// La respuesta trae la página pedida (asistencias) y un resumen calculado
// sobre TODOS los registros que cumplen los filtros (no solo la página),
// que son los que muestran las tarjetas de arriba.
export const getHistorialAsistencias = async (req, res) => {
  try {
    const { page, limit, skip } = leerPaginacion(req.query)
    const { q, estado, desde, hasta, id_trabajador } = req.query

    // --------------------------------------------------------
    // Filtros
    // --------------------------------------------------------
    const hoy = hoyArgentina()
    const rango = rangoFechas(desde || hoy, hasta || hoy)

    const condiciones = []
    if (rango) condiciones.push({ fecha_hora_entrada: rango })
    if (id_trabajador) condiciones.push({ id_trabajador: Number(id_trabajador) })
    if (estado === 'activo') condiciones.push({ fecha_hora_salida: null })
    if (estado === 'finalizado') condiciones.push({ fecha_hora_salida: { not: null } })

    for (const palabra of palabrasDeBusqueda(q)) {
      const opciones = [
        { trabajador: { nombre: contiene(palabra) } },
        { trabajador: { apellido: contiene(palabra) } },
        { trabajador: { rol: { nombre_rol: contiene(palabra) } } }
      ]
      // El DNI es numérico en la base: se busca por coincidencia exacta.
      const numero = numeroDe(palabra)
      if (numero !== null) opciones.push({ trabajador: { dni: numero } })
      condiciones.push({ OR: opciones })
    }

    const where = condiciones.length > 0 ? { AND: condiciones } : {}
    const orden = [{ fecha_hora_entrada: 'desc' }, { id_asistencia: 'desc' }]

    // --------------------------------------------------------
    // Todos los turnos que cumplen los filtros (solo lo mínimo), para
    // poder calcular el resumen total y saber qué turnos van en la página.
    // --------------------------------------------------------
    const turnos = await prisma.asistencia.findMany({
      where,
      select: {
        id_asistencia: true,
        id_trabajador: true,
        fecha_hora_entrada: true,
        fecha_hora_salida: true
      },
      orderBy: orden
    })

    const total = turnos.length
    const ahora = new Date()

    // --------------------------------------------------------
    // Ventas de cada turno: UNA sola consulta para todos los turnos
    // (antes era una consulta por cada registro).
    // --------------------------------------------------------
    const metricasPorTurno = new Map() // id_asistencia -> { cantidad_ventas, total_facturado }

    if (turnos.length > 0) {
      const idsTrabajadores = [...new Set(turnos.map(t => t.id_trabajador))]
      const inicioMinimo = turnos.reduce(
        (min, t) => (t.fecha_hora_entrada < min ? t.fecha_hora_entrada : min),
        turnos[0].fecha_hora_entrada
      )
      const finMaximo = turnos.reduce((max, t) => {
        const fin = t.fecha_hora_salida || ahora
        return fin > max ? fin : max
      }, ahora)

      const ventas = await prisma.venta.findMany({
        where: {
          id_trabajador: { in: idsTrabajadores },
          fecha_hora: { gte: inicioMinimo, lte: finMaximo }
        },
        select: { id_trabajador: true, fecha_hora: true, total_neto: true }
      })

      const ventasPorTrabajador = new Map()
      for (const v of ventas) {
        if (!ventasPorTrabajador.has(v.id_trabajador)) ventasPorTrabajador.set(v.id_trabajador, [])
        ventasPorTrabajador.get(v.id_trabajador).push(v)
      }

      for (const t of turnos) {
        const fin = t.fecha_hora_salida || ahora
        let cantidad = 0
        let facturado = 0
        for (const v of ventasPorTrabajador.get(t.id_trabajador) || []) {
          if (v.fecha_hora >= t.fecha_hora_entrada && v.fecha_hora <= fin) {
            cantidad++
            facturado += Number(v.total_neto)
          }
        }
        metricasPorTurno.set(t.id_asistencia, {
          cantidad_ventas: cantidad,
          total_facturado: Math.round(facturado * 100) / 100
        })
      }
    }

    // --------------------------------------------------------
    // Resumen sobre todo el conjunto filtrado (tarjetas de arriba)
    // --------------------------------------------------------
    let minutosTotales = 0
    let totalFacturado = 0
    for (const t of turnos) {
      const fin = t.fecha_hora_salida || ahora
      minutosTotales += Math.floor((fin - t.fecha_hora_entrada) / MS_POR_MINUTO)
      totalFacturado += metricasPorTurno.get(t.id_asistencia)?.total_facturado || 0
    }

    // --------------------------------------------------------
    // Detalle solo de los turnos de la página pedida
    // --------------------------------------------------------
    const idsPagina = turnos.slice(skip, skip + limit).map(t => t.id_asistencia)

    const registros = idsPagina.length === 0 ? [] : await prisma.asistencia.findMany({
      where: { id_asistencia: { in: idsPagina } },
      include: {
        trabajador: {
          select: {
            id_trabajador: true,
            nombre: true,
            apellido: true,
            dni: true,
            rol: { select: { nombre_rol: true } }
          }
        }
      }
    })
    const registroPorId = new Map(registros.map(r => [r.id_asistencia, r]))

    const asistencias = idsPagina
      .map(id => registroPorId.get(id))
      .filter(Boolean)
      .map(registro => {
        const fin = registro.fecha_hora_salida || ahora
        const totalMinutos = Math.floor((fin - registro.fecha_hora_entrada) / MS_POR_MINUTO)
        const metricas = metricasPorTurno.get(registro.id_asistencia) || { cantidad_ventas: 0, total_facturado: 0 }

        return {
          id_asistencia: registro.id_asistencia,
          trabajador: {
            id: registro.trabajador.id_trabajador,
            nombre_completo: `${registro.trabajador.nombre} ${registro.trabajador.apellido}`,
            dni: registro.trabajador.dni,
            rol: registro.trabajador.rol?.nombre_rol ?? '-'
          },
          fecha_hora_entrada: registro.fecha_hora_entrada,
          fecha_hora_salida: registro.fecha_hora_salida,
          turno_activo: !registro.fecha_hora_salida,
          tipo_autenticacion: registro.tipo_autenticacion,
          horas_trabajadas: formatearDuracion(totalMinutos), // Ej: "0h 58m"
          minutos_trabajados: totalMinutos,
          metricas_turno: metricas
        }
      })

    return res.status(200).json({
      asistencias,
      total,
      page,
      totalPages: calcularTotalPaginas(total, limit),
      resumen: {
        total_registros: total,
        minutos_totales: minutosTotales,
        total_facturado: Math.round(totalFacturado * 100) / 100
      }
    })
  } catch (error) {
    console.error('Error al obtener el historial de asistencias:', error)
    return res.status(500).json({ error: 'Error interno del servidor al procesar el historial.' })
  }
}
