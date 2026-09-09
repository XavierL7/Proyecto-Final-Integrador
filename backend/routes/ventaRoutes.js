// backend/routes/ventaRoutes.js
import express from 'express'
import {
  createVenta,
  getVentas,
  crearVentaPendiente,
  consultarVentaPendiente
} from '../controllers/ventaController.js'
import { verificarToken } from '../middleware/auth.js'
import { checkPermission } from '../middleware/permisos.js'

const router = express.Router()

// Todas requieren autenticación
router.use(verificarToken)

// POST /api/ventas - Registrar una venta directo (caja individual).
// El documento no distingue un permiso propio de "vender" además de
// poder entrar a la pantalla, así que usamos Ver_Ventas para toda la
// operatoria de venta (no solo para listar la pantalla).
router.post('/', checkPermission('Ver_Ventas'), createVenta)

// GET /api/ventas - Historial de ventas
router.get('/', checkPermission('Ver_Historial_Ventas'), getVentas)

// Caja compartida: confirmar pago espera huella antes de persistir
router.post('/pendiente', checkPermission('Ver_Ventas'), crearVentaPendiente)
router.get('/pendiente/resultado', checkPermission('Ver_Ventas'), consultarVentaPendiente)

export default router
