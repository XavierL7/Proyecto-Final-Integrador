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

// POST /api/ventas - Registrar una venta directo (caja individual)
router.post('/', checkPermission('registrar_venta'), createVenta)

// GET /api/ventas - Obtener ventas (permiso ver_reportes)
router.get('/', checkPermission('ver_reportes'), getVentas)

// Caja compartida: confirmar pago espera huella antes de persistir
router.post('/pendiente', checkPermission('registrar_venta'), crearVentaPendiente)
router.get('/pendiente/resultado', checkPermission('registrar_venta'), consultarVentaPendiente)

export default router
