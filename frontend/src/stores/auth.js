// src/stores/auth.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue' //ref crea datos reactivos (que se actualizan automáticamente) y computed	crea datos calculados (que dependen de otros datos
import axios from 'axios'



//este es el el archivo encargado de: guardar los datos del usuario logueado, recordar la sesión (con localStorage)
// verificar permisos e iniciar y cerrar sesión en el frontend


export const useAuthStore = defineStore('auth', () => {

  // 1 STATE (Los datos que se guardan)      
    const trabajador = ref(JSON.parse(localStorage.getItem('trabajador')) || null) //datos del trabajdor (nombre, apellido, etc.)
    const token = ref(localStorage.getItem('token') || null) //JWT
    const funcionalidades = ref(JSON.parse(localStorage.getItem('funcionalidades')) || []) //funcionalidades del trabjador

    //2  GETTERS (Datos calculados)      
    const estaAutenticado = computed(() => !!token.value && !!trabajador.value) //true solo si hay token y trabajador
    // Devuelve el nombre del rol del trabajador actual
    const rolActual = computed(() => trabajador.value?.rol?.nombre_rol || null)
    // Pregunta por los permisos del trabjador
    function tienePermiso(permisoRequerido) {
      return funcionalidades.value.includes(permisoRequerido)
    }
  // 3 ACTIONS (Funciones que modifican el estado o realizan operaciones asincronas)    
  
  // iniciar sesión con contraseña 
  async function loginConContrasena(credentials) {
    try {
      // usamos la variable de entorno o localhost 3000 para la urlbase
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000' 
      
      //credentials contiene: { nombre: '...', apellido: '...', password: '...' }
      const response = await axios.post(`${baseUrl}/api/auth/login`, credentials)
      
      // Guardamos la información en el estado de Pinia
      token.value = response.data.token //token.value = el token del que hizo el login
      trabajador.value = response.data.trabajador //trabjador.value = el nombre, apellido, dni y contrasela del que hizo ellogin
      funcionalidades.value = response.data.funcionalidades // funcionalidades.value son las funciones que puede hacer ese usuario

      // persistencia de la sesión
      localStorage.setItem('token', response.data.token)
      
      // configura Axios para que automáticamente incluya el token en todas las peticiones HTTP que se hagan al backend.
      //sino tendria que poner 'Authorization': `Bearer ${token}` en cada peticion
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`
      
      return { success: true } //retorna succes para que se use en la verificaion del login
    } catch (error) {
      console.error('Error en el login:', error)
      
      // si falla, nos aseguramos de limpiar cualquier rastro viejo por seguridad
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
    logout
  }
})