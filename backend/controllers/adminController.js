// backend/controllers/adminController.js
// Este archivo re-exporta las funciones de admin

// ============================================================
// ROLES
// ============================================================
export { getRoles } from './admin/roles/getRoles.js'
export { createRol } from './admin/roles/createRol.js'
export { updateRol } from './admin/roles/updateRol.js'
export { deleteRol } from './admin/roles/deleteRol.js'

// ============================================================
// TRABAJADORES
// ============================================================
export { getTrabajadores } from './admin/trabajadores/getTrabajadores.js'
export { createTrabajador } from './admin/trabajadores/createTrabajador.js'
export { updateTrabajador } from './admin/trabajadores/updateTrabajador.js'
export { deleteTrabajador } from './admin/trabajadores/deleteTrabajador.js'
export { solicitarHuella } from './admin/trabajadores/solicitarHuella.js'
export { cancelarHuella } from './admin/trabajadores/cancelarHuella.js'

// ============================================================
// FUNCIONALIDADES
// ============================================================
export { getFuncionalidades } from './admin/funcionalidades/getFuncionalidades.js'
export { createFuncionalidad } from './admin/funcionalidades/createFuncionalidad.js'
export { deleteFuncionalidad } from './admin/funcionalidades/deleteFuncionalidad.js'
