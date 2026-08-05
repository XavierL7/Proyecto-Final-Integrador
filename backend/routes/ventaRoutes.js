// backend/routes/ventaRoutes.js
import express from 'express'
import { createVenta, getVentas } from '../controllers/ventaController.js'
import { verificarToken } from '../middleware/auth.js'
import { checkPermission } from '../middleware/permisos.js'

const router = express.Router()

// Todas requieren autenticación
router.use(verificarToken)

// POST /api/ventas - Registrar una venta (permiso registrar_venta)
router.post('/', checkPermission('registrar_venta'), createVenta)

// GET /api/ventas - Obtener ventas (permiso ver_reportes)
router.get('/', checkPermission('ver_reportes'), getVentas)

export default router