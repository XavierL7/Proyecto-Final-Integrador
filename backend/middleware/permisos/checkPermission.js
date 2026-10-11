// backend/middleware/permisos/checkPermission.js
import prisma from '../../db.js'
import { manejarErrorDb } from '../../lib/manejarErrorDb.js'

/**
 * Middleware que verifica si el usuario tiene un permiso específico.
 *
 * Acepta un string o un array de strings:
 *   checkPermission('Ver_Stock')                          -> necesita ESE permiso
 *   checkPermission(['Ver_Stock', 'Ver_Descuentos'])      -> necesita AL MENOS UNO
 *
 * El array sirve para endpoints de solo lectura que consumen varias
 * pantallas (ej. la lista de etiquetas la usan Stock, Etiquetas y
 * Descuentos). Las acciones de escritura siguen con un permiso único.
 *
 * @param {string|string[]} requiredPermission - Permiso(s) requerido(s)
 * @returns {Function} Middleware de Express
 */
export const checkPermission = (requiredPermission) => {
  // Se normaliza una sola vez, al declarar la ruta (no en cada request)
  const permisosAceptados = (Array.isArray(requiredPermission)
    ? requiredPermission
    : [requiredPermission]
  ).filter(Boolean)

  if (permisosAceptados.length === 0) {
    // Error de programación: mejor que falle al arrancar el servidor que
    // dejar una ruta que nadie puede usar (o peor, abierta por error).
    throw new Error('checkPermission requiere al menos un permiso')
  }

  const descripcion = permisosAceptados.join(' | ')

  return async (req, res, next) => {
    try {
      // Obtener el ID del usuario desde req (lo puso auth.js)
      const userId = req.userId

      if (!userId) {
        return res.status(401).json({ error: 'No autenticado' })
      }

      // Buscar al trabajador con su rol y permisos
      const trabajador = await prisma.trabajador.findUnique({
        where: { id_trabajador: userId },
        include: {
          rol: {
            include: {
              roles_funcionalidades: {
                where: { activo: true },
                include: { funcionalidad: true }
              }
            }
          }
        }
      })

      if (!trabajador) {
        return res.status(404).json({ error: 'Trabajador no encontrado' })
      }

      // Tiene acceso si posee AL MENOS UNO de los permisos aceptados
      const hasPermission = trabajador.rol?.roles_funcionalidades?.some(
        rf => permisosAceptados.includes(rf.funcionalidad?.nombre_func)
      ) || false

      if (!hasPermission) {
        return res.status(403).json({
          error: 'No tienes permiso para acceder a este recurso'
        })
      }

      // Si tiene permiso, continuar
      next()

    } catch (error) {
      if (manejarErrorDb(error, res, `verificar el permiso "${descripcion}"`)) return
      console.error('Error en middleware de permisos:', error)
      res.status(500).json({ error: 'Error de servidor' })
    }
  }
}
