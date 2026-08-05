// backend/controllers/admin/funcionalidades/getFuncionalidades.js
import prisma from '../../../db.js'

export const getFuncionalidades = async (req, res) => {
  try {
    const funcionalidades = await prisma.funcionalidad.findMany()
    res.json(funcionalidades)
  } catch (error) {
    console.error('Error obteniendo funcionalidades:', error)
    res.status(500).json({ error: 'Error al obtener funcionalidades' })
  }
}