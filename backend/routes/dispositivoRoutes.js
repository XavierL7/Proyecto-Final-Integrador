// backend/routes/dispositivoRoutes.js
import express from 'express'
import { identificarHuella } from '../controllers/dispositivo/identificarHuella.js'
import { huellasPendientes } from '../controllers/dispositivo/huellasPendientes.js'
import { confirmarHuella } from '../controllers/dispositivo/confirmarHuella.js'
import { verificarDispositivo } from '../middleware/deviceAuth.js'

const router = express.Router()

// Todas las rutas de dispositivo requieren la API key del ESP32,
// NO el JWT de un trabajador (el lector todavía no sabe quién es nadie).
router.use(verificarDispositivo)

// POST /api/dispositivo/identificar-huella   { fingerprintId: 3 }
router.post('/identificar-huella', identificarHuella)

// GET /api/dispositivo/huellas-pendientes
router.get('/huellas-pendientes', huellasPendientes)

// POST /api/dispositivo/confirmar-huella   { fingerprintId: 7 }
router.post('/confirmar-huella', confirmarHuella)

export default router
