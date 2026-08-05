// backend/controllers/etiqueta/createEtiqueta.js
import prisma from '../../db.js'

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