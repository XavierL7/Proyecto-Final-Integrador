// backend/routes/cajaRoutes.js
import express from 'express'
import {
  getCajas,
  getCajaActiva,
  abrirCaja,
  cerrarCaja
} from '../controllers/cajaController.js'
import { verificarToken } from '../middleware/auth.js'
import { checkPermission } from '../middleware/permisos.js'

const router = express.Router()

// Todas requieren autenticación + el mismo permiso que ya usa /cajas en el front
router.use(verificarToken)
router.use(checkPermission('abrir_caja'))

// GET /api/cajas - Historial de cajas
router.get('/', getCajas)

// GET /api/cajas/activa - La caja abierta ahora mismo (o null)
router.get('/activa', getCajaActiva)

// POST /api/cajas - Abrir una caja nueva
router.post('/', abrirCaja)

// PUT /api/cajas/:id/cerrar - Cerrar una caja
router.put('/:id/cerrar', cerrarCaja)

export default router
