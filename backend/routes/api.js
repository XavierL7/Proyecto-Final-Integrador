import express from 'express'; // <-- CAMBIADO: De require a import
const router = express.Router();

// Datos de ejemplo
const siteInfo = {
  name: 'Kairo',
  description: 'Prueba de Colores',
  version: '1.0.0'
};


router.get('/info', (req, res) => {
  res.json(siteInfo);
});

// POST - Ejemplo de endpoint
router.post('/contact', (req, res) => {
  const { name, email, message } = req.body;
  console.log('Mensaje recibido:', { name, email, message });
  res.json({ success: true, message: 'Mensaje recibido correctamente' });
});

export default router; // 