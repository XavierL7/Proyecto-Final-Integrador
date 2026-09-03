<!-- frontend/src/App.vue -->
<template>
  <div id="app" class="flex min-h-screen">
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
        Se quita el p-6 si NO está autenticado para que la landing
        pueda ocupar el 100% del ancho y alto sin márgenes internos.
      -->
      <main 
        :class="[
          authStore.estaAutenticado ? 'p-6' : 'p-0 auth-page'
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
