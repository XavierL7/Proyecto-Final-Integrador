// src/main.js
import { createApp } from 'vue'
import { createPinia } from 'pinia' // Importamos Pinia
import App from './App.vue' // Importa app.vue
import router from './router' // Importamos tu router index.js
import './assets/main.css'
import axios from 'axios'


axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

axios.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      // El token expiró o es inválido
      console.warn('Sesión expirada. Redirigiendo al login...')
      
      // Limpiar localStorage
      localStorage.removeItem('token')
      localStorage.removeItem('trabajador')
      localStorage.removeItem('funcionalidades')
      
      // Redirigir al login
      router.push('/login')
    }
    return Promise.reject(error)
  }
)

import { useThemeStore } from './stores/theme'
const app = createApp(App) // Crea Vue con App.vue como raíz

// 1. Instanciar y registrar Pinia
const pinia = createPinia()
app.use(pinia)

// 2. Inicializar el tema oscuro/claro (debe ser después de app.use(pinia))
const themeStore = useThemeStore()
themeStore.inicializarTema()

// 3. Registrar el Router
app.use(router)

app.mount('#app') // Pega App.vue en el <div id="app"> del index
