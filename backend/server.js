// backend/server.js
//archivo encargado de crear el servidor y la aplicacion web, tambien permite la conexion con el frontend al agregar CORS y express.json
import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import apiRouter from './routes/api.js'; // Importamos tu archivo unificado

const app = express();

app.use(cors()); // Permite que el frontend de Vue (puerto 5173) haga peticiones
app.use(express.json()); // Clave para que Express pueda leer los req.body en formato JSON

// Limitador general: aplica a toda la API. Protege contra un volumen
// anómalo de peticiones (ej. un script bombardeando el servidor) sin
// afectar el uso normal de la app.
const limiterGeneral = rateLimit({
  windowMs: 15 * 60 * 1000, // ventana de 15 minutos
  max: 300,                 // hasta 300 peticiones por IP en esa ventana
  standardHeaders: true,    // manda info del límite en headers RateLimit-*
  legacyHeaders: false,
  message: { error: 'Demasiadas peticiones desde esta IP. Probá de nuevo en unos minutos.' }
});

// Limitador estricto solo para login: evita ataques de fuerza bruta contra
// contraseñas sin castigar la navegación normal del resto de la app.
const limiterLogin = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,                  // hasta 10 intentos de login por IP cada 15 min
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Demasiados intentos de inicio de sesión. Esperá unos minutos antes de volver a intentar.' }
});

// El limitador estricto se aplica ANTES del router, y solo a la ruta de login.
app.use('/api/auth/login', limiterLogin);
app.use('/api', limiterGeneral);

// Vinculamos las rutas
// http://localhost:3000/api/auth/register y http://localhost:3000/api/auth/login
app.use('/api', apiRouter); 

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor de Kairo corriendo en http://localhost:${PORT}`);
});