// backend/controllers/adminController.js
import prisma from '../db.js'
import bcrypt from 'bcrypt'

// ============================================================
// ROLES
// ============================================================

// Obtener todos los roles con sus permisos
export const getRoles = async (req, res) => {
  try {
    const roles = await prisma.rol.findMany({
      include: {
        roles_funcionalidades: {
          include: { funcionalidad: true }
        }
      }
    })
    res.json(roles)
  } catch (error) {
    console.error('Error obteniendo roles:', error)
    res.status(500).json({ error: 'Error al obtener roles' })
  }
}

// Crear nuevo rol

export const createRol = async (req, res) => {
  try {
    const { nombre_rol, funcionalidades } = req.body

    if (!nombre_rol) {
      return res.status(400).json({ error: 'El nombre del rol es obligatorio' })
    }

    const existe = await prisma.rol.findFirst({
      where: { nombre_rol }
    })

    if (existe) {
      return res.status(400).json({ error: 'Ya existe un rol con ese nombre' })
    }

    const nuevoRol = await prisma.rol.create({
      data: {
        nombre_rol,  // ← NO incluyas id_rol
        roles_funcionalidades: {
          create: funcionalidades?.map(id_func => ({
            id_func,
            activo: true
          })) || []
        }
      },
      include: {
        roles_funcionalidades: {
          include: { funcionalidad: true }
        }
      }
    })

    res.status(201).json(nuevoRol)
  } catch (error) {
    console.error('Error creando rol:', error)
    res.status(500).json({ error: 'Error al crear el rol' })
  }
}

// Actualizar rol
export const updateRol = async (req, res) => {
  try {
    const { id } = req.params
    const { nombre_rol, funcionalidades } = req.body

    // Verificar que el rol existe
    const rol = await prisma.rol.findUnique({
      where: { id_rol: parseInt(id) }
    })

    if (!rol) {
      return res.status(404).json({ error: 'Rol no encontrado' })
    }

    // Actualizar rol
    const rolActualizado = await prisma.rol.update({
      where: { id_rol: parseInt(id) },
      data: {
        nombre_rol,
        // Eliminar permisos existentes y crear nuevos
        roles_funcionalidades: {
          deleteMany: {},
          create: funcionalidades?.map(id_func => ({
            id_func,
            activo: true
          })) || []
        }
      },
      include: {
        roles_funcionalidades: {
          include: { funcionalidad: true }
        }
      }
    })

    res.json(rolActualizado)
  } catch (error) {
    console.error('Error actualizando rol:', error)
    res.status(500).json({ error: 'Error al actualizar el rol' })
  }
}

// Eliminar rol
export const deleteRol = async (req, res) => {
  try {
    const { id } = req.params

    // Verificar que no tenga trabajadores asignados
    const trabajadores = await prisma.trabajador.findFirst({
      where: { id_rol: parseInt(id) }
    })

    if (trabajadores) {
      return res.status(400).json({ error: 'No se puede eliminar un rol con trabajadores asignados' })
    }

    // Eliminar permisos primero
    await prisma.roles_Funcionalidades.deleteMany({
      where: { id_rol: parseInt(id) }
    })

    // Eliminar rol
    await prisma.rol.delete({
      where: { id_rol: parseInt(id) }
    })

    res.json({ message: 'Rol eliminado correctamente' })
  } catch (error) {
    console.error('Error eliminando rol:', error)
    res.status(500).json({ error: 'Error al eliminar el rol' })
  }
}

// ============================================================
// TRABAJADORES
// ============================================================

// Obtener todos los trabajadores
export const getTrabajadores = async (req, res) => {
  try {
    const trabajadores = await prisma.trabajador.findMany({
      include: { rol: true }
    })
    res.json(trabajadores)
  } catch (error) {
    console.error('Error obteniendo trabajadores:', error)
    res.status(500).json({ error: 'Error al obtener trabajadores' })
  }
}

// Crear trabajador
export const createTrabajador = async (req, res) => {
  try {
    const { nombre, apellido, dni, password, id_rol } = req.body

    if (!nombre || !apellido || !dni || !password || !id_rol) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' })
    }

    // Verificar DNI único
    const existe = await prisma.trabajador.findFirst({
      where: { dni: parseInt(dni) }
    })

    if (existe) {
      return res.status(400).json({ error: 'Ya existe un trabajador con ese DNI' })
    }

    // Hashear contraseña
    const salt = await bcrypt.genSalt(10)
    const contraseña_hash = await bcrypt.hash(password, salt)

    const nuevoTrabajador = await prisma.trabajador.create({
      data: {
        nombre,
        apellido,
        dni: parseInt(dni),
        contraseña_hash,
        id_rol: parseInt(id_rol)
      },
      include: { rol: true }
    })

    res.status(201).json(nuevoTrabajador)
  } catch (error) {
    console.error('Error creando trabajador:', error)
    res.status(500).json({ error: 'Error al crear el trabajador' })
  }
}

// Actualizar trabajador
export const updateTrabajador = async (req, res) => {
  try {
    const { id } = req.params
    const { nombre, apellido, dni, id_rol } = req.body

    const trabajador = await prisma.trabajador.update({
      where: { id_trabajador: parseInt(id) },
      data: {
        nombre,
        apellido,
        dni: parseInt(dni),
        id_rol: parseInt(id_rol)
      },
      include: { rol: true }
    })

    res.json(trabajador)
  } catch (error) {
    console.error('Error actualizando trabajador:', error)
    res.status(500).json({ error: 'Error al actualizar el trabajador' })
  }
}

// Eliminar trabajador
export const deleteTrabajador = async (req, res) => {
  try {
    const { id } = req.params

    await prisma.trabajador.delete({
      where: { id_trabajador: parseInt(id) }
    })

    res.json({ message: 'Trabajador eliminado correctamente' })
  } catch (error) {
    console.error('Error eliminando trabajador:', error)
    res.status(500).json({ error: 'Error al eliminar el trabajador' })
  }
}

// ============================================================
// FUNCIONALIDADES
// ============================================================

// Obtener todas las funcionalidades
export const getFuncionalidades = async (req, res) => {
  try {
    const funcionalidades = await prisma.funcionalidad.findMany()
    res.json(funcionalidades)
  } catch (error) {
    console.error('Error obteniendo funcionalidades:', error)
    res.status(500).json({ error: 'Error al obtener funcionalidades' })
  }
}

// Crear funcionalidad
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

// Eliminar funcionalidad
export const deleteFuncionalidad = async (req, res) => {
  try {
    const { id } = req.params

    // Verificar que no esté en uso
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