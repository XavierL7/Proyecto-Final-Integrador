<!-- frontend/src/App.vue -->
 <!-- las paginas .vue realmente se ejecutan aca adentro, mas especificamente dentro de router-view -->
<template>
  <div id="app">
    <!-- carga el componente header que se importa en script -->
    <Header />
    
    <!-- aca se van a cargar las otras paginas view -->
    <!-- Si el usuario no está autenticado, ponle la clase auth-page al <main>, esto se hace para mostrar diferentes estilos en el login/regster-->
    <main :class="{ 'auth-page': !authStore.estaAutenticado }"> 
      <router-view />
    </main>

  </div>
</template>

<script setup> //setup significa que el código se ejecuta antes de renderizar
import { useAuthStore } from './stores/auth' // importa el store de autenticación de Pinia


import Header from './components/Header.vue' //este es el header

const authStore = useAuthStore() //gracia a esto puedo usar authStore.estaAutenticado en el template
</script>

<style>
@import "./assets/main.css"; /*llamma estilos  */
</style>