// src/main.js
import { createApp } from 'vue'
import { createPinia } from 'pinia' //Importamos Pinia
import App from './App.vue' //importa app.vue
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
      console.warn('⚠️ Sesión expirada. Redirigiendo al login...')
      
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
const app = createApp(App)// Crea Vue con App.vue como raíz│

// 2. ¡CRUCIAL! Instanciar y registrar Pinia PRIMERO
const pinia = createPinia()
app.use(pinia)

// 3. Registrar el Router SEGUNDO 
// Ahora cuando el router use "useAuthStore()" en sus guards, Pinia ya va a estar activo.
app.use(router)

app.mount('#app')  // pega App.vue en el <div> id = app del index