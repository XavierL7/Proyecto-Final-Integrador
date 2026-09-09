import express from 'express';

import { getHistorialAsistencias } from '../controllers/asistenciaController.js';
import { verificarToken } from '../middleware/auth.js';
import { checkPermission } from '../middleware/permisos/checkPermission.js';

// Middleware de autenticación y verificación de permiso exclusivo
const router = express.Router()
router.use(verificarToken);

router.get(
  '/historial', 
  checkPermission('Ver_Historial_Trabajadores'), 
  getHistorialAsistencias
);

export default router