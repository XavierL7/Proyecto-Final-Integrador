// backend/routes/estadisticasRoutes.js
import { Router } from 'express'
import { getTopProductosVendidos } from '../controllers/estadisticas/getTopProductosVendidos.js'
import { getTopProductosGanancia } from '../controllers/estadisticas/getTopProductosGanancia.js'
import { getTopVendedores } from '../controllers/estadisticas/getTopVendedores.js'
import { getTopEtiquetas } from '../controllers/estadisticas/getTopEtiquetas.js'
// Si tus otras rutas pasan por un middleware de auth, importalo y agregalo
// a cada router.get() como hacen tus rutas de producto/etiqueta.
// import { verificarToken } from '../middlewares/auth.js'

const router = Router()

router.get('/productos-mas-vendidos', getTopProductosVendidos)
router.get('/productos-mas-ganancia', getTopProductosGanancia)
router.get('/vendedores-top', getTopVendedores)
router.get('/etiquetas-top', getTopEtiquetas)

export default router

// En tu archivo principal (app.js / server.js), donde montás las demás
// rutas (por ejemplo app.use('/api/productos', productoRoutes)), agregá:
//
//   import statsRoutes from './routes/statsRoutes.js'
//   app.use('/api/stats', statsRoutes)