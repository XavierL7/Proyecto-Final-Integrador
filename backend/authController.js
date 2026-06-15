// authController.js
import prisma from './db.js'
import bcrypt from 'bcryptjs'

// 1. REGISTRO REAL (Guarda en la base de datos)
export const registrarTrabajador = async (req, res) => {
  try {
    const { nombre, apellido, contrasena } = req.body

    // Hasheamos la contraseña por seguridad
    const salt = await bcrypt.genSalt(10)
    const contrasena_hash = await bcrypt.hash(contrasena, salt)

    // Insertamos en la tabla 'trabajadores' usando Prisma
    const nuevoTrabajador = await prisma.trabajador.create({
      data: {
        nombre,
        apellido,
        contrasena_hash,
        id_rol: 2, // Por defecto: Trabajador común (como pediste)
        limite_retiro_diario: 0.00, // Valor inicial obligatorio por el tipo Decimal
        permiso_manejo_caja: false
      }
    })

    res.status(201).json({ 
      mensaje: 'Trabajador registrado con éxito en la DB', 
      id: nuevoTrabajador.id_trabajador 
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error al registrar el trabajador en la base de datos' })
  }
}

// 2. LOGIN REAL (Valida contra la DB y extrae permisos)
export const loginTrabajador = async (req, res) => {
  try {
    const { nombre, contrasena } = req.body

    // Buscamos al trabajador por su nombre exacto e incluimos los datos de su Rol
    const trabajador = await prisma.trabajador.findFirst({
      where: { nombre: nombre },
      include: { rol: true }
    })

    if (!trabajador) {
      return res.status(401).json({ error: 'Credenciales inválidas (Usuario no encontrado)' })
    }

    // Validamos la contraseña hasheada
    const contrasenaValida = await bcrypt.compare(contrasena, trabajador.contrasena_hash)
    if (!contrasenaValida) {
      return res.status(401).json({ error: 'Credenciales inválidas (Contraseña incorrecta)' })
    }

    // ¡MAGIA DE PERMISOS DINÁMICOS! 
    // Buscamos en la tabla puente qué funcionalidades tiene activas el rol de este trabajador
    const permisosPuante = await prisma.rolesFuncionalidades.findMany({
      where: {
        id_rol: trabajador.id_rol,
        activo: true
      },
      include: {
        funcionalidad: true
      }
    })

    // Mapeamos el resultado para devolver un simple array de strings: ['crear_roles', etc]
    const funcionalidades = permisosPuante.map(p => p.funcionalidad.nombre_func)

    // Simulamos un token simple por ahora para el Router Guard (luego podés meter JWT)
    const tokenSimulado = `token_seguro_${trabajador.id_trabajador}`

    // Enviamos todo limpio al Frontend
    res.json({
      token: tokenSimulado,
      trabajador: {
        id: trabajador.id_trabajador,
        nombre: trabajador.nombre,
        apellido: trabajador.apellido,
        rol: {
          id_rol: trabajador.id_rol,
          nombre_rol: trabajador.rol.nombre_rol
        }
      },
      funcionalidades
    })

  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Error en el proceso de inicio de sesión' })
  }
}