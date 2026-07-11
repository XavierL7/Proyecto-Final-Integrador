<!-- frontend/src/components/Header.vue -->
<template>
  <!-- muestra el encabezado de todas las paginas -->
  <header class="header">
    <nav class="nav">
      <div class="nav-left">
        <router-link to="/" class="brand">Kairo</router-link>
      </div>
      
      <div class="nav-center">
        <!-- Enlaces visibles para todos los autenticados -->
        <template v-if="authStore.estaAutenticado">
          <router-link to="/dashboard" class="nav-link">Dashboard</router-link>
          
          <!-- Enlaces con permisos -->
          <router-link 
            v-if="authStore.tienePermiso('dashboard_ventas')" 
            to="/ventas" 
            class="nav-link"
          >
            Ventas
          </router-link>
        </template>
        
        <!-- Enlaces para NO autenticados -->
        <template v-else>
          <router-link to="/login" class="nav-link">Iniciar Sesión</router-link>
          <router-link to="/register" class="nav-link">Registrarse</router-link>
        </template>
      </div>
      
      <!-- si el usuario esta autenticando muestra nombre, apellido y rol junto a un boton para cerrar sesion -->
      <div class="nav-right" v-if="authStore.estaAutenticado">
        <span class="user-info">
           {{ authStore.trabajador?.nombre }} {{ authStore.trabajador?.apellido }}
          <span class="role-badge">{{ authStore.rolActual }}</span>
        </span>
        <button @click="cerrarSesion" class="logout-btn">
          Cerrar Sesión
        </button>
      </div>
    </nav>
  </header>
</template>

<script setup> //setup significa que el código se ejecuta antes de renderizar

import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore() //llama authstore de pinia
const router = useRouter() //llama a router

// funcion para cerrar la sesion
const cerrarSesion = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.header {
  background: #021120;
  color: white;
  padding: 0 20px;
}

.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 64px;
}

.nav-left, .nav-center, .nav-right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.brand {
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
}

.brand:hover {
  opacity: 0.8;
}

.nav-link {
  color: rgba(255,255,255,0.8);
  text-decoration: none;
  padding: 8px 16px;
  border-radius: 6px;
  transition: all 0.3s;
}

.nav-link:hover {
  background: rgba(255,255,255,0.1);
  color: white;
}


.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.9rem;
  color: rgba(255,255,255,0.8);
}

.role-badge {
  background: #4CAF50;
  color: white;
  padding: 2px 10px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: bold;
}

.logout-btn {
  background: #e74c3c;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.3s;
  font-weight: bold;
}

.logout-btn:hover {
  background: #c0392b;
}
</style>