<!-- frontend/src/views/DashboardView.vue -->
<!-- frontend/src/views/DashboardView.vue -->
<template>
  <div class="dashboard">
    <h1>Panel de Control - Kairo</h1>
    
    <div class="user-info">
      <p>Usuario: {{ authStore.trabajador?.nombre }} {{ authStore.trabajador?.apellido }}</p>
      <p>Rol: {{ authStore.rolActual }}</p>
      <p>Permisos: {{ authStore.funcionalidades.join(', ') || 'Ninguno' }}</p>
    </div>


    <div class="dashboard-grid">
      <!-- SOLO ADMIN VE ESTE BOTÓN -->
      <button 
        v-if="authStore.tienePermiso('crear_roles')"
        class="btn-admin"
        @click="navigateTo('/crear-roles')"
      >
      Crear Roles
      </button>

      <!-- Botón Ventas -->
      <button 
        class="btn-ventas"
        @click="navigateTo('/ventas')"
      >
       Ventas
      </button>

      <!-- Botón Cajas -->
      <button 
        class="btn-cajas"
        @click="navigateTo('/cajas')"
      >
       Cajas
      </button>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const navigateTo = (path) => {
  router.push(path)
}
</script>

<style scoped>
.dashboard {
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
}

h1 {
  font-size: 1.5rem;

}

.user-info {
  background: #f8f9fa;
  padding: 15px 20px;
  border-radius: 8px;
  margin-bottom: 30px;
  border: 1px solid #dee2e6;
}

.user-info p {
  margin: 5px 0;
}

.dashboard-grid {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

button {
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  font-size: 1.2rem;
  cursor: pointer;
}

button:hover {
  transform: scale(1.01);
}

.btn-admin {
  background: #ffc107;
  color: #212529;
  border: 2px solid #ffc107;
}

.btn-admin:hover {
  background: #e0a800;
}

.btn-ventas {
  background: #4CAF50;
  color: #212529;
}

.btn-ventas:hover {
  background: #45a049;
}

.btn-cajas {
  background: #2196F3;
  color: #212529;
}

.btn-cajas:hover {
  background: #1976D2;
}
</style>