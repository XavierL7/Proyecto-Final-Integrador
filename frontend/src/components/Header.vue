<!-- frontend/src/components/Header.vue -->
<template>
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
          
          <router-link 
            v-if="authStore.tienePermiso('gestionar_trabajadores')"
            to="/admin" 
            class="nav-link admin-link"
          >
            Admin
          </router-link>
        </template>
        
        <!-- Enlaces para NO autenticados -->
        <template v-else>
          <router-link to="/login" class="nav-link">Iniciar Sesión</router-link>
          <router-link to="/register" class="nav-link">Registrarse</router-link>
        </template>
      </div>
      
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

<script setup>
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const cerrarSesion = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
.header {
  background: #2c3e50;
  color: white;
  padding: 0 20px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.2);
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
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
  text-decoration: none;
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

.nav-link.router-link-active {
  background: rgba(255,255,255,0.15);
  color: white;
}

.admin-link {
  border: 1px solid #ffc107;
  color: #ffc107;
}

.admin-link:hover {
  background: #ffc107;
  color: #2c3e50;
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