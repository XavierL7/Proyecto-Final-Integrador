// backend/routes/adminRoutes.js
import express from 'express'
import {
  getRoles,
  createRol,
  updateRol,
  deleteRol,
  getTrabajadores,
  createTrabajador,
  updateTrabajador,
  deleteTrabajador,
  solicitarHuella,
  cancelarHuella,
  getFuncionalidades,
  createFuncionalidad,
  deleteFuncionalidad
} from '../controllers/adminController.js'
import { verificarToken } from '../middleware/auth.js'
import { checkPermission } from '../middleware/permisos.js'

const router = express.Router()

// Todas las rutas de admin requieren autenticación y permiso 'crear_roles'
router.use(verificarToken)
router.use(checkPermission('crear_roles'))

// Roles
router.get('/roles', getRoles)
router.post('/roles', createRol)
router.put('/roles/:id', updateRol)
router.delete('/roles/:id', deleteRol)

// Trabajadores
router.get('/trabajadores', getTrabajadores)
router.post('/trabajadores', createTrabajador) // acepta { ..., registrarHuella: true }
router.put('/trabajadores/:id', updateTrabajador)
router.delete('/trabajadores/:id', deleteTrabajador)

// Huella (AS608): reservar el próximo ID de la secuencia (arranca en 5) y
// dejarlo pendiente de captura física, o cancelar una reserva
router.put('/trabajadores/:id/huella', solicitarHuella)
router.put('/trabajadores/:id/huella/cancelar', cancelarHuella)

// Funcionalidades
router.get('/funcionalidades', getFuncionalidades)
router.post('/funcionalidades', createFuncionalidad)
router.delete('/funcionalidades/:id', deleteFuncionalidad)

export default router
