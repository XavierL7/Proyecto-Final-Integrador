// backend/controllers/authController.js
import prisma from '../db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

// REGISTRO (con DNI)
export const registrarTrabajador = async (req, res) => {
  try {
    //datos que recibe del frontend RegisterView
    const { nombre, apellido, dni, password } = req.body;

    // Validar que todos los campos estén presentes
    if (!nombre || !apellido || !dni || !password) {
      return res.status(400).json({ 
        error: 'Nombre, apellido, DNI y contraseña son obligatorios.' 
      });
    }

    // validar que el DNI sea numérico 
    if (!/^\d{8}$/.test(String(dni))) {
      return res.status(400).json({ 
        error: 'DNI inválido. Debe tener 8 dígitos numéricos.' 
      });
    }

    // verifica que no existe la combinación nombre + apellido + dni
    const trabajadorExistente = await prisma.trabajador.findFirst({
      where: {
        nombre: nombre,
        apellido: apellido,
        dni: parseInt(dni)
      }
    });

    if (trabajadorExistente) {
      return res.status(400).json({ 
        error: 'Ya existe un trabajador con ese nombre, apellido y DNI.' 
      });
    }

    // Encriptar contraseña
    const salt = await bcrypt.genSalt(10);
    const contraseña_hash = await bcrypt.hash(password, salt);

    // Crear trabajador
    const nuevoTrabajador = await prisma.trabajador.create({
      data: {
        nombre,
        apellido,
        dni: parseInt(dni),
        contraseña_hash,
        id_rol: 2 // Trabajador común por defecto
      }
    });

    res.status(201).json({
      success: true,
      message: 'Trabajador registrado con éxito en el sistema Kairo.',
      trabajador: { 
        id: nuevoTrabajador.id_trabajador, 
        nombre: nuevoTrabajador.nombre,
        apellido: nuevoTrabajador.apellido,
        dni: nuevoTrabajador.dni
      }
    });

  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ error: 'Error interno al guardar.' });
  }
};

// LOGIN (con DNI)
export const loginTrabajador = async (req, res) => {
  try {
    //recibe los datos de LoginView
    const { nombre, apellido, dni, password } = req.body;

    // valida que todos los campos estén presentes
    if (!nombre || !apellido || !dni || !password) {
      return res.status(400).json({ 
        error: 'Nombre, apellido, DNI y contraseña son obligatorios.' 
      });
    }

    // busca por nombre + apellido + dni
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
    });

    if (!trabajador) {
      return res.status(401).json({ error: 'Credenciales inválidas.' });
    }

    // verifica contraseña
    const contrasenaValida = await bcrypt.compare(password, trabajador.contraseña_hash);
    if (!contrasenaValida) {
      return res.status(401).json({ error: 'Contraseña incorrecta.' });
    }

    // obtiene las funcionalidades en base a su rol
    const funcionalidades = trabajador.rol?.roles_funcionalidades
      ?.map(rf => rf.funcionalidad.nombre_func) || [];

    // genera token JWT
    const token = jwt.sign(
      { 
        id: trabajador.id_trabajador,
        nombre: trabajador.nombre,
        apellido: trabajador.apellido,
        dni: trabajador.dni
      },

      //cuando expira
      JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({
      token,
      trabajador: {
        id: trabajador.id_trabajador,
        nombre: trabajador.nombre,
        apellido: trabajador.apellido,
        dni: trabajador.dni,
        rol: { nombre_rol: trabajador.rol?.nombre_rol }
      },
      funcionalidades
    });

  } catch (error) {
    console.error('Error en Login:', error);
    res.status(500).json({ error: 'Error en el servidor al autenticar.' });
  }
};