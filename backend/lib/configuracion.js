// backend/lib/configuracion.js
//
// Configuración global del sistema guardada como pares clave/valor en la
// tabla Configuraciones. Pensado para ajustes que el admin cambia desde
// Administración -> Configuración y que el backend necesita poder leer
// en cualquier punto (ej. antes de permitir un login).
import prisma from '../db.js'

// Valores por defecto si la clave todavía no existe en la tabla (recién
// instalado el sistema, o la migración de semilla no llegó a correr).
const DEFAULTS = {
  metodo_login: 'ambos', // 'ambos' | 'solo_huella' | 'solo_contrasena'
  modo_caja_default: 'sesion_inicial' // 'sesion_inicial' | 'por_venta'
}

// Claves conocidas y sus valores válidos. Sirve tanto para validar al
// guardar (updateConfiguracion) como para saber qué exponer en el GET.
export const CONFIGURACIONES_VALIDAS = {
  metodo_login: ['ambos', 'solo_huella', 'solo_contrasena'],
  modo_caja_default: ['sesion_inicial', 'por_venta']
}

export async function obtenerConfiguracion(clave) {
  const fila = await prisma.configuracion.findUnique({ where: { clave } })
  if (fila) return fila.valor
  return DEFAULTS[clave] ?? null
}

export async function obtenerTodaLaConfiguracion() {
  const filas = await prisma.configuracion.findMany()
  const resultado = { ...DEFAULTS }
  for (const fila of filas) {
    resultado[fila.clave] = fila.valor
  }
  return resultado
}

// Atajo usado en el flujo de login (contraseña y huella) para saber si el
// método que se está intentando usar está permitido por la configuración
// actual del admin.
export async function metodoLoginPermitido(metodo) {
  // metodo: 'contrasena' | 'huella'
  const valor = await obtenerConfiguracion('metodo_login')
  if (valor === 'solo_huella' && metodo === 'contrasena') return false
  if (valor === 'solo_contrasena' && metodo === 'huella') return false
  return true
}

export const MENSAJE_LOGIN_DESHABILITADO = {
  contrasena: 'El inicio de sesión con contraseña está deshabilitado por el administrador. Ingresá con tu huella dactilar.',
  huella: 'El inicio de sesión con huella dactilar está deshabilitado por el administrador. Ingresá con tu contraseña.'
}
