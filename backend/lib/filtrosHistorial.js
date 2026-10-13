// backend/lib/filtrosHistorial.js
//
// Helpers compartidos por los listados paginados con búsqueda/filtros del
// Historial (cajas, ventas, movimientos). La búsqueda y los filtros se
// resuelven en la base de datos, sobre TODOS los registros, no solo sobre
// la página que se está viendo.

// Argentina no tiene horario de verano, así que el offset es fijo. Se usa
// para que "desde 2026-10-12" signifique las 00:00 de Argentina aunque el
// servidor corra en UTC.
const OFFSET_ARGENTINA = '-03:00'
const FORMATO_FECHA = /^\d{4}-\d{2}-\d{2}$/

// ?page=1&limit=10  (limit máximo 100)
export function leerPaginacion(query, limitPorDefecto = 10) {
  const page = Math.max(parseInt(query.page) || 1, 1)
  const limit = Math.min(Math.max(parseInt(query.limit) || limitPorDefecto, 1), 100)
  return { page, limit, skip: (page - 1) * limit }
}

export function calcularTotalPaginas(total, limit) {
  return Math.max(Math.ceil(total / limit), 1)
}

// ?desde=2026-10-01&hasta=2026-10-12 (ambos opcionales, inclusivos).
// Devuelve el objeto para usar en un campo DateTime de Prisma, o null si
// no vino ninguna fecha válida.
export function rangoFechas(desde, hasta) {
  const rango = {}

  if (FORMATO_FECHA.test(desde || '')) {
    const d = new Date(`${desde}T00:00:00.000${OFFSET_ARGENTINA}`)
    if (!isNaN(d.getTime())) rango.gte = d
  }

  if (FORMATO_FECHA.test(hasta || '')) {
    const h = new Date(`${hasta}T23:59:59.999${OFFSET_ARGENTINA}`)
    if (!isNaN(h.getTime())) rango.lte = h
  }

  return Object.keys(rango).length > 0 ? rango : null
}

// "juan perez" -> ['juan', 'perez']. Cada palabra tiene que coincidir con
// algún campo (AND entre palabras, OR entre campos), así se puede buscar
// "juan perez" aunque nombre y apellido estén en columnas distintas.
export function palabrasDeBusqueda(q) {
  return (q || '').toString().trim().split(/\s+/).filter(Boolean).slice(0, 6)
}

// "12" o "#12" -> 12. Cualquier otra cosa -> null.
export function numeroDe(palabra) {
  const m = /^#?(\d{1,9})$/.exec(palabra)
  return m ? parseInt(m[1]) : null
}

export const contiene = (palabra) => ({ contains: palabra, mode: 'insensitive' })
