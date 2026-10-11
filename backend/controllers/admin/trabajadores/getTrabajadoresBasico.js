// backend/controllers/admin/trabajadores/getTrabajadoresBasico.js
import prisma from '../../../db.js'

// Lista mínima para desplegables/filtros (ej. Asistencias). A propósito
// solo devuelve id, nombre y apellido: nada de DNI, huella ni rol.
export const getTrabajadoresBasico = async (req, res) => {
  try {
    const trabajadores = await prisma.trabajador.findMany({
      select: { id_trabajador: true, nombre: true, apellido: true },
      orderBy: [{ apellido: 'asc' }, { nombre: 'asc' }]
    })
    res.json(trabajadores)
  } catch (error) {
    console.error('Error obteniendo trabajadores (básico):', error)
    res.status(500).json({ error: 'Error al obtener trabajadores' })
  }
}
