// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

// 1. Definimos las rutas de la aplicación
const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/LoginView.vue'), // Se creará luego
    meta: { requiereAuth: false }
  },

  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/RegisterView.vue'), // Se creará luego
    meta: { requiereAuth: false }
  },
  {
    path: '/',
    name: 'Dashboard',
    component: () => import('../views/DashboardView.vue'),
    meta: { requiereAuth: true } // Solo entran logueados
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

  // Agrega esto dentro del array "routes" en src/router/index.js
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
      permiso: 'abrir_caja' // O 'cerrar_caja', según cómo manejes la vista
    }
  },
  {
    path: '/administracion',
    name: 'Administracion',
    component: () => import('../views/AdminView.vue'),
    meta: { 
      requiereAuth: true,
      permiso: 'ver_modulo_admin' // Solo perfiles autorizados (ej: Admin)
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

// =========================================================================
// 2. NAVIGATION GUARD (El guardia de seguridad del Router)
// =========================================================================
router.beforeEach(async (to, from, next) => {
  // Inicializamos la tienda de Pinia dentro del guard
  const authStore = useAuthStore()

  // CASO 1: La ruta requiere autenticación y el usuario NO está logueado
  if (to.meta.requiereAuth && !authStore.estaAutenticado) {
    return next({ name: 'Login' })
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