<template>
  <div>
    <h1>Panel de Control - Proyecto Kairo</h1>

    <button @click="cerrarSesion">Cerrar Sesión</button>
    

    <div v-if="authStore.trabajador?.rol?.nombre_rol === 'admin'">
      <button @click="irACrearRoles">Crear Roles</button>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth' // Importamos tu tienda de Pinia

const items = ref([])
const router = useRouter()
const authStore = useAuthStore() // Instanciamos la tienda

const cargarDatos = async () => {
  try {
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'
    const token = localStorage.getItem('token')

    const response = await fetch(`${baseUrl}/api/dashboard/datos`, {
      headers: { 
        'Authorization': `Bearer ${token}`
      }
    })
    items.value = await response.json()
  } catch (error) {
    console.error("Error cargando el panel:", error)
  }
}

// FUNCIÓN PARA CERRAR SESIÓN
const cerrarSesion = () => {
  // Limpiamos los estados de Pinia
  authStore.token = null
  authStore.trabajador = null
  authStore.funcionalidades = []

  // Limpiamos el almacenamiento del navegador
  localStorage.removeItem('token')
  
  // Lo mandamos de patitas a la pantalla de Login
  router.push({ name: 'Login' })
}

// FUNCIÓN PARA IR A LA VISTA DE CREAR ROLES
const irACrearRoles = () => {
  // Te redirige a la vista correspondiente. 
  // Asegurate de que en tu router/index.js la ruta tenga name: 'CrearRoles'
  router.push({ name: 'CrearRoles' })
}

onMounted(() => {
  cargarDatos()
})
</script>