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

        <!-- 👇 NUEVO CAMPO DNI -->
        <div class="form-group">
          <label>DNI:</label>
          <input 
            type="number" 
            v-model="trabajador.dni" 
            placeholder="Ej: 12345678"
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

        <button type="submit" :disabled="cargando">
          {{ cargando ? 'Guardando...' : 'Guardar en Base de Datos' }}
        </button>

        <div class="login-link">
          <p>¿Ya tienes cuenta? <router-link to="/login">Inicia sesión aquí</router-link></p>
        </div>
      </form>

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

const trabajador = ref({
  nombre: '',
  apellido: '',
  dni: '',        // 👈 NUEVO
  password: ''
})

const handleRegister = async () => {
  mensaje.value = ''
  tipoMensaje.value = ''
  cargando.value = true

  try {
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'
    
    // 👇 Enviar DNI al backend
    const response = await axios.post(`${baseUrl}/api/auth/register`, {
      nombre: trabajador.value.nombre,
      apellido: trabajador.value.apellido,
      dni: trabajador.value.dni,      // 👈 NUEVO
      password: trabajador.value.password
    })

    if (response.data.success) {
      mensaje.value = response.data.message
      tipoMensaje.value = 'exito'
      
      trabajador.value = { nombre: '', apellido: '', dni: '', password: '' }
      
      setTimeout(() => {
        router.push('/login')
      }, 2000)
    }
  } catch (error) {
    console.error('Error en registro:', error)
    mensaje.value = error.response?.data?.error || 'Error al conectar con el servidor'
    tipoMensaje.value = 'error'
  } finally {
    cargando.value = false
  }
}
</script>