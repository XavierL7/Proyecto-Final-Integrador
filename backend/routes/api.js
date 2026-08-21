import express from 'express';
import { registrarTrabajador, loginTrabajador } from '../controllers/authController.js';
import { buscarProducto } from '../controllers/productoController.js';
import { verificarToken } from '../middleware/auth.js';
import adminRoutes from './adminRoutes.js';
import etiquetaRoutes from './etiquetaRoutes.js'  
import productoRoutes from './productoRoutes.js'
import metodoPagoRoutes from './metodoPagoRoutes.js'
import ventaRoutes from './ventaRoutes.js'
import clientesRoutes from './clientesRoutes.js'

const router = express.Router();

// rutas de admin
router.use('/admin', adminRoutes);
// rutas de etiquetas
router.use('/etiquetas', etiquetaRoutes)
//ruta de productos
router.use('/productos', productoRoutes) 
//metodos de pago
router.use('/metodos-pago', metodoPagoRoutes)
//ventas
router.use('/ventas', ventaRoutes)


// Definir el prefijo '/api/clientes'
router.use('/clientes', clientesRoutes)

// Rutas de autenticación (usan el controlador)
router.post('/auth/register', registrarTrabajador);
router.post('/auth/login', loginTrabajador);


// verificarToken se ejecuta antes de buscarProducto
router.get('/productos/buscar', verificarToken, buscarProducto);

export default router;