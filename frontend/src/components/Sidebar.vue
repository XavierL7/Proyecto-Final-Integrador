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
    <nav class="p-4 space-y-1 overflow-y-auto h-[calc(100vh-80px)] custom-scrollbar">
      
      <!-- DASHBOARD -->
      <router-link
        to="/"
        class="flex items-center px-3.5 py-3 rounded-lg transition-all duration-200"
        :class="[isOpen ? 'justify-start gap-3' : 'justify-center']"
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
        title="Dashboard"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
        <span v-if="isOpen" class="text-sm font-medium whitespace-nowrap">Dashboard</span>
      </router-link>

      <!-- VENTAS -->
      <router-link
        v-if="authStore.tienePermiso('Ver_Ventas')"
        to="/ventas"
        class="flex items-center px-3.5 py-3 rounded-lg transition-all duration-200"
        :class="[isOpen ? 'justify-start gap-3' : 'justify-center']"
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
        title="Ventas"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
        </svg>
        <span v-if="isOpen" class="text-sm font-medium whitespace-nowrap">Ventas</span>
      </router-link>

      <!-- STOCK -->
      <router-link
        v-if="mostrarStock"
        to="/stock"
        class="flex items-center px-3.5 py-3 rounded-lg transition-all duration-200"
        :class="[isOpen ? 'justify-start gap-3' : 'justify-center']"
        :style="{
          color: seccionStockActiva ? '#4a8db7' : '#8ab4d6',
          backgroundColor: seccionStockActiva ? 'rgba(74, 141, 183, 0.15)' : 'transparent'
        }"
        @mouseenter="(e) => {
          if (!seccionStockActiva) {
            e.currentTarget.style.backgroundColor = 'rgba(74, 141, 183, 0.08)'
            e.currentTarget.style.color = '#6aaec9'
          }
        }"
        @mouseleave="(e) => {
          if (!seccionStockActiva) {
            e.currentTarget.style.backgroundColor = 'transparent'
            e.currentTarget.style.color = '#8ab4d6'
          }
        }"
        title="Stock"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
        <span v-if="isOpen" class="text-sm font-medium whitespace-nowrap">Stock</span>
      </router-link>

      <!-- HISTORIAL -->
      <router-link
        v-if="mostrarHistorial"
        to="/cajas"
        class="flex items-center px-3.5 py-3 rounded-lg transition-all duration-200"
        :class="[isOpen ? 'justify-start gap-3' : 'justify-center']"
        :style="{
          color: seccionHistorialActiva ? '#4a8db7' : '#8ab4d6',
          backgroundColor: seccionHistorialActiva ? 'rgba(74, 141, 183, 0.15)' : 'transparent'
        }"
        @mouseenter="(e) => {
          if (!seccionHistorialActiva) {
            e.currentTarget.style.backgroundColor = 'rgba(74, 141, 183, 0.08)'
            e.currentTarget.style.color = '#6aaec9'
          }
        }"
        @mouseleave="(e) => {
          if (!seccionHistorialActiva) {
            e.currentTarget.style.backgroundColor = 'transparent'
            e.currentTarget.style.color = '#8ab4d6'
          }
        }"
        title="Historial"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span v-if="isOpen" class="text-sm font-medium whitespace-nowrap">Historial</span>
      </router-link>

      <!-- CLIENTES -->
      <router-link
        v-if="authStore.tienePermiso('Ver_Clientes')"
        to="/clientes"
        class="flex items-center px-3.5 py-3 rounded-lg transition-all duration-200"
        :class="[isOpen ? 'justify-start gap-3' : 'justify-center']"
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
        title="Clientes"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <span v-if="isOpen" class="text-sm font-medium whitespace-nowrap">Clientes</span>
      </router-link>

      <!-- ESTADÍSTICAS -->
      <router-link
        to="/estadisticas"
        class="flex items-center px-3.5 py-3 rounded-lg transition-all duration-200"
        :class="[isOpen ? 'justify-start gap-3' : 'justify-center']"
        :style="{
          color: $route.path === '/estadisticas' ? '#4a8db7' : '#8ab4d6',
          backgroundColor: $route.path === '/estadisticas' ? 'rgba(74, 141, 183, 0.15)' : 'transparent'
        }"
        @mouseenter="(e) => {
          if ($route.path !== '/estadisticas') {
            e.currentTarget.style.backgroundColor = 'rgba(74, 141, 183, 0.08)'
            e.currentTarget.style.color = '#6aaec9'
          }
        }"
        @mouseleave="(e) => {
          if ($route.path !== '/estadisticas') {
            e.currentTarget.style.backgroundColor = 'transparent'
            e.currentTarget.style.color = '#8ab4d6'
          }
        }"
        title="Estadísticas"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        <span v-if="isOpen" class="text-sm font-medium whitespace-nowrap">Estadísticas</span>
      </router-link>

      <!-- ADMINISTRACIÓN -->
      <router-link
        v-if="mostrarAdministracion"
        to="/administracion"
        class="flex items-center px-3.5 py-3 rounded-lg transition-all duration-200"
        :class="[isOpen ? 'justify-start gap-3' : 'justify-center']"
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
        title="Administración"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span v-if="isOpen" class="text-sm font-medium whitespace-nowrap">Administración</span>
      </router-link>

      <!-- PERFIL -->
      <router-link
        to="/perfil"
        class="flex items-center px-3.5 py-3 rounded-lg transition-all duration-200"
        :class="[isOpen ? 'justify-start gap-3' : 'justify-center']"
        :style="{
          color: $route.path === '/perfil' ? '#4a8db7' : '#8ab4d6',
          backgroundColor: $route.path === '/perfil' ? 'rgba(74, 141, 183, 0.15)' : 'transparent'
        }"
        @mouseenter="(e) => {
          if ($route.path !== '/perfil') {
            e.currentTarget.style.backgroundColor = 'rgba(74, 141, 183, 0.08)'
            e.currentTarget.style.color = '#6aaec9'
          }
        }"
        @mouseleave="(e) => {
          if ($route.path !== '/perfil') {
            e.currentTarget.style.backgroundColor = 'transparent'
            e.currentTarget.style.color = '#8ab4d6'
          }
        }"
        title="Perfil"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        <span v-if="isOpen" class="text-sm font-medium whitespace-nowrap">Perfil</span>
      </router-link>

      <!-- Separador -->
      <div class="border-t my-4" style="border-color: #0a2a40;"></div>

      <!-- BOTÓN MODO CLARO / OSCURO -->
      <button
        @click="themeStore.toggleTema"
        class="flex items-center px-3.5 py-3 rounded-lg transition-all duration-200 w-full"
        :class="[isOpen ? 'justify-start gap-3' : 'justify-center']"
        style="color: #8ab4d6;"
        @mouseenter="(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(74, 141, 183, 0.08)'
          e.currentTarget.style.color = '#6aaec9'
        }"
        @mouseleave="(e) => {
          e.currentTarget.style.backgroundColor = 'transparent'
          e.currentTarget.style.color = '#8ab4d6'
        }"
        :title="themeStore.esOscuro ? 'Modo Oscuro' : 'Modo Claro'"
      >
        <!-- Icono Sol (Modo Claro) -->
        <svg v-if="!themeStore.esOscuro" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
        <!-- Icono Luna (Modo Oscuro) -->
        <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-indigo-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>

        <span v-if="isOpen" class="text-sm font-medium whitespace-nowrap">
          {{ themeStore.esOscuro ? 'Modo Oscuro' : 'Modo Claro' }}
        </span>
      </button>

      <!-- CERRAR SESIÓN -->
      <button
        @click="handleLogout"
        class="flex items-center px-3.5 py-3 rounded-lg transition-all duration-200 w-full"
        :class="[isOpen ? 'justify-start gap-3' : 'justify-center']"
        style="color: #8ab4d6;"
        @mouseenter="(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(220, 80, 80, 0.15)'
          e.currentTarget.style.color = '#e88a8a'
        }"
        @mouseleave="(e) => {
          e.currentTarget.style.backgroundColor = 'transparent'
          e.currentTarget.style.color = '#8ab4d6'
        }"
        title="Cerrar Sesión"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        <span v-if="isOpen" class="text-sm font-medium whitespace-nowrap">Cerrar Sesión</span>
      </button>
    </nav>
  </aside>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useThemeStore } from '../stores/theme'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const themeStore = useThemeStore()

