// src/main.js
import { createApp } from 'vue'
import { createPinia } from 'pinia' //Importamos Pinia
import App from './App.vue' //importa app.vue
import router from './router' // Importamos tu router index.js
import './assets/main.css'

const app = createApp(App)// Crea Vue con App.vue como raíz│

// 2. ¡CRUCIAL! Instanciar y registrar Pinia PRIMERO
const pinia = createPinia()
app.use(pinia)

// 3. Registrar el Router SEGUNDO 
// Ahora cuando el router use "useAuthStore()" en sus guards, Pinia ya va a estar activo.
app.use(router)

app.mount('#app')  // pega App.vue en el <div> id = app del index