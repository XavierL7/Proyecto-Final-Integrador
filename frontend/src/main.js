// src/main.js
import { createApp } from 'vue'
import { createPinia } from 'pinia' // 1. Importamos Pinia
import App from './App.vue'
import router from './router' // Importamos tu router index.js

const app = createApp(App)

// 2. ¡CRUCIAL! Instanciar y registrar Pinia PRIMERO
const pinia = createPinia()
app.use(pinia)

// 3. Registrar el Router SEGUNDO 
// Ahora cuando el router use "useAuthStore()" en sus guards, Pinia ya va a estar activo.
app.use(router)

app.mount('#app')