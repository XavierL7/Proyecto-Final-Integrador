// backend/controllers/admin/funcionalidades/deleteFuncionalidad.js
import prisma from '../../../db.js'

export const deleteFuncionalidad = async (req, res) => {
  try {
    const { id } = req.params

    const enUso = await prisma.roles_Funcionalidades.findFirst({
      where: { id_func: parseInt(id) }
    })

    if (enUso) {
      return res.status(400).json({ error: 'No se puede eliminar una funcionalidad en uso' })
    }

    await prisma.funcionalidad.delete({
      where: { id_func: parseInt(id) }
    })

    res.json({ message: 'Funcionalidad eliminada correctamente' })
  } catch (error) {
    console.error('Error eliminando funcionalidad:', error)
    res.status(500).json({ error: 'Error al eliminar la funcionalidad' })
  }
}