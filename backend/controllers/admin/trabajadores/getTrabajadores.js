// backend/controllers/admin/trabajadores/getTrabajadores.js
import prisma from '../../../db.js'

export const getTrabajadores = async (req, res) => {
  try {
    const trabajadores = await prisma.trabajador.findMany({
      include: { rol: true }
    })

    // Nunca mandamos el hash de la contraseña al navegador. El resto de
    // los campos (incluido hash_huella) sí los usa la tabla de Administración.
    const sinSecretos = trabajadores.map(({ contraseña_hash, ...resto }) => resto)

    res.json(sinSecretos)
  } catch (error) {
    console.error('Error obteniendo trabajadores:', error)
    res.status(500).json({ error: 'Error al obtener trabajadores' })
  }
}
