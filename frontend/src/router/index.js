// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

// router/index.js sirve para definir las rutas de la aplicación
const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/LoginView.vue'), 
    meta: { requiereAuth: false }
  },

  {
    path: '/stock',
    name: 'Stock',
    component: () => import('../views/StockView.vue'),
    meta: { 
      requiereAuth: true,
      permiso: 'gestionar_productos'
    }
  },

  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/RegisterView.vue'), 
    meta: { requiereAuth: false }
  },
  {
    path: '/',
    name: 'Dashboard',
    component: () => import('../views/DashboardView.vue'),
    meta: { requiereAuth: true } // Solo entran logueados
  },

  {
    path: '/pagina',
    name: 'landingpage',
    component: () => import('../views/pagina.vue'),
    meta: { requiereAuth: false } 
  },

  {
    path: '/contacto',
    name: 'contacto',
    component: () => import('../views/contacto.vue'),
    meta: { requiereAuth: false } 
  },

  {
    path: '/sobrenosotros',
    name: 'sobrenosotros',
    component: () => import('../views/sobrenosotros.vue'),
    meta: { requiereAuth: false } 
  },

  {
    path: '/producto',
    name: 'producto',
    component: () => import('../views/landingpage/producto.vue'),
    meta: { requiereAuth: false } 
  },

  {
    path: '/servicios',
    name: 'servicios',
    component: () => import('../views/landingpage/servicios.vue'),
    meta: { requiereAuth: false } 
  },

  {
    path: '/recursos',
    name: 'recursos',
    component: () => import('../views/landingpage/recursos.vue'),
    meta: { requiereAuth: false } 
  },

   {
    path: '/clientes',
    name: 'clientes',
    component: () => import('../views/clientes.vue'),
    meta: { requiereAuth: false } 
  },


  {
    path: '/ventas',
    name: 'Ventas',
    component: () => import('../views/VentasView.vue'),
    meta: { 
      requiereAuth: true,
      permiso: 'registrar_venta' // Requiere esta funcionalidad específica
    }
  },

  {
    path: '/crear-roles',
    name: 'CrearRoles',
    component: () => import('../views/CrearRolesView.vue'),
    meta: { 
      requiereAuth: true,
      permiso: 'crear_roles' // Tu funcionalidad de la base de datos
    }
  },
  {
    path: '/cajas',
    name: 'Cajas',
    component: () => import('../views/CajasView.vue'),
    meta: { 
      requiereAuth: true,
      permiso: 'abrir_caja'
    }
  },
  {
    path: '/administracion',
    name: 'Administracion',
    component: () => import('../views/AdminView.vue'),
    meta: { 
      requiereAuth: true,
      permiso: 'crear_roles' // Solo perfiles autorizados (eladmin)
    }
  },

  {
    path: '/etiquetas',
    name: 'Etiquetas',
    component: () => import('../views/EtiquetasView.vue'),
    meta: { 
      requiereAuth: true,
      permiso: 'gestionar_etiquetas'  // Solo usuarios con este permiso
    }
  },
  // Ruta de escape por si intentan entrar a un lugar prohibido o inexistente
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})


// 2. Guardia de navegacion (el guardia de seguridad del Router)

router.beforeEach(async (to, from, next) => {
  // Inicializamos la tienda de Pinia dentro del guard
  const authStore = useAuthStore()

  // CASO 1: La ruta requiere autenticación y el usuario no está logueado
  if (to.meta.requiereAuth && !authStore.estaAutenticado) {
    return next({ name: 'landingpage' })
  }

  // CASO 2: El usuario ya está logueado e intenta ir al Login (lo mandamos al inicio)
  if (to.name === 'Login' && authStore.estaAutenticado) {
    return next({ name: 'Dashboard' })
  }

  // CASO 3: La ruta requiere un permiso específico
  if (to.meta.permiso) {
    const tienePermisoNecesario = authStore.tienePermiso(to.meta.permiso)
    
    if (!tienePermisoNecesario) {
      console.warn(`Acceso denegado a ${to.path}. Falta el permiso: ${to.meta.permiso}`)
      return next({ name: 'Dashboard' }) // Lo rebota al panel principal
    }
  }

  // Si pasa todos los filtros, lo dejamos seguir a la pantalla que quería
  next()
})

export default router