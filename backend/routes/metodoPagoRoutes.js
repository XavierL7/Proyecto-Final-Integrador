// backend/routes/metodoPagoRoutes.js
import express from 'express'
import { getMetodosPago } from '../controllers/metodoPagoController.js'
import { verificarToken } from '../middleware/auth.js'

const router = express.Router()

// Todas las rutas requieren autenticación
router.use(verificarToken)

router.get('/', getMetodosPago)

export default router