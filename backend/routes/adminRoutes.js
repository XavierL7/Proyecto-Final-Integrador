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

// Todas las rutas de admin requieren autenticación. El permiso específico
// se aplica por acción, no en bloque, siguiendo la regla:
// Ver_X para entrar/listar, Agregar/Editar/Borrar_X para cada botón.
router.use(verificarToken)

// Roles
router.get('/roles', checkPermission('Ver_Roles'), getRoles)
router.post('/roles', checkPermission('Agregar_Roles'), createRol)
router.put('/roles/:id', checkPermission('Editar_Roles'), updateRol)
router.delete('/roles/:id', checkPermission('Borrar_Roles'), deleteRol)

// Trabajadores
router.get('/trabajadores', checkPermission('Ver_Trabajadores'), getTrabajadores)
router.post('/trabajadores', checkPermission('Agregar_Trabajadores'), createTrabajador) // acepta { ..., registrarHuella: true }
router.put('/trabajadores/:id', checkPermission('Editar_Trabajadores'), updateTrabajador)
router.delete('/trabajadores/:id', checkPermission('Borrar_Trabajadores'), deleteTrabajador)

// Huella (AS608): son parte de "editar" al trabajador (le suma un dato
// de acceso), así que quedan detrás del mismo permiso que editarlo.
router.put('/trabajadores/:id/huella', checkPermission('Editar_Trabajadores'), solicitarHuella)
router.put('/trabajadores/:id/huella/cancelar', checkPermission('Editar_Trabajadores'), cancelarHuella)

// Funcionalidades: no hay un permiso propio en la lista todavía (definen
// el sistema de permisos en sí), así que por ahora quedan atadas a la
// gestión de roles -> si se necesita separarlas más adelante, se agrega
// Ver/Agregar/Borrar_Funcionalidades como funcionalidades propias.
router.get('/funcionalidades', checkPermission('Ver_Roles'), getFuncionalidades)
router.post('/funcionalidades', checkPermission('Agregar_Roles'), createFuncionalidad)
router.delete('/funcionalidades/:id', checkPermission('Borrar_Roles'), deleteFuncionalidad)

export default router
