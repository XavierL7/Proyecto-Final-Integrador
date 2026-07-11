<!--registro del usuario -->
<template>
  <div class="register-container">
    <div class="register-card">
      <h2>Registrar Nuevo Trabajador - Kairo</h2>

        <!-- campo del registro que pide que pongas un nombre requerido -->
      <form @submit.prevent="handleRegister">
        <div class="form-group">
          <label>Nombre:</label>
          <input 
            type="text" 
            v-model="trabajador.nombre" 
            placeholder="Ej: Juan"
            required 
          />
        </div>

        <!-- campo del registro que pide que pongas un apellido requerido -->
        <div class="form-group">
          <label>Apellido:</label>
          <input 
            type="text" 
            v-model="trabajador.apellido" 
            placeholder="Ej: Pérez"
            required 
          />
        </div>

        <!-- campo del registro que pide que pongas un dni requerido -->
        <div class="form-group">
          <label>DNI:</label>
          <input 
            type="number" 
            v-model="trabajador.dni" 
            placeholder="Ej: 12345678"
            required 
          />
        </div>

        <!-- campo del registro que pide que pongas una contraseña requerida de 6 caracteres minimo -->
        <div class="form-group">
          <label>Contraseña:</label>
          <input 
            type="password" 
            v-model="trabajador.password" 
            placeholder="Mínimo 6 caracteres"
            required 
            minlength="6" 
          />
        </div>

        <!-- boton que muestra Guardar en Base de Datos y que cambiando a Guardando cuando ya se clickeo -->
        <button type="submit" :disabled="cargando">
          {{ cargando ? 'Guardando...' : 'Guardar en Base de Datos' }}
        </button>

        <!--boton que redirige a login -->
        <div class="login-link">
          <p>¿Ya tienes cuenta? <router-link to="/login">Inicia sesión aquí</router-link></p>
        </div>
      </form>

      <div v-if="mensaje" :class="['mensaje', tipoMensaje]"> <!-- //mensaje que devuelveel backend despues del envio -->
        {{ mensaje }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const cargando = ref(false)
const mensaje = ref('')
const tipoMensaje = ref('')

const trabajador = ref({
  nombre: '',
  apellido: '',
  dni: '',        
  password: ''
})

const handleRegister = async () => {
  mensaje.value = ''
  tipoMensaje.value = ''
  cargando.value = true

  try {
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'
    
    // envia los datos escritos al backend
    const response = await axios.post(`${baseUrl}/api/auth/register`, {
      nombre: trabajador.value.nombre,
      apellido: trabajador.value.apellido,
      dni: trabajador.value.dni,     
      password: trabajador.value.password
    })

    // si el bakend responde succes el mensaje devuelve el mensaje de logro del backend y se clasifica como 'exito'
    if (response.data.success) {
      mensaje.value = response.data.message
      tipoMensaje.value = 'exito'

      //luego vacia los datos de trabajdor para esperar a un nuevo registro
      trabajador.value = { nombre: '', apellido: '', dni: '', password: '' }
      
      //y pasado dos segundos devuleve al login
      setTimeout(() => {
        router.push('/login')
      }, 2000)
    }

    // sino hubo respuesta positiva del bakend devuelve mensaje de error
  } catch (error) {
    console.error('Error en registro:', error)
    mensaje.value = error.response?.data?.error || 'Error al conectar con el servidor'
    tipoMensaje.value = 'error'
  } finally {
    cargando.value = false //encargado de habilitar y deshabilitar el boton al darle a Guardar en la Base de datos
  }
}
</script>