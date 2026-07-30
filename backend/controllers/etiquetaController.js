// backend/controllers/etiquetaController.js
import prisma from '../db.js'

// Obtener todas las etiquetas
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

// Crear una etiqueta
export const createEtiqueta = async (req, res) => {
  try {
    const { nombre_etiqueta, descripcion } = req.body

    // Validar que no esté vacío
    if (!nombre_etiqueta || nombre_etiqueta.trim() === '') {
      return res.status(400).json({ error: 'El nombre de la etiqueta es obligatorio' })
    }

    // Limitar a 20 caracteres
    if (nombre_etiqueta.length > 20) {
      return res.status(400).json({ error: 'El nombre no puede tener más de 20 caracteres' })
    }

    // Verificar que no exista
    const existe = await prisma.etiqueta.findFirst({
      where: { 
        nombre_etiqueta: {
          equals: nombre_etiqueta.trim(),
          mode: 'insensitive'
        }
      }
    })

    if (existe) {
      return res.status(400).json({ error: 'Ya existe una etiqueta con ese nombre' })
    }

    const nuevaEtiqueta = await prisma.etiqueta.create({
      data: {
        nombre_etiqueta: nombre_etiqueta.trim(),
        descripcion: descripcion?.trim() || null
      }
    })

    res.status(201).json(nuevaEtiqueta)
  } catch (error) {
    console.error('Error creando etiqueta:', error)
    res.status(500).json({ error: 'Error al crear la etiqueta' })
  }
}

// Actualizar una etiqueta
export const updateEtiqueta = async (req, res) => {
  try {
    const { id } = req.params
    const { nombre_etiqueta, descripcion } = req.body

    if (!nombre_etiqueta || nombre_etiqueta.trim() === '') {
      return res.status(400).json({ error: 'El nombre de la etiqueta es obligatorio' })
    }

    if (nombre_etiqueta.length > 20) {
      return res.status(400).json({ error: 'El nombre no puede tener más de 20 caracteres' })
    }

    const etiqueta = await prisma.etiqueta.update({
      where: { id_etiqueta: parseInt(id) },
      data: {
        nombre_etiqueta: nombre_etiqueta.trim(),
        descripcion: descripcion?.trim() || null
      }
    })

    res.json(etiqueta)
  } catch (error) {
    console.error('Error actualizando etiqueta:', error)
    res.status(500).json({ error: 'Error al actualizar la etiqueta' })
  }
}

// Eliminar una etiqueta
export const deleteEtiqueta = async (req, res) => {
  try {
    const { id } = req.params

    // Verificar que no esté siendo usada por algún producto
    const enUso = await prisma.productos_Etiquetas.findFirst({
      where: { id_etiqueta: parseInt(id) }
    })

    if (enUso) {
      return res.status(400).json({ 
        error: 'No se puede eliminar una etiqueta que está siendo usada por un producto' 
      })
    }

    await prisma.etiqueta.delete({
      where: { id_etiqueta: parseInt(id) }
    })

    res.json({ message: 'Etiqueta eliminada correctamente' })
  } catch (error) {
    console.error('Error eliminando etiqueta:', error)
    res.status(500).json({ error: 'Error al eliminar la etiqueta' })
  }
}