<template>
  <div id="app">
    <nav>
      <router-link :to="{ name: 'Dashboard' }">Inicio</router-link> | 
      <router-link :to="{ name: 'Login' }">Iniciar Sesión</router-link> |
      <router-link :to="{ name: 'Register' }">Registrarse</router-link>
    </nav>

    <main>
      <RouterView />
    </main>
  </div>
</template>

<style>
/* Unos estilos básicos para que no se vea todo amontonado */
nav {
  padding: 20px;
  text-align: center;
}
main {
  padding: 20px;
}
</style>