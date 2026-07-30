import express from 'express';
import { registrarTrabajador, loginTrabajador } from '../controllers/authController.js';
import { buscarProducto } from '../controllers/productoController.js';
import { verificarToken } from '../middleware/auth.js';
import adminRoutes from './adminRoutes.js';
import etiquetaRoutes from './etiquetaRoutes.js'  
import productoRoutes from './productoRoutes.js'

const router = express.Router();

// rutas de admin
router.use('/admin', adminRoutes);
// rutas de etiquetas
router.use('/etiquetas', etiquetaRoutes)
//ruta de productos
router.use('/productos', productoRoutes) 

// Rutas de autenticación (usan el controlador)
router.post('/auth/register', registrarTrabajador);
router.post('/auth/login', loginTrabajador);


// verificarToken se ejecuta antes de buscarProducto
router.get('/productos/buscar', verificarToken, buscarProducto);

export default router;