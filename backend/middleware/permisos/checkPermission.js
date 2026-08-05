// backend/middleware/permisos/checkPermission.js
import prisma from '../../db.js'

/**
 * Middleware que verifica si el usuario tiene un permiso específico
 * @param {string} requiredPermission - El permiso requerido (ej: 'crear_roles')
 * @returns {Function} Middleware de Express
 */
export const checkPermission = (requiredPermission) => {
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

      // Verificar si tiene el permiso requerido
      const hasPermission = trabajador.rol?.roles_funcionalidades?.some(
        rf => rf.funcionalidad?.nombre_func === requiredPermission
      ) || false

      if (!hasPermission) {
        return res.status(403).json({
          error: 'No tienes permiso para acceder a este recurso'
        })
      }

      // Si tiene permiso, continuar
      next()

    } catch (error) {
      console.error('Error en middleware de permisos:', error)
      res.status(500).json({ error: 'Error de servidor' })
    }
  }
}