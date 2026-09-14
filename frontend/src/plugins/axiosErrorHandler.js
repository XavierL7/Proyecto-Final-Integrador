// frontend/src/plugins/axiosErrorHandler.js
//
// Intercepta cualquier error de red/timeout de axios en TODA la app y
// muestra un aviso genérico y amigable (vía useAlertasStore), sin
// importar qué pantalla haya disparado la request. Se registra UNA sola
// vez en main.js, así no hace falta tocar cada cargarX() de cada vista.
//
// Los errores de negocio (400/401/403/404 con un mensaje puntual, ej.
// "Contraseña incorrecta") NO pasan por acá: cada pantalla los sigue
// mostrando como hasta ahora (con su propio alert() o mensaje inline).
// Esto solo cubre los casos en los que ni siquiera hubo una respuesta
// normal del servidor.
import axios from 'axios'
import { useAlertasStore } from '../stores/alertas'

const MENSAJE_SIN_RESPUESTA =
  'No se pudo conectar con el servidor. Verificá tu conexión o intentá de nuevo en unos segundos.'
const MENSAJE_TIMEOUT =
  'El servidor está tardando demasiado en responder. Intentá de nuevo en unos segundos.'
const MENSAJE_BD_CAIDA_POR_DEFECTO =
  'El sistema no puede acceder a la base de datos en este momento. Intentá de nuevo en unos minutos.'

export function instalarManejadorErroresAxios() {
  // Sin esto, axios espera indefinidamente: nunca se dispararía el caso
  // ECONNABORTED de más abajo. 15s es margen suficiente para cualquier
  // consulta normal del sistema; ajustalo si tenés reportes muy pesados.
  axios.defaults.timeout = 15000

  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      const alertas = useAlertasStore()

      if (error.code === 'ECONNABORTED') {
        // axios cortó la request porque pasó el timeout configurado.
        alertas.mostrar(MENSAJE_TIMEOUT)
      } else if (!error.response) {
        // No hubo respuesta del servidor: caído, sin red, CORS bloqueado, etc.
        alertas.mostrar(MENSAJE_SIN_RESPUESTA)
      } else if (error.response.status === 503) {
        // El backend detectó que la base de datos no responde (ver
        // backend/lib/manejarErrorDb.js) y devolvió 503 a propósito.
        alertas.mostrar(error.response.data?.error || MENSAJE_BD_CAIDA_POR_DEFECTO)
      }

      // Siempre volvemos a rechazar la promesa: cada pantalla puede
      // seguir haciendo su propio catch si necesita hacer algo más
      // específico (ej. limpiar sesión en un 401).
      return Promise.reject(error)
    }
  )
}
