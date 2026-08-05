// backend/controllers/admin/roles/getRoles.js
import prisma from '../../../db.js'

export const getRoles = async (req, res) => {
  try {
    const roles = await prisma.rol.findMany({
      include: {
        roles_funcionalidades: {
          include: { funcionalidad: true }
        }
      }
    })
    res.json(roles)
  } catch (error) {
    console.error('Error obteniendo roles:', error)
    res.status(500).json({ error: 'Error al obtener roles' })
  }
}