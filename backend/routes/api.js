import express from 'express';
import { registrarTrabajador, loginTrabajador } from '../controllers/authController.js';
import { consultarLoginHuella } from '../controllers/auth/consultarLoginHuella.js';
import { buscarProducto } from '../controllers/productoController.js';
import { verificarToken } from '../middleware/auth.js';
import adminRoutes from './adminRoutes.js';
import etiquetaRoutes from './etiquetaRoutes.js'  
import productoRoutes from './productoRoutes.js'
import metodoPagoRoutes from './metodoPagoRoutes.js'
import ventaRoutes from './ventaRoutes.js'

import dispositivoRoutes from './dispositivoRoutes.js'

import clientesRoutes from './clientesRoutes.js'

import cajaRoutes from './cajaRoutes.js'


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
// rutas del lector de huella (ESP32 + AS608), autenticadas con API key propia
router.use('/dispositivo', dispositivoRoutes)


router.use('/clientes', clientesRoutes)

// cajas: abrir, cerrar, ver historial y ver la caja activa
router.use('/cajas', cajaRoutes)

// Rutas de autenticación (usan el controlador)
router.post('/auth/register', registrarTrabajador);
router.post('/auth/login', loginTrabajador);
// Login solo con huella: el front hace polling acá mientras el usuario
// tiene el dedo en el lector físico. Sin verificarToken a propósito:
// se usa ANTES de tener sesión.
router.get('/auth/huella/resultado', consultarLoginHuella);


// verificarToken se ejecuta antes de buscarProducto
router.get('/productos/buscar', verificarToken, buscarProducto);

export default router;
