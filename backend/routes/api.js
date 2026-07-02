// backend/routes/api.js
import express from 'express';
import prisma from '../db.js'; 
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'kairo_secret_key_2026';

// =========================================================================
// 1. ENDPOINT DE REGISTRO (Campos 100% reales de tu Trabajador)
// =========================================================================
router.post('/auth/register', async (req, res) => {
  try {
    // Tomamos solo lo que tu schema permite
    const { nombre, apellido, password} = req.body;

    if (!nombre || !apellido || !password) {
      return res.status(400).json({ error: 'Nombre, apellido y contraseña son obligatorios.' });
    }

    // Controlamos si ya existe alguien con el mismo nombre y apellido para evitar duplicados
    const trabajadorExistente = await prisma.trabajador.findFirst({
      where: {
        nombre: nombre,
        apellido: apellido
      }
    });

    if (trabajadorExistente) {
      return res.status(400).json({ error: 'Ya existe un trabajador registrado con ese nombre y apellido.' });
    }

    // Encriptamos la clave
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Inserción limpia en Supabase
    const nuevoTrabajador = await prisma.trabajador.create({
      data: {
        nombre: nombre,
        apellido: apellido,
        contraseña_hash: passwordHash,
        id_rol: 2
      }
    });

    res.status(201).json({
      success: true,
      message: 'Trabajador registrado con éxito en el sistema Kairo.',
      trabajador: { id: nuevoTrabajador.id_trabajador, nombre: nuevoTrabajador.nombre }
    });

  } catch (error) {
    console.error('Error en registro con Prisma:', error);
    res.status(500).json({ error: 'Error interno de la base de datos al guardar.' });
  }
});

// =========================================================================
// 2. ENDPOINT DE LOGIN (Buscando por Nombre y Apellido al no tener Email)
// =========================================================================
router.post('/auth/login', async (req, res) => {
  try {
    const { nombre, apellido, password } = req.body;

    // Buscamos al trabajador por sus datos nominales
    const trabajador = await prisma.trabajador.findFirst({
      where: {
        nombre: nombre,
        apellido: apellido
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
      return res.status(401).json({ error: 'El trabajador no existe.' });
    }

    const contrasenaValida = await bcrypt.compare(password, trabajador.contraseña_hash);
    if (!contrasenaValida) {
      return res.status(401).json({ error: 'Contraseña incorrecta.' });
    }

    const funcionalidades = trabajador.rol?.roles_funcionalidades
    ?.map(rf => rf.funcionalidad.nombre_func) || [];
    const token = jwt.sign({ id: trabajador.id_trabajador }, JWT_SECRET, { expiresIn: '8h' });

    res.json({
      token,
      trabajador: {
        id: trabajador.id_trabajador,
        nombre: trabajador.nombre,
        apellido: trabajador.apellido,
        rol: { nombre_rol: trabajador.rol?.nombre_rol }
      },
      funcionalidades
    });

  } catch (error) {
    console.error('Error en Login:', error);
    res.status(500).json({ error: 'Error en el servidor al autenticar.' });
  }
});

// backend/routes/api.js - AGREGAR AL FINAL DEL ARCHIVO, ANTES DEL export default router

// =========================================================================
// 3. ENDPOINT PARA BUSCAR PRODUCTOS (GET)
// =========================================================================
router.get('/productos/buscar', async (req, res) => {
  try {
    const { q } = req.query

    // Verificar si se envió el término de búsqueda
    if (!q || q.trim() === '') {
      return res.status(400).json({ error: 'Falta el término de búsqueda' })
    }

    // Buscar producto por código de barras o por nombre (insensible a mayúsculas)
    const producto = await prisma.producto.findFirst({
      where: {
        OR: [
          { codigo_barras: q.trim() },
          { nombre_producto: { contains: q.trim(), mode: 'insensitive' } }
        ]
      }
    })

    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' })
    }

    // Devolver el producto encontrado
    res.json(producto)

  } catch (error) {
    console.error('Error buscando producto:', error)
    res.status(500).json({ error: 'Error al buscar producto' })
  }
})

export default router // 👈 Asegúrate que esto esté al final