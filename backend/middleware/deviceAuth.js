// backend/middleware/deviceAuth.js
// El lector de huella (ESP32) no es un "trabajador" logueado, así que no
// puede usar verificarToken (JWT). En su lugar valida una API key fija
// configurada en el propio dispositivo y en el backend.
//
// Agregá en tu .env:
//   DEVICE_API_KEY=una-clave-larga-y-aleatoria

const DEVICE_API_KEY = process.env.DEVICE_API_KEY

export const verificarDispositivo = (req, res, next) => {
  const claveRecibida = req.header('x-device-key')

  if (!DEVICE_API_KEY) {
    console.error('[deviceAuth] DEVICE_API_KEY no está configurada en el .env')
    return res.status(500).json({ error: 'Dispositivo no configurado en el servidor.' })
  }

  if (!claveRecibida || claveRecibida !== DEVICE_API_KEY) {
    return res.status(401).json({ error: 'Clave de dispositivo inválida.' })
  }

  next()
}
