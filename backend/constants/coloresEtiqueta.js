// backend/constants/coloresEtiqueta.js
//
// Colores válidos para el campo "color" de Etiqueta. Son los mismos 10
// de siempre (antes se elegían solo, calculando id_etiqueta % 10; ahora
// se puede elegir a mano o al azar, pero la paleta es la misma para no
// romper la estética del sistema).
//
// IMPORTANTE: esta lista de claves tiene que ser idéntica a la de
// frontend/src/utils/coloresEtiqueta.js (ahí también están bg/text/border
// para pintar; acá solo hace falta la clave para validar).
export const COLORES_ETIQUETA_VALIDOS = [
  'azul',
  'verde',
  'naranja',
  'rosa',
  'violeta',
  'turquesa',
  'amarillo',
  'marron',
  'indigo',
  'coral'
]

export function colorEtiquetaValido(color) {
  return COLORES_ETIQUETA_VALIDOS.includes(color)
}

export function colorEtiquetaAlAzar() {
  const i = Math.floor(Math.random() * COLORES_ETIQUETA_VALIDOS.length)
  return COLORES_ETIQUETA_VALIDOS[i]
}
