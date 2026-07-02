<!-- frontend/src/views/RegisterView.vue -->
<template>
  <div class="register-container">
    <div class="register-card">
      <h2>Registrar Nuevo Trabajador - Kairo</h2>
      
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

        <div class="form-group">
          <label>Apellido:</label>
          <input 
            type="text" 
            v-model="trabajador.apellido" 
            placeholder="Ej: Pérez"
            required 
          />
        </div>

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

        <!-- Campo oculto: siempre será 2 -->
        <input type="hidden" :value="2" />

        <button type="submit" :disabled="cargando">
          {{ cargando ? 'Guardando...' : 'Guardar en Base de Datos' }}
        </button>

        <!-- Enlace para volver al login -->
        <div class="login-link">
          <p>¿Ya tienes cuenta? <router-link to="/login">Inicia sesión aquí</router-link></p>
        </div>
      </form>

      <!-- Mensaje de éxito/error -->
      <div v-if="mensaje" :class="['mensaje', tipoMensaje]">
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

// Datos del formulario (SOLO lo que necesita el backend)
const trabajador = ref({
  nombre: '',
  apellido: '',
  password: ''
})

const handleRegister = async () => {
  // Limpiar mensajes anteriores
  mensaje.value = ''
  tipoMensaje.value = ''
  cargando.value = true

  try {
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'
    
    // Enviar SOLO los campos que necesita el backend
    const response = await axios.post(`${baseUrl}/api/auth/register`, {
      nombre: trabajador.value.nombre,
      apellido: trabajador.value.apellido,
      password: trabajador.value.password

    })

    if (response.data.success) {
      mensaje.value = response.data.message
      tipoMensaje.value = 'exito'
      
      // Resetear el formulario
      trabajador.value = { 
        nombre: '', 
        apellido: '', 
        password: '' 
      }
      
      // Redirigir al login después de 2 segundos
      setTimeout(() => {
        router.push('/login')
      }, 2000)
    }
  } catch (error) {
    console.error('Error en registro:', error)
    mensaje.value = (error.response?.data?.error || 'Error al conectar con el servidor')
    tipoMensaje.value = 'error'
  } finally {
    cargando.value = false
  }
}
</script>

