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
      <!-- Dashboard -->
      <router-link
        to="/dashboard"
        class="flex items-center px-4 py-3 rounded-lg transition-all duration-200"
        :class="[
          isOpen ? 'justify-start' : 'justify-center'
        ]"
        :style="{
          color: $route.path === '/dashboard' ? '#4a8db7' : '#8ab4d6',
          backgroundColor: $route.path === '/dashboard' ? 'rgba(74, 141, 183, 0.15)' : 'transparent'
        }"
        @mouseenter="(e) => {
          if ($route.path !== '/dashboard') {
            e.currentTarget.style.backgroundColor = 'rgba(74, 141, 183, 0.08)'
            e.currentTarget.style.color = '#6aaec9'
          }
        }"
        @mouseleave="(e) => {
          if ($route.path !== '/dashboard') {
            e.currentTarget.style.backgroundColor = 'transparent'
            e.currentTarget.style.color = '#8ab4d6'
          }
        }"
      >
        <span v-if="isOpen" class="text-sm font-medium whitespace-nowrap">Dashboard</span>
        <span v-else class="text-sm font-medium">D</span>
      </router-link>

      <!-- Ventas -->
      <router-link
        v-if="authStore.tienePermiso('dashboard_ventas')"
        to="/ventas"
        class="flex items-center px-4 py-3 rounded-lg transition-all duration-200"
        :class="[
          isOpen ? 'justify-start' : 'justify-center'
        ]"
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

      <!-- Cajas -->
      <router-link
        v-if="authStore.tienePermiso('cerrar_caja')"
        to="/cajas"
        class="flex items-center px-4 py-3 rounded-lg transition-all duration-200"
        :class="[
          isOpen ? 'justify-start' : 'justify-center'
        ]"
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

      <!-- Trabajadores -->
      <router-link
        v-if="authStore.tienePermiso('gestionar_trabajadores')"
        to="/trabajadores"
        class="flex items-center px-4 py-3 rounded-lg transition-all duration-200"
        :class="[
          isOpen ? 'justify-start' : 'justify-center'
        ]"
        :style="{
          color: $route.path === '/trabajadores' ? '#4a8db7' : '#8ab4d6',
          backgroundColor: $route.path === '/trabajadores' ? 'rgba(74, 141, 183, 0.15)' : 'transparent'
        }"
        @mouseenter="(e) => {
          if ($route.path !== '/trabajadores') {
            e.currentTarget.style.backgroundColor = 'rgba(74, 141, 183, 0.08)'
            e.currentTarget.style.color = '#6aaec9'
          }
        }"
        @mouseleave="(e) => {
          if ($route.path !== '/trabajadores') {
            e.currentTarget.style.backgroundColor = 'transparent'
            e.currentTarget.style.color = '#8ab4d6'
          }
        }"
      >
        <span v-if="isOpen" class="text-sm font-medium whitespace-nowrap">Trabajadores</span>
        <span v-else class="text-sm font-medium">T</span>
      </router-link>

      <!-- Estadísticas -->
      <router-link
        v-if="authStore.tienePermiso('ver_reportes')"
        to="/estadisticas"
        class="flex items-center px-4 py-3 rounded-lg transition-all duration-200"
        :class="[
          isOpen ? 'justify-start' : 'justify-center'
        ]"
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
      >
        <span v-if="isOpen" class="text-sm font-medium whitespace-nowrap">Estadísticas</span>
        <span v-else class="text-sm font-medium">E</span>
      </router-link>

      <!-- Administración -->
      <router-link
        v-if="authStore.tienePermiso('crear_roles')"
        to="/admin"
        class="flex items-center px-4 py-3 rounded-lg transition-all duration-200"
        :class="[
          isOpen ? 'justify-start' : 'justify-center'
        ]"
        :style="{
          color: $route.path === '/admin' ? '#4a8db7' : '#8ab4d6',
          backgroundColor: $route.path === '/admin' ? 'rgba(74, 141, 183, 0.15)' : 'transparent'
        }"
        @mouseenter="(e) => {
          if ($route.path !== '/admin') {
            e.currentTarget.style.backgroundColor = 'rgba(74, 141, 183, 0.08)'
            e.currentTarget.style.color = '#6aaec9'
          }
        }"
        @mouseleave="(e) => {
          if ($route.path !== '/admin') {
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

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const isOpen = ref(true)

const toggleSidebar = () => {
  isOpen.value = !isOpen.value
}

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
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