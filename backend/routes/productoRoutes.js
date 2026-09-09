// backend/routes/productoRoutes.js
import express from 'express'
import {
  getProductos,
  getProductoById,
  buscarProducto,
  createProducto,
  updateProducto,
  deleteProducto
} from '../controllers/productoController.js'
import { verificarToken } from '../middleware/auth.js'
import { checkPermission } from '../middleware/permisos.js'

const router = express.Router()

// Todas requieren autenticación
router.use(verificarToken)

// GET /api/productos - Listar productos (gestión de stock)
router.get('/', checkPermission('Ver_Stock'), getProductos)

// GET /api/productos/buscar?q=... - Buscar producto. Lo usa cualquier
// cajero desde Ventas, no solo quien administra el stock -> queda libre
// para cualquier autenticado, sin permiso extra.
router.get('/buscar', buscarProducto)

// GET /api/productos/:id - Obtener un producto
router.get('/:id', checkPermission('Ver_Stock'), getProductoById)

// POST /api/productos - Crear producto
router.post('/', checkPermission('Agregar_Producto'), createProducto)

// PUT /api/productos/:id - Actualizar producto
router.put('/:id', checkPermission('Editar_Producto'), updateProducto)

// DELETE /api/productos/:id - Eliminar producto
router.delete('/:id', checkPermission('Eliminar_Stock'), deleteProducto)

export default router
