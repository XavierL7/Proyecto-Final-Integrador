// backend/routes/etiquetaRoutes.js
import express from 'express'
import {
  getEtiquetas,
  createEtiqueta,
  updateEtiqueta,
  deleteEtiqueta,
  toggleActivaEtiqueta
} from '../controllers/etiquetaController.js'
import { verificarToken } from '../middleware/auth.js'
import { checkPermission } from '../middleware/permisos.js'

const router = express.Router()

router.use(verificarToken)

router.get('/', checkPermission('Ver_Etiquetas'), getEtiquetas)
router.post('/', checkPermission('Agregar_Etiquetas'), createEtiqueta)
router.put('/:id', checkPermission('Editar_Etiquetas'), updateEtiqueta)

// Deshabilitar (activo=false) sin borrar
router.put('/:id/activa', checkPermission('Deshabilitar_Etiquetas'), toggleActivaEtiqueta)

// Eliminar de verdad, solo si no está en uso (por producto o promoción)
router.delete('/:id', checkPermission('Borrar_Etiquetas'), deleteEtiqueta)

export default router
