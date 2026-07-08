<!-- frontend/src/App.vue -->
<template>
  <div id="app"">
    <!-- Header SOLO si está autenticado -->
    <Header />
    
    <!-- Contenido principal -->
    <main :class="{ 'auth-page': !authStore.estaAutenticado }">
      <router-view />
    </main>

  </div>
</template>

<script setup>
import { useAuthStore } from './stores/auth'
import Header from './components/Header.vue'

const authStore = useAuthStore()
//wifi manager
</script>

<style>
@import "./assets/main.css"; 
</style>