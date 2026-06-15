// src/stores/auth.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

export const useAuthStore = defineStore('auth', () => {
  // =========================================================================
  // 1. STATE (Los estantes del almacén)
  // =========================================================================
// Modificá solo la parte del STATE al inicio de tu src/stores/auth.js:
    const trabajador = ref(JSON.parse(localStorage.getItem('trabajador')) || null)
    const token = ref(localStorage.getItem('token') || null)
    const funcionalidades = ref(JSON.parse(localStorage.getItem('funcionalidades')) || [])

    // =========================================================================
    // 2. GETTERS (Los mostradores de exhibición rápida)
    // =========================================================================
    const estaAutenticado = computed(() => !!token.value && !!trabajador.value)

    // Devuelve el nombre del rol del trabajador actual
    const rolActual = computed(() => trabajador.value?.rol?.nombre_rol || null)

    // Cambiamos el computed por una FUNCIÓN plana (Action) para que el router lo entienda directo:
    function tienePermiso(permisoRequerido) {
      return funcionalidades.value.includes(permisoRequerido)
    }
  // =========================================================================
  // 3. ACTIONS (Los encargados de hacer el trabajo pesado)
  // =========================================================================
  
  // Iniciar sesión con contraseña tradicional
  async function loginConContrasena(credentials) {
    try {
      // Usamos tu variable de entorno o cae en el puerto 3000 por defecto
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'
      
      //credentials contiene: { nombre: '...', apellido: '...', password: '...' }
      const response = await axios.post(`${baseUrl}/api/auth/login`, credentials)
      
      // Guardamos la información en el estado de Pinia
      token.value = response.data.token
      trabajador.value = response.data.trabajador
      funcionalidades.value = response.data.funcionalidades

      // Persistencia de la sesión
      localStorage.setItem('token', response.data.token)
      
      // Seteamos el token para todas las futuras peticiones de Axios
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`
      
      return { success: true }
    } catch (error) {
      console.error('Error en el login:', error)
      
      // Si falla, nos aseguramos de limpiar cualquier rastro viejo por seguridad
      token.value = null
      trabajador.value = null
      funcionalidades.value = []
      localStorage.removeItem('token')
      delete axios.defaults.headers.common['Authorization']

      return { 
        success: false, 
        message: error.response?.data?.error || 'Error al conectar con el servidor' 
      }
    }
  }

  // Iniciar sesión mediante huella biométrica (Modo sesión inicial)
  async function loginConHuella(hashHuella) {
    try {
      const response = await axios.post('http://localhost:3000/api/auth/login-huella', { hash_huella: hashHuella })
      
      token.value = response.data.token
      trabajador.value = response.data.trabajador
      funcionalidades.value = response.data.funcionalidades

      localStorage.setItem('token', response.data.token)
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`
      
      return { success: true }
    } catch (error) {
      console.error('Error en el login biométrico:', error)
      return { 
        success: false, 
        message: error.response?.data?.error || 'Huella no reconocida' 
      }
    }
  }

  // Cerrar sesión y vaciar la tienda
    function logout() {
    trabajador.value = null
    token.value = null
    funcionalidades.value = []
    localStorage.removeItem('token')
    localStorage.removeItem('trabajador')
    localStorage.removeItem('funcionalidades')
    }
  // Retornamos todo para que pueda ser usado en los componentes de Vue
  return {
    trabajador,
    token,
    funcionalidades,
    estaAutenticado,
    rolActual,
    tienePermiso,
    loginConContrasena,
    loginConHuella,
    logout
  }
})