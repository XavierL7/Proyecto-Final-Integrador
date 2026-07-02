<!-- frontend/src/App.vue -->
<template>
  <div id="app">
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
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  font-family: 'Segoe UI', Arial, sans-serif;
  min-height: 100vh;
  background: #f0f2f5;
}

main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

/*
 main.auth-page {
  max-width: 100%;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
*/

</style>