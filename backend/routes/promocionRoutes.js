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
router.get('/', checkPermission('Ver_Descuentos'), getPromociones)

// GET /api/promociones/vigentes - Las usa cualquier cajero desde Ventas
// para saber qué descuentos ofrecer, no solo quien administra Descuentos
// -> sin permiso extra, cualquier autenticado.
router.get('/vigentes', getPromocionesVigentes)

// POST /api/promociones - Crear
router.post('/', checkPermission('Agregar_Descuento'), createPromocion)

// PUT /api/promociones/:id - Actualizar
router.put('/:id', checkPermission('Editar_Descuento'), updatePromocion)

// PUT /api/promociones/:id/activa - Activar/desactivar: es exactamente
// lo que pide Deshabilitar_Descuento ("si ya se usó, no se puede borrar,
// se desactiva").
router.put('/:id/activa', checkPermission('Deshabilitar_Descuento'), toggleActivaPromocion)

// DELETE /api/promociones/:id - Eliminar (solo si no se usó en ventas)
router.delete('/:id', checkPermission('Eliminar_Descuento'), deletePromocion)

export default router
