// backend/controllers/etiqueta/getEtiquetas.js
import prisma from '../../db.js'

export const getEtiquetas = async (req, res) => {
  try {
    const etiquetas = await prisma.etiqueta.findMany({
      orderBy: { nombre_etiqueta: 'asc' }
    })
    res.json(etiquetas)
  } catch (error) {
    console.error('Error obteniendo etiquetas:', error)
    res.status(500).json({ error: 'Error al obtener etiquetas' })
  }
}