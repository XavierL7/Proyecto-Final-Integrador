<template>
  <div class="register-container">
    <h2>Registrar Nuevo Trabajador - Kairo</h2>
    <form @submit.prevent="handleRegister">
      
      <div class="form-group">
        <label>Nombre:</label>
        <input type="text" v-model="trabajador.nombre" required />
      </div>

      <div class="form-group">
        <label>Apellido:</label>
        <input type="text" v-model="trabajador.apellido" required />
      </div>

      <div class="form-group">
        <label>Contraseña:</label>
        <input type="password" v-model="trabajador.password" required />
      </div>

      <div class="form-group">
        <label>Límite de Retiro Diario ($):</label>
        <input type="number" step="0.01" v-model="trabajador.limite_retiro_diario" required />
      </div>

      <button type="submit">Guardar en Base de Datos</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

const trabajador = ref({
  nombre: '',
  apellido: '',
  email: '',
  password: '',
  limite_retiro_diario: 50000.00
})

const handleRegister = async () => {
  try {
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'
    
    // Mandamos los datos estructurados. El rol va forzado directamente como 2.
    const response = await axios.post(`${baseUrl}/api/auth/register`, {
      nombre: trabajador.value.nombre,
      apellido: trabajador.value.apellido,
      password: trabajador.value.password,
      id_role: 2, // Fijo, sin vueltas
      limite_retiro: trabajador.value.limite_retiro_diario
    })

    if (response.data.success) {
      alert(response.data.message)
      // Resetear el formulario
      trabajador.value = { nombre: '', apellido: '', email: '', password: '', limite_retiro_diario: 50000.00 }
    }
  } catch (error) {
    alert(error.response?.data?.error || 'Error al conectar con Express')
  }
}
</script>

