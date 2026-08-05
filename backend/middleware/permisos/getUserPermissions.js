// backend/middleware/permisos/getUserPermissions.js
import prisma from '../../db.js'

/**
 * Obtiene todos los permisos de un usuario (para el frontend)
 * @param {number} userId - ID del trabajador
 * @returns {Promise<string[]>} Lista de permisos
 */
export const getUserPermissions = async (userId) => {
  try {
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

    if (!trabajador?.rol?.roles_funcionalidades) {
      return []
    }

    return trabajador.rol.roles_funcionalidades
      .filter(rf => rf.funcionalidad)
      .map(rf => rf.funcionalidad.nombre_func)
  } catch (error) {
    console.error('Error obteniendo permisos:', error)
    return []
  }
}