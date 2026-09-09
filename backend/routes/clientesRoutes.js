import express from 'express'
import {
  obtenerClientes,
  crearCliente,
  actualizarCliente,
  eliminarCliente,
  toggleActivaCliente
} from '../controllers/clientesController.js'
import { verificarToken } from '../middleware/auth.js'
import { checkPermission } from '../middleware/permisos.js'

const router = express.Router()

router.use(verificarToken)

router.get('/', checkPermission('Ver_Clientes'), obtenerClientes)
router.post('/', checkPermission('Agregar_Clientes'), crearCliente)
router.put('/:id', checkPermission('Editar_Clientes'), actualizarCliente)

// Deshabilitar (activo=false) sin borrar
router.put('/:id/activa', checkPermission('Deshabilitar_Clientes'), toggleActivaCliente)

// Eliminar de verdad, solo si no tiene ventas asociadas. No hay un
// permiso "Borrar_Clientes" propio en la lista todavía, así que por
// ahora reutilizamos Deshabilitar_Clientes para ambas acciones de
// "remover" un cliente. Si más adelante querés separarlas, agregá
// Borrar_Clientes a Funcionalidades y cambiá esta línea.
router.delete('/:id', checkPermission('Deshabilitar_Clientes'), eliminarCliente)

export default router
