<!-- frontend/src/components/Sidebar.vue -->
<template>
  <aside
    :class="[
      'fixed top-0 left-0 z-50 h-screen transition-all duration-300 ease-in-out',
      'border-r shadow-lg',
      isOpen ? 'w-64' : 'w-20'
    ]"
    style="background-color: #021120; border-color: #0a2a40;"
  >
    <!-- LOGO -->
    <div 
      class="flex items-center justify-center h-20 border-b"
      style="border-color: #0a2a40;"
    >
      <img
        v-if="isOpen"
        src="/src/assets/logo.png"
        alt="Logo Kairo"
        class="h-12 w-auto object-contain"
      />
      <img
        v-else
        src="/src/assets/logo.png"
        alt="Logo Kairo"
        class="h-10 w-10 object-contain"
      />
    </div>

    <!-- Botón toggle -->
    <button
      @click="toggleSidebar"
      class="absolute -right-3 top-20 border rounded-full p-1.5 shadow-md transition-colors"
      style="background-color: #021120; border-color: #0a2a40;"
    >
      <svg v-if="isOpen" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" style="color: #4a8db7;">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
      </svg>
      <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" style="color: #4a8db7;">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </button>

    <!-- MENÚ -->
    <nav class="p-4 space-y-1 overflow-y-auto h-[calc(100vh-80px)]">
      
      <!-- DASHBOARD -->
      <router-link
        to="/"
        class="flex items-center px-4 py-3 rounded-lg transition-all duration-200"
        :class="[isOpen ? 'justify-start' : 'justify-center']"
        :style="{
          color: $route.path === '/' ? '#4a8db7' : '#8ab4d6',
          backgroundColor: $route.path === '/' ? 'rgba(74, 141, 183, 0.15)' : 'transparent'
        }"
        @mouseenter="(e) => {
          if ($route.path !== '/') {
            e.currentTarget.style.backgroundColor = 'rgba(74, 141, 183, 0.08)'
            e.currentTarget.style.color = '#6aaec9'
          }
        }"
        @mouseleave="(e) => {
          if ($route.path !== '/') {
            e.currentTarget.style.backgroundColor = 'transparent'
            e.currentTarget.style.color = '#8ab4d6'
          }
        }"
      >
        <span v-if="isOpen" class="text-sm font-medium whitespace-nowrap">Dashboard</span>
        <span v-else class="text-sm font-medium">D</span>
      </router-link>

      <!-- VENTAS -->
      <router-link
        v-if="authStore.tienePermiso('dashboard_ventas')"
        to="/ventas"
        class="flex items-center px-4 py-3 rounded-lg transition-all duration-200"
        :class="[isOpen ? 'justify-start' : 'justify-center']"
        :style="{
          color: $route.path === '/ventas' ? '#4a8db7' : '#8ab4d6',
          backgroundColor: $route.path === '/ventas' ? 'rgba(74, 141, 183, 0.15)' : 'transparent'
        }"
        @mouseenter="(e) => {
          if ($route.path !== '/ventas') {
            e.currentTarget.style.backgroundColor = 'rgba(74, 141, 183, 0.08)'
            e.currentTarget.style.color = '#6aaec9'
          }
        }"
        @mouseleave="(e) => {
          if ($route.path !== '/ventas') {
            e.currentTarget.style.backgroundColor = 'transparent'
            e.currentTarget.style.color = '#8ab4d6'
          }
        }"
      >
        <span v-if="isOpen" class="text-sm font-medium whitespace-nowrap">Ventas</span>
        <span v-else class="text-sm font-medium">V</span>
      </router-link>

      <!-- STOCK -->
      <router-link
        v-if="authStore.tienePermiso('gestionar_productos')"
        to="/stock"
        class="flex items-center px-4 py-3 rounded-lg transition-all duration-200"
        :class="[isOpen ? 'justify-start' : 'justify-center']"
        :style="{
          color: $route.path === '/stock' ? '#4a8db7' : '#8ab4d6',
          backgroundColor: $route.path === '/stock' ? 'rgba(74, 141, 183, 0.15)' : 'transparent'
        }"
        @mouseenter="(e) => {
          if ($route.path !== '/stock') {
            e.currentTarget.style.backgroundColor = 'rgba(74, 141, 183, 0.08)'
            e.currentTarget.style.color = '#6aaec9'
          }
        }"
        @mouseleave="(e) => {
          if ($route.path !== '/stock') {
            e.currentTarget.style.backgroundColor = 'transparent'
            e.currentTarget.style.color = '#8ab4d6'
          }
        }"
      >
        <span v-if="isOpen" class="text-sm font-medium whitespace-nowrap">Stock</span>
        <span v-else class="text-sm font-medium">S</span>
      </router-link>


      <!-- ============================================================ -->
      <!-- DESCUENTOS -->
      <!-- ============================================================ -->
      <router-link
        v-if="authStore.tienePermiso('gestionar_productos')"
        to="/descuentos"
        class="flex items-center px-4 py-3 rounded-lg transition-all duration-200"
        :class="[isOpen ? 'justify-start' : 'justify-center']"
        :style="{
          color: $route.path === '/descuentos' ? '#4a8db7' : '#8ab4d6',
          backgroundColor: $route.path === '/descuentos' ? 'rgba(74, 141, 183, 0.15)' : 'transparent'
        }"
        @mouseenter="(e) => {
          if ($route.path !== '/descuentos') {
            e.currentTarget.style.backgroundColor = 'rgba(74, 141, 183, 0.08)'
            e.currentTarget.style.color = '#6aaec9'
          }
        }"
        @mouseleave="(e) => {
          if ($route.path !== '/descuentos') {
            e.currentTarget.style.backgroundColor = 'transparent'
            e.currentTarget.style.color = '#8ab4d6'
          }
        }"
      >
        <span v-if="isOpen" class="text-sm font-medium whitespace-nowrap">Descuentos</span>
        <span v-else class="text-sm font-medium">D</span>
      </router-link>

      <!-- ============================================================ -->
      <!-- ETIQUETAS (CORREGIDO) -->
      <!-- ============================================================ -->

      <router-link
        v-if="authStore.tienePermiso('gestionar_etiquetas')"
        to="/etiquetas"
        class="flex items-center px-4 py-3 rounded-lg transition-all duration-200"
        :class="[isOpen ? 'justify-start' : 'justify-center']"
        :style="{
          color: $route.path === '/etiquetas' ? '#4a8db7' : '#8ab4d6',
          backgroundColor: $route.path === '/etiquetas' ? 'rgba(74, 141, 183, 0.15)' : 'transparent'
        }"
        @mouseenter="(e) => {
          if ($route.path !== '/etiquetas') {
            e.currentTarget.style.backgroundColor = 'rgba(74, 141, 183, 0.08)'
            e.currentTarget.style.color = '#6aaec9'
          }
        }"
        @mouseleave="(e) => {
          if ($route.path !== '/etiquetas') {
            e.currentTarget.style.backgroundColor = 'transparent'
            e.currentTarget.style.color = '#8ab4d6'
          }
        }"
      >
        <span v-if="isOpen" class="text-sm font-medium whitespace-nowrap">Etiquetas</span>
        <span v-else class="text-sm font-medium">E</span>
      </router-link>

      <!-- CAJAS -->
      <router-link
        v-if="authStore.tienePermiso('cerrar_caja')"
        to="/cajas"
        class="flex items-center px-4 py-3 rounded-lg transition-all duration-200"
        :class="[isOpen ? 'justify-start' : 'justify-center']"
        :style="{
          color: $route.path === '/cajas' ? '#4a8db7' : '#8ab4d6',
          backgroundColor: $route.path === '/cajas' ? 'rgba(74, 141, 183, 0.15)' : 'transparent'
        }"
        @mouseenter="(e) => {
          if ($route.path !== '/cajas') {
            e.currentTarget.style.backgroundColor = 'rgba(74, 141, 183, 0.08)'
            e.currentTarget.style.color = '#6aaec9'
          }
        }"
        @mouseleave="(e) => {
          if ($route.path !== '/cajas') {
            e.currentTarget.style.backgroundColor = 'transparent'
            e.currentTarget.style.color = '#8ab4d6'
          }
        }"
      >
        <span v-if="isOpen" class="text-sm font-medium whitespace-nowrap">Cajas</span>
        <span v-else class="text-sm font-medium">C</span>
      </router-link>


      <!-- CLIENTES -->
      <router-link
        v-if="authStore.tienePermiso('ver_reportes')"
        to="/clientes"
        class="flex items-center px-4 py-3 rounded-lg transition-all duration-200"
        :class="[isOpen ? 'justify-start' : 'justify-center']"
        :style="{
          color: $route.path === '/clientes' ? '#4a8db7' : '#8ab4d6',
          backgroundColor: $route.path === '/clientes' ? 'rgba(74, 141, 183, 0.15)' : 'transparent'
        }"
        @mouseenter="(e) => {
          if ($route.path !== '/clientes') {
            e.currentTarget.style.backgroundColor = 'rgba(74, 141, 183, 0.08)'
            e.currentTarget.style.color = '#6aaec9'
          }
        }"
        @mouseleave="(e) => {
          if ($route.path !== '/clientes') {
            e.currentTarget.style.backgroundColor = 'transparent'
            e.currentTarget.style.color = '#8ab4d6'
          }
        }"
      >
        <span v-if="isOpen" class="text-sm font-medium whitespace-nowrap">Clientes</span>
        <span v-else class="text-sm font-medium">Cl</span>
      </router-link>

      <!-- HISTORIAL DE VENTAS -->
      <router-link
        v-if="authStore.tienePermiso('ver_reportes')"
        to="/historial"
        class="flex items-center px-4 py-3 rounded-lg transition-all duration-200"
        :class="[isOpen ? 'justify-start' : 'justify-center']"
        :style="{
          color: $route.path === '/historial' ? '#4a8db7' : '#8ab4d6',
          backgroundColor: $route.path === '/historial' ? 'rgba(74, 141, 183, 0.15)' : 'transparent'
        }"
        @mouseenter="(e) => {
          if ($route.path !== '/historial') {
            e.currentTarget.style.backgroundColor = 'rgba(74, 141, 183, 0.08)'
            e.currentTarget.style.color = '#6aaec9'
          }
        }"
        @mouseleave="(e) => {
          if ($route.path !== '/historial') {
            e.currentTarget.style.backgroundColor = 'transparent'
            e.currentTarget.style.color = '#8ab4d6'
          }
        }"
      >
        <span v-if="isOpen" class="text-sm font-medium whitespace-nowrap">Historial de Ventas</span>
        <span v-else class="text-sm font-medium">H</span>
      </router-link>

      <!-- ADMINISTRACIÓN -->
      <router-link
        v-if="authStore.tienePermiso('crear_roles')"
        to="/administracion"
        class="flex items-center px-4 py-3 rounded-lg transition-all duration-200"
        :class="[isOpen ? 'justify-start' : 'justify-center']"
        :style="{
          color: $route.path === '/administracion' ? '#4a8db7' : '#8ab4d6',
          backgroundColor: $route.path === '/administracion' ? 'rgba(74, 141, 183, 0.15)' : 'transparent'
        }"
        @mouseenter="(e) => {
          if ($route.path !== '/administracion') {
            e.currentTarget.style.backgroundColor = 'rgba(74, 141, 183, 0.08)'
            e.currentTarget.style.color = '#6aaec9'
          }
        }"
        @mouseleave="(e) => {
          if ($route.path !== '/administracion') {
            e.currentTarget.style.backgroundColor = 'transparent'
            e.currentTarget.style.color = '#8ab4d6'
          }
        }"
      >
        <span v-if="isOpen" class="text-sm font-medium whitespace-nowrap">Administración</span>
        <span v-else class="text-sm font-medium">A</span>
      </router-link>

      <!-- Separador -->
      <div class="border-t my-4" style="border-color: #0a2a40;"></div>

      <!-- ============================================================ -->
      <!-- BOTÓN MODO CLARO / OSCURO (NUEVO) -->
      <!-- ============================================================ -->
      <button
        @click="themeStore.toggleTema"
        class="flex items-center px-4 py-3 rounded-lg transition-all duration-200 w-full"
        :class="[isOpen ? 'justify-start' : 'justify-center']"
        style="color: #8ab4d6;"
        @mouseenter="(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(74, 141, 183, 0.08)'
          e.currentTarget.style.color = '#6aaec9'
        }"
        @mouseleave="(e) => {
          e.currentTarget.style.backgroundColor = 'transparent'
          e.currentTarget.style.color = '#8ab4d6'
        }"
      >
        <!-- Icono Sol (Modo Claro) -->
        <svg v-if="!themeStore.esOscuro" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
        <!-- Icono Luna (Modo Oscuro) -->
        <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>

        <span v-if="isOpen" class="ml-3 text-sm font-medium whitespace-nowrap">
          {{ themeStore.esOscuro ? 'Modo Oscuro' : 'Modo Claro' }}
        </span>
      </button>

      <!-- Cerrar sesión -->
      <button
        @click="handleLogout"
        class="flex items-center px-4 py-3 rounded-lg transition-all duration-200 w-full"
        :class="isOpen ? 'justify-start' : 'justify-center'"
        style="color: #8ab4d6;"
        @mouseenter="(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(220, 80, 80, 0.15)'
          e.currentTarget.style.color = '#e88a8a'
        }"
        @mouseleave="(e) => {
          e.currentTarget.style.backgroundColor = 'transparent'
          e.currentTarget.style.color = '#8ab4d6'
        }"
      >
        <span v-if="isOpen" class="text-sm font-medium whitespace-nowrap">Cerrar Sesión</span>
        <span v-else class="text-sm font-medium">S</span>
      </button>
    </nav>
  </aside>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useThemeStore } from '../stores/theme' // <-- Importamos el store del tema

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const themeStore = useThemeStore() // <-- Instanciamos el store del tema

const isOpen = ref(true)

const toggleSidebar = () => {
  isOpen.value = !isOpen.value
}

const handleLogout = () => {
  authStore.logout()
  router.push('/pagina')
}
</script>

<style scoped>
aside::-webkit-scrollbar {
  width: 4px;
}

aside::-webkit-scrollbar-track {
  background: #021120;
}

aside::-webkit-scrollbar-thumb {
  background: #0a2a40;
  border-radius: 4px;
}

aside::-webkit-scrollbar-thumb:hover {
  background: #4a8db7;
}
</style>