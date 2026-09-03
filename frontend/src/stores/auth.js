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

  // usamos la variable de entorno o localhost 3000 para la url base
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'

  // Guarda la sesión en Pinia + localStorage + header de axios.
  // La usan tanto el login con contraseña como el login con huella:
  // ambos terminan con la misma forma de respuesta del backend
  // ({ token, trabajador, funcionalidades }).
  function guardarSesion(data) {
    token.value = data.token
    trabajador.value = data.trabajador
    funcionalidades.value = data.funcionalidades

    localStorage.setItem('token', data.token)
    localStorage.setItem('trabajador', JSON.stringify(data.trabajador))
    localStorage.setItem('funcionalidades', JSON.stringify(data.funcionalidades))

    axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
  }

  function limpiarSesion() {
    token.value = null
    trabajador.value = null
    funcionalidades.value = []
    localStorage.removeItem('token')
    localStorage.removeItem('trabajador')
    localStorage.removeItem('funcionalidades')
    delete axios.defaults.headers.common['Authorization']
  }

  // iniciar sesión con contraseña 
  async function loginConContrasena(credentials) {
    try {
      //credentials contiene: { nombre: '...', apellido: '...', dni: '...', password: '...' }
      const response = await axios.post(`${baseUrl}/api/auth/login`, credentials)

      guardarSesion(response.data)

      return { success: true } //retorna succes para que se use en la verificaion del login
    } catch (error) {
      console.error('Error en el login:', error)
      
      // si falla, nos aseguramos de limpiar cualquier rastro viejo por seguridad
      limpiarSesion()

      return { 
        success: false, 
        message: error.response?.data?.error || 'Error al conectar con el servidor' 
      }
    }
  }

  // Consulta una sola vez si el lector de huellas (ESP32) identificó a
  // alguien recién. Devuelve true si encontró un login y ya quedó
  // guardada la sesión; false si todavía no hay nada (204 = "esperá").
  // La usa LoginView.vue en un loop mientras el usuario tiene el dedo
  // apoyado en el sensor.
  async function consultarLoginPorHuella() {
    try {
      const response = await axios.get(`${baseUrl}/api/auth/huella/resultado`)

      if (response.status === 200 && response.data?.token) {
        guardarSesion(response.data)
        return true
      }
      return false // 204: todavía no identificó a nadie
    } catch (error) {
      console.error('Error consultando login por huella:', error)
      return false
    }
  }

  // Cerrar sesión y vaciar la tienda
  function logout() {
    limpiarSesion()
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
    consultarLoginPorHuella,
    logout
  }
})

