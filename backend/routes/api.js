import express from 'express';
import { registrarTrabajador, loginTrabajador } from '../controllers/authController.js';
import { buscarProducto } from '../controllers/productoController.js';
import { verificarToken } from '../middleware/auth.js';
import { obtenerMetodosPago } from '../controllers/metodoPagoController.js';

const router = express.Router();

// Rutas de autenticación (usan el controlador)
router.post('/auth/register', registrarTrabajador);
router.post('/auth/login', loginTrabajador);
router.get('/metodos-pago', obtenerMetodosPago); //aun no se usa


// verificarToken se ejecuta antes de buscarProducto
router.get('/productos/buscar', verificarToken, buscarProducto);

export default router;