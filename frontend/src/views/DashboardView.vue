<!-- frontend/src/views/DashboardView.vue -->
<!-- dashboard para acceder slo a ventas por ahora -->
<template>
  <div class="dashboard">
    <h1>Panel de Control - Kairo</h1>
    
    <!-- muestra info basica del vendedor, nombre y apellido. rol y permisos ahora viven en /perfil -->
    <div class="user-info">
      <p>Usuario: {{ authStore.trabajador?.nombre }} {{ authStore.trabajador?.apellido }}</p>
    </div>


    <div class="dashboard-grid">
      <!-- solo admin -->
      <button 
        v-if="authStore.tienePermiso('crear_roles')"
        class="btn-admin"
        @click="navigateTo('/administracion')"
      >
      Panel Admin
      </button>

      <!-- boton quelleva a Ventas -->
      <button 
        class="btn-ventas"
        @click="navigateTo('/ventas')"
      >
       Ventas
      </button>

      <!-- boton que lleva a Cajas -->
      <button 
        class="btn-cajas"
        @click="navigateTo('/cajas')"
      >
       Cajas
      </button>

      <!-- boton que lleva al perfil del usuario (datos, rol, permisos y cambio de contraseña) -->
      <button 
        class="btn-perfil"
        @click="navigateTo('/perfil')"
      >
       Perfil
      </button>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'


//usa router para redirigir a otras paginas y authstore para autenticar usuarios
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

.btn-perfil {
  background: #6c757d;
  color: #fff;
}

.btn-perfil:hover {
  background: #5a6268;
}
</style>