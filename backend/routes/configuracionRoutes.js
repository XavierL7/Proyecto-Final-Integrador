// backend/routes/configuracionRoutes.js
import express from 'express'
import { getConfiguracion, updateConfiguracion } from '../controllers/configuracionController.js'
import { verificarToken } from '../middleware/auth.js'
import { checkPermission } from '../middleware/permisos.js'

const router = express.Router()

router.use(verificarToken)

// GET queda abierto a cualquier trabajador logueado (no solo admins):
// lo necesita, por ejemplo, el modal de abrir caja para precargar el
// modo por defecto. Solo GUARDAR un cambio requiere el permiso de admin.
router.get('/', getConfiguracion)

// Editar_Configuracion es una funcionalidad nueva: hay que crearla desde
// Administración -> Roles (o directo en la base) y asignársela al rol
// que corresponda, igual que con el resto de los permisos del sistema.
router.put('/:clave', checkPermission('Editar_Configuracion'), updateConfiguracion)

export default router