const mostrarAdministracion = computed(() =>
  ['Ver_Roles', 'Ver_Trabajadores', 'Ver_Configuracion'].some(p => authStore.tienePermiso(p))
)

const mostrarStock = computed(() =>
  ['Ver_Stock', 'Ver_Etiquetas', 'Ver_Descuentos'].some(p => authStore.tienePermiso(p))
)

const seccionStockActiva = computed(() =>
  ['/stock', '/etiquetas', '/descuentos'].includes(route.path)
)

const mostrarHistorial = computed(() =>
  ['Ver_Cajas', 'Ver_Historial_Ventas', 'Ver_Historial_Trabajadores'].some(p => authStore.tienePermiso(p))
)

const seccionHistorialActiva = computed(() =>
  ['/cajas', '/historial', '/asistencias'].includes(route.path)
)

const props = defineProps({
  modelValue: { type: Boolean, default: true }
})
const emit = defineEmits(['update:modelValue'])

const isOpen = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const toggleSidebar = () => {
  isOpen.value = !isOpen.value
}

const handleLogout = () => {
  authStore.logout()
  router.push('/pagina')
}
</script>

<style scoped>
/* Estilos personalizados para la barra de desplazamiento */
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: #4a8db7 #021120;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #021120;
  border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #4a8db7;
  border-radius: 4px;
  border: 1px solid #021120;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: #6aaec9;
}
</style>