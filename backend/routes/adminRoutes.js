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
router.post('/trabajadores', createTrabajador)
router.put('/trabajadores/:id', updateTrabajador)
router.delete('/trabajadores/:id', deleteTrabajador)

// Funcionalidades
router.get('/funcionalidades', getFuncionalidades)
router.post('/funcionalidades', createFuncionalidad)
router.delete('/funcionalidades/:id', deleteFuncionalidad)

export default router