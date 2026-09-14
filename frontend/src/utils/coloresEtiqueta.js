// frontend/src/utils/coloresEtiqueta.js
//
// Paleta única de colores para etiquetas. Antes cada vista (StockView,
// EtiquetasView) calculaba el color sola con "id_etiqueta % 10" contra
// su propia copia de esta lista. Ahora el color se elige (o se sortea)
// al crear/editar la etiqueta y se guarda en la base (campo "color"),
// así que todas las vistas tienen que pintar exactamente lo mismo:
// import { obtenerColorEtiqueta, PALETA_ETIQUETAS } from '.../coloresEtiqueta'
//
// IMPORTANTE: las claves ("key") tienen que ser idénticas a las de
// backend/constants/coloresEtiqueta.js.
export const PALETA_ETIQUETAS = [
  { key: 'azul',     label: 'Azul',      bg: '#E3F2FD', text: '#1565C0', border: '#90CAF9' },
  { key: 'verde',    label: 'Verde',     bg: '#E8F5E9', text: '#2E7D32', border: '#A5D6A7' },
  { key: 'naranja',  label: 'Naranja',   bg: '#FFF3E0', text: '#E65100', border: '#FFCC80' },
  { key: 'rosa',     label: 'Rosa',      bg: '#FCE4EC', text: '#C62828', border: '#F48FB1' },
  { key: 'violeta',  label: 'Violeta',   bg: '#F3E5F5', text: '#6A1B9A', border: '#CE93D8' },
  { key: 'turquesa', label: 'Turquesa',  bg: '#E0F7FA', text: '#00695C', border: '#80DEEA' },
  { key: 'amarillo', label: 'Amarillo',  bg: '#FFFDE7', text: '#F57F17', border: '#FFD54F' },
  { key: 'marron',   label: 'Marrón',    bg: '#EFEBE9', text: '#4E342E', border: '#BCAAA4' },
  { key: 'indigo',   label: 'Índigo',    bg: '#E8EAF6', text: '#283593', border: '#9FA8DA' },
  { key: 'coral',    label: 'Coral',     bg: '#FBE9E7', text: '#BF360C', border: '#FFAB91' },
]

const COLOR_POR_DEFECTO = PALETA_ETIQUETAS[0]

// Busca el color por su clave (lo que se guarda en Etiqueta.color).
// Si la etiqueta es vieja y todavía no tiene color asignado (no debería
// pasar después de la migración, pero por las dudas), cae en el primero
// de la paleta en vez de romper.
export function obtenerColorEtiqueta(colorKey) {
  return PALETA_ETIQUETAS.find(c => c.key === colorKey) || COLOR_POR_DEFECTO
}

export function colorEtiquetaAlAzar(excluir = null) {
  const opciones = excluir
    ? PALETA_ETIQUETAS.filter(c => c.key !== excluir)
    : PALETA_ETIQUETAS
  return opciones[Math.floor(Math.random() * opciones.length)].key
}
