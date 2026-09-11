// backend/controllers/auth/loginTrabajador.js
import prisma from '../../db.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET

export const loginTrabajador = async (req, res) => {
  try {
    const { nombre, apellido, dni, password } = req.body

    // Validar campos obligatorios
    if (!nombre || !apellido || !dni || !password) {
      return res.status(400).json({
        error: 'Nombre, apellido, DNI y contraseña son obligatorios.'
      })
    }

    // Buscar trabajador por nombre + apellido + dni
    const trabajador = await prisma.trabajador.findFirst({
      where: {
        nombre: nombre,
        apellido: apellido,
        dni: parseInt(dni)
      },
      include: {
        rol: {
          include: {
            roles_funcionalidades: {
              where: { activo: true },
              include: { funcionalidad: true }
            }
          }
        }
      }
    })

    if (!trabajador) {
      return res.status(401).json({ error: 'Credenciales inválidas.' })
    }

    // Verificar contraseña
    const contrasenaValida = await bcrypt.compare(password, trabajador.contraseña_hash)
    if (!contrasenaValida) {
      return res.status(401).json({ error: 'Contraseña incorrecta.' })
    }

    // Obtener funcionalidades del rol
    const funcionalidades = trabajador.rol?.roles_funcionalidades
      ?.map(rf => rf.funcionalidad.nombre_func) || []

    // Si nunca tuvo una asistencia registrada, es su primer ingreso al
    // sistema (no tiene fecha de entrada previa) y se le va a pedir que
    // cambie la contraseña por defecto/provisoria.
    const asistenciasPrevias = await prisma.asistencia.count({
      where: { id_trabajador: trabajador.id_trabajador }
    })
    const primerIngreso = asistenciasPrevias === 0

    await prisma.asistencia.create({
      data: {
        id_trabajador: trabajador.id_trabajador,
        fecha_hora_entrada: new Date(),
        tipo_autenticacion: 'contraseña'
      }
    });
    // Generar token JWT
    const token = jwt.sign(
      {
        id: trabajador.id_trabajador,
        nombre: trabajador.nombre,
        apellido: trabajador.apellido,
        dni: trabajador.dni
      },
      JWT_SECRET,
      { expiresIn: '8h' }
    )

    res.json({
      token,
      trabajador: {
        id: trabajador.id_trabajador,
        nombre: trabajador.nombre,
        apellido: trabajador.apellido,
        dni: trabajador.dni,
        rol: { nombre_rol: trabajador.rol?.nombre_rol }
      },
      funcionalidades,
      requiereCambioPassword: primerIngreso
    })
  } catch (error) {
    console.error('Error en Login:', error)
    res.status(500).json({ error: 'Error en el servidor al autenticar.' })
  }
}