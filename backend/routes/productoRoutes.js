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

// GET /api/productos - Listar productos (cualquier usuario autenticado)
router.get('/', getProductos)

// GET /api/productos/buscar?q=... - Buscar producto (cualquier usuario)
router.get('/buscar', buscarProducto)

// GET /api/productos/:id - Obtener un producto
router.get('/:id', getProductoById)

// POST /api/productos - Crear producto (permiso gestionar_productos)
router.post('/', checkPermission('gestionar_productos'), createProducto)

// PUT /api/productos/:id - Actualizar producto
router.put('/:id', checkPermission('gestionar_productos'), updateProducto)

// DELETE /api/productos/:id - Eliminar producto
router.delete('/:id', checkPermission('gestionar_productos'), deleteProducto)

export default router