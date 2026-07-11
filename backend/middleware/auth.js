// backend/middleware/auth.js
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

// Su trabajo es verificar que el usuario está autenticado
export const verificarToken = (req, res, next) => {
  try {
    // OBTIENE EL HEADER DE AUTORIZACIÓN (son metadatos que viajan con la petición HTTP)
    const authHeader = req.headers.authorization;

    // VERIFICA QUE EL HEADER EXISTA Y TENGA EL FORMATO CORRECTO
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token no proporcionado' });
    }

    // EXTRAE EL TOKEN DEL HEADER
    // split(' ') separa el string en un array: ["Bearer", "eyJhbGci..."] y luego [1] toma la segunda parte (el token)
    const token = authHeader.split(' ')[1];

    // VERIFICAR QUE EL TOKEN SEA VÁLIDO
    // jwt.verify() descifra el token y verifica que no haya sido alterado, el segundo parámetro es la clave secreta que se usó para firmar el token
    const decoded = jwt.verify(token, JWT_SECRET);

    // GUARDAR EL ID DEL USUARIO EN LA REQUEST
    // El token contiene el payload que guardamos al hacer login: { id: 1 }, lo guardamos en req.userId para que los controladores lo usen
    req.userId = decoded.id;

    // PASAR AL SIGUIENTE MIDDLEWARE O CONTROLADOR
    next();

  } catch (error) {
    // CAPTURAR ERRORES DE TOKEN INVÁLIDO, si el token expiro está mal formado, o fue alterado devuelve el error 401 (No autorizado)
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
};