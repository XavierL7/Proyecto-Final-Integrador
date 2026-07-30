// backend/routes/etiquetaRoutes.js
import express from 'express'
import {
  getEtiquetas,
  createEtiqueta,
  updateEtiqueta,
  deleteEtiqueta
} from '../controllers/etiquetaController.js'
import { verificarToken } from '../middleware/auth.js'
import { checkPermission } from '../middleware/permisos.js'

const router = express.Router()

// Todas requieren autenticación
router.use(verificarToken)

// GET /api/etiquetas - Listar etiquetas (cualquier usuario autenticado)
router.get('/', getEtiquetas)

// POST /api/etiquetas - Crear etiqueta (permiso para gestionar productos)
router.post('/', checkPermission('gestionar_productos'), createEtiqueta)

// PUT /api/etiquetas/:id - Actualizar etiqueta
router.put('/:id', checkPermission('gestionar_productos'), updateEtiqueta)

// DELETE /api/etiquetas/:id - Eliminar etiqueta
router.delete('/:id', checkPermission('gestionar_productos'), deleteEtiqueta)

export default router