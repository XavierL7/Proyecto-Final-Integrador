<!-- frontend/src/App.vue -->
<template>
  <div id="app" class="flex min-h-screen bg-gray-50">
    <!-- Sidebar - SOLO si está autenticado -->
    <Sidebar v-if="authStore.estaAutenticado" />

    <!-- Contenido principal -->
    <div
      :class="[
        'flex-1 transition-all duration-300',
        authStore.estaAutenticado ? 'ml-20 md:ml-64' : 'ml-0'
      ]"
    >
      <!-- 
        ACA VA EL CONTENIDO DE LA PÁGINA (Login, Register, Dashboard, etc.)
      -->
      <main 
        :class="[
          'p-6',
          !authStore.estaAutenticado ? 'auth-page' : ''
        ]"
      >
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from './stores/auth'
import Sidebar from './components/Sidebar.vue'

const authStore = useAuthStore()
</script>

<style>
@import "./assets/main.css";

</style>