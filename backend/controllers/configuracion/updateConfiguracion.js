// backend/controllers/configuracion/updateConfiguracion.js
import prisma from '../../db.js'
import { CONFIGURACIONES_VALIDAS } from '../../lib/configuracion.js'

// PUT /api/configuracion/:clave   { valor: '...' }
export const updateConfiguracion = async (req, res) => {
  try {
    const { clave } = req.params
    const { valor } = req.body

    const valoresPermitidos = CONFIGURACIONES_VALIDAS[clave]
    if (!valoresPermitidos) {
      return res.status(400).json({ error: `La clave de configuración "${clave}" no existe.` })
    }

    if (!valor || !valoresPermitidos.includes(valor)) {
      return res.status(400).json({
        error: `Valor inválido para "${clave}". Valores permitidos: ${valoresPermitidos.join(', ')}.`
      })
    }

    await prisma.configuracion.upsert({
      where: { clave },
      update: { valor },
      create: { clave, valor }
    })

    res.json({ clave, valor })
  } catch (error) {
    console.error('Error actualizando configuración:', error)
    res.status(500).json({ error: 'Error en el servidor al guardar la configuración.' })
  }
}
