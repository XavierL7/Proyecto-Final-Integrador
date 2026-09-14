// backend/lib/manejarErrorDb.js
//
// Detecta si un error viene de que la base de datos no está disponible
// (caída del servidor, timeout de conexión) en vez de ser un error de
// lógica de negocio, y responde con 503 + un mensaje amigable en lugar
// del 500 genérico. Así el frontend (y el interceptor global de axios)
// puede distinguir "no hay stock" de "la base está caída".
//
// Prisma tiene DOS formatos de error según la versión/motor:
//
// 1) Motor "clásico" (Query Engine en Rust, Prisma <= 6 sin adapter):
//    error.code viene en formato "P10xx".
//      P1001: no se puede alcanzar el servidor de base de datos
//      P1002: el servidor tardó demasiado en responder (timeout de conexión)
//      P1008: se agotó el tiempo de espera de una operación
//      P1010: acceso denegado al usuario de la base
//      P1017: el servidor cerró la conexión
//
// 2) Driver adapters (ej. @prisma/adapter-pg, usado acá): el error es un
//    "DriverAdapterError" y el código real de Postgres queda anidado en
//    error.cause.code, como código SQLSTATE (ej. "08006" = falla de
//    conexión). Las clases SQLSTATE que nos interesan son:
//      "08xxx": connection exception (clase completa)
//      "57P03": cannot_connect_now (la base se está reiniciando)
//      "53300": too_many_connections (pool de conexiones agotado)
const CODIGOS_PRISMA_CLASICO = ['P1001', 'P1002', 'P1008', 'P1010', 'P1017']
const CODIGOS_POSTGRES_CONEXION = ['57P03', '53300']

export function esErrorDeConexionBD(error) {
  if (!error) return false

  if (CODIGOS_PRISMA_CLASICO.includes(error.code)) return true

  const codigoPostgres = error.cause?.code || error.code
  if (typeof codigoPostgres === 'string') {
    if (codigoPostgres.startsWith('08')) return true // clase "connection exception"
    if (CODIGOS_POSTGRES_CONEXION.includes(codigoPostgres)) return true
  }

  // Red de seguridad extra: cualquier error del driver adapter que no
  // hayamos podido clasificar por código, lo tratamos igual como caída
  // de conexión (es mejor mensaje amigable de más que uno de menos).
  if (error.name === 'DriverAdapterError') return true

  return false
}

// Uso en un controller, dentro del catch:
//
//   } catch (error) {
//     if (manejarErrorDb(error, res, 'obtener productos')) return
//     console.error('Error obteniendo productos:', error)
//     res.status(500).json({ error: 'Error al obtener productos' })
//   }
//
// Devuelve true si ya respondió (para que el controller haga `return` y
// no siga con el manejo genérico de errores).
export function manejarErrorDb(error, res, contexto = 'procesar la solicitud') {
  if (esErrorDeConexionBD(error)) {
    console.error(`Base de datos no disponible al intentar ${contexto}:`, error)
    res.status(503).json({
      error: 'El sistema no puede acceder a la base de datos en este momento. Intentá de nuevo en unos minutos.'
    })
    return true
  }
  return false
}

