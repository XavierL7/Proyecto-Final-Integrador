// backend/routes/cajaRoutes.js
import express from 'express'
import {
  getCajas,
  getCajaActiva,
  abrirCaja,
  cerrarCaja, 
} from '../controllers/cajaController.js'
import { getCajaDetalle } from '../controllers/caja/getCajaDetalle.js'
import { verificarToken } from '../middleware/auth.js'
import { checkPermission } from '../middleware/permisos.js'

const router = express.Router()

router.use(verificarToken)

// Abrir caja necesita un permiso distinto según el tipo: individual
// (Crear_Cajas) o compartida (Crear_Cajas_Compartidas). Como depende del
// body de la request, no alcanza con checkPermission(x) fijo: resolvemos
// cuál pedir según venga "compartida" en el body.
const checkPermisoApertura = (req, res, next) => {
  const permisoNecesario = req.body?.compartida ? 'Crear_Cajas_Compartidas' : 'Crear_Cajas'
  return checkPermission(permisoNecesario)(req, res, next)
}

// GET /api/cajas - Historial de cajas
router.get('/', checkPermission('Ver_Cajas'), getCajas)

// GET /api/cajas/activa - La caja abierta ahora mismo (o null)
router.get('/activa', checkPermission('Ver_Cajas'), getCajaActiva)

// GET /api/cajas/:id/detalle - Detalle completo de una caja (resumen + ventas)
router.get('/:id/detalle', checkPermission('Ver_Cajas'), getCajaDetalle)

// POST /api/cajas - Abrir una caja nueva (individual o compartida)
router.post('/', checkPermisoApertura, abrirCaja)

// PUT /api/cajas/:id/cerrar - Cerrar una caja
router.put('/:id/cerrar', checkPermission('Cerrar_Caja'), cerrarCaja)

export default router
