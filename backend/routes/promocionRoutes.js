// backend/routes/promocionRoutes.js
import express from 'express'
import {
  getPromociones,
  getPromocionesVigentes,
  createPromocion,
  updatePromocion,
  deletePromocion,
  toggleActivaPromocion
} from '../controllers/promocionController.js'
import { verificarToken } from '../middleware/auth.js'
import { checkPermission } from '../middleware/permisos.js'

const router = express.Router()

// Todas requieren autenticación
router.use(verificarToken)

// GET /api/promociones - Listado completo (para la página de Descuentos)
router.get('/', getPromociones)

// GET /api/promociones/vigentes - Solo las activas y en fecha (para la caja)
router.get('/vigentes', getPromocionesVigentes)

// POST /api/promociones - Crear (permiso para gestionar productos/precios)
router.post('/', checkPermission('gestionar_productos'), createPromocion)

// PUT /api/promociones/:id - Actualizar
router.put('/:id', checkPermission('gestionar_productos'), updatePromocion)

// PUT /api/promociones/:id/activa - Activar/desactivar rápido
router.put('/:id/activa', checkPermission('gestionar_productos'), toggleActivaPromocion)

// DELETE /api/promociones/:id - Eliminar (si no se usó en ventas)
router.delete('/:id', checkPermission('gestionar_productos'), deletePromocion)

export default router
