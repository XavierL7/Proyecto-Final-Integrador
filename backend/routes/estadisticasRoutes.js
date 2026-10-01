// backend/routes/estadisticasRoutes.js
import { Router } from 'express'
import { checkPermission } from '../middleware/permisos.js'
import { verificarToken } from '../middleware/auth.js'
import { getTopProductosVendidos } from '../controllers/estadisticas/getTopProductosVendidos.js'
import { getTopProductosGanancia } from '../controllers/estadisticas/getTopProductosGanancia.js'
import { getTopVendedores } from '../controllers/estadisticas/getTopVendedores.js'
import { getTopEtiquetas } from '../controllers/estadisticas/getTopEtiquetas.js'
import { getResumenDia } from '../controllers/estadisticas/getResumenDia.js'
// Si tus otras rutas pasan por un middleware de auth, importalo y agregalo
// a cada router.get() como hacen tus rutas de producto/etiqueta.
// import { verificarToken } from '../middlewares/auth.js'

const router = Router()

router.use(verificarToken)

router.get('/productos-mas-vendidos', checkPermission('Ver_Estadisticas'),getTopProductosVendidos)
router.get('/productos-mas-ganancia', checkPermission('Ver_Estadisticas'), getTopProductosGanancia)
router.get('/vendedores-top', checkPermission('Ver_Estadisticas'), getTopVendedores)
router.get('/etiquetas-top', checkPermission('Ver_Estadisticas'), getTopEtiquetas)
router.get('/resumen-dia', checkPermission('Ver_Estadisticas'), getResumenDia)
export default router



// En tu archivo principal (app.js / server.js), donde montás las demás
// rutas (por ejemplo app.use('/api/productos', productoRoutes)), agregá:
//
//   import statsRoutes from './routes/statsRoutes.js'
//   app.use('/api/stats', statsRoutes)