// backend/server.js
import express from 'express';
import cors from 'cors';
import apiRouter from './routes/api.js'; // Importamos tu archivo unificado

const app = express();

app.use(cors()); // Permite que el frontend de Vue (puerto 5173) haga peticiones
app.use(express.json()); // Clave para que Express pueda leer los req.body en formato JSON

// Vinculamos las rutas
// http://localhost:3000/api/auth/register y http://localhost:3000/api/auth/login
app.use('/api', apiRouter); 

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor de Kairo corriendo en http://localhost:${PORT}`);
});