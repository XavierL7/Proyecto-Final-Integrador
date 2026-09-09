// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import axios from 'axios'

// router/index.js sirve para definir las rutas de la aplicación
const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/LoginView.vue'), 
    meta: { requiereAuth: false }
  },


  {
    path: '/contacto',
    name: 'Contacto',
    component: () => import('../views/contacto.vue'), 
    meta: { requiereAuth: false }
  },
    {
    path: '/sobrenosotros',
    name: 'SobreNosotros',
    component: () => import('../views/sobrenosotros.vue'), 
    meta: { requiereAuth: false }
  },

  {
    path: '/clientes',
    name: 'clientes',
    component: () => import('../views/clientes.vue'), 
    meta: { requiereAuth: false }
  },
  {
    path: '/stock',
    name: 'Stock',
    component: () => import('../views/StockView.vue'),
    meta: { 
      requiereAuth: true,
      permiso: 'Ver_Stock'
    }
  },


  { 
    path: '/asistencias', 
    name: 'Asistencias', 
    component: () => import('../views/AsistenciasView.vue'), 
    meta: { 
      requiresAuth: true, 
      permiso: 'Ver_Historial_Trabajadores' 
    } 
  },
  
  {
    path: '/descuentos',
    name: 'Descuentos',
    component: () => import('../views/DescuentosView.vue'),
    meta: {
      requiereAuth: true,
      permiso: 'Ver_Descuentos'
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
    path: '/ventas',
    name: 'Ventas',
    component: () => import('../views/VentasView.vue'),
    meta: { 
      requiereAuth: true,
      permiso: 'Ver_Ventas', // antes: 'registrar_venta'
      requiereCajaAbierta: true // No se puede vender sin haber abierto una caja antes
    }
  },

  {
    path: '/historial',
    name: 'HistorialVentas',
    component: () => import('../views/HistorialVentasView.vue'),
    meta: {
      requiereAuth: true,
      permiso: 'Ver_Historial_Ventas' // antes: 'ver_reportes'
    }
  },

  {
    path: '/crear-roles',
    name: 'CrearRoles',
    component: () => import('../views/CrearRolesView.vue'),
    meta: { 
      requiereAuth: true,
      permiso: 'Ver_Roles' // antes: 'crear_roles'
    }
  },
  {
    path: '/cajas',
    name: 'Cajas',
    component: () => import('../views/CajasView.vue'),
    meta: { 
      requiereAuth: true,
      permiso: 'Ver_Cajas' // antes: 'abrir_caja'
    }
  },
  {
    path: '/administracion',
    name: 'Administracion',
    component: () => import('../views/AdminView.vue'),
    meta: { 
      requiereAuth: true,
      // La página tiene pestañas de Roles, Trabajadores y (más adelante)
      // Configuración: entra si tiene el permiso de VER cualquiera de
      // ellas. Cada pestaña adentro debe ocultarse sola según cuál de
      // estos permisos tenga realmente (eso se hace en AdminView.vue).
      permiso: ['Ver_Roles', 'Ver_Trabajadores', 'Ver_configuracion']
    }
  },

  {
    path: '/etiquetas',
    name: 'Etiquetas',
    component: () => import('../views/EtiquetasView.vue'),
    meta: { 
      requiereAuth: true,
      permiso: 'Ver_Etiquetas' // antes: 'gestionar_etiquetas'
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

  // CASO 3: La ruta requiere un permiso específico.
  // meta.permiso puede ser un string ("necesito ESTE") o un array
  // (["A","B"] = "necesito CUALQUIERA de estos"), para páginas con
  // varias pestañas que se habilitan con distintos permisos.
  if (to.meta.permiso) {
    const permisosNecesarios = Array.isArray(to.meta.permiso) ? to.meta.permiso : [to.meta.permiso]
    const tienePermisoNecesario = permisosNecesarios.some(p => authStore.tienePermiso(p))

    if (!tienePermisoNecesario) {
      console.warn(`Acceso denegado a ${to.path}. Falta alguno de: ${permisosNecesarios.join(', ')}`)
      return next({ name: 'Dashboard' }) // Lo rebota al panel principal
    }
  }

  // CASO 4: La ruta (ej. /ventas) requiere que este trabajador tenga una
  // caja abierta. Si no tiene, no lo dejamos vender: lo mandamos a /cajas
  // para que abra una o vea la que ya tiene abierta.
  if (to.meta.requiereCajaAbierta) {
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'
    try {
      const response = await axios.get(`${baseUrl}/api/cajas/activa`, {
        headers: { 'Authorization': `Bearer ${authStore.token}` }
      })

      if (!response.data) {
        // null = no tiene ninguna caja abierta
        return next({ name: 'Cajas', query: { motivo: 'necesita-caja' } })
      }
    } catch (error) {
      console.error('No se pudo verificar la caja activa:', error)
      // Si falla la verificación (ej. backend caído), preferimos no dejar
      // vender a ciegas: lo mandamos igual a /cajas.
      return next({ name: 'Cajas', query: { motivo: 'error-verificacion' } })
    }
  }

  // Si pasa todos los filtros, lo dejamos seguir a la pantalla que quería
  next()
})

export default router
