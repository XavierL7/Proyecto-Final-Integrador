// backend/controllers/admin/funcionalidades/createFuncionalidad.js
import prisma from '../../../db.js'

export const createFuncionalidad = async (req, res) => {
  try {
    const { nombre_func, descripcion } = req.body

    if (!nombre_func) {
      return res.status(400).json({ error: 'El nombre de la funcionalidad es obligatorio' })
    }

    const nuevaFunc = await prisma.funcionalidad.create({
      data: { nombre_func, descripcion }
    })

    res.status(201).json(nuevaFunc)
  } catch (error) {
    console.error('Error creando funcionalidad:', error)
    res.status(500).json({ error: 'Error al crear la funcionalidad' })
  }
}