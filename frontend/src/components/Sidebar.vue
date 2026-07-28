<!-- frontend/src/components/Sidebar.vue -->
<template>
  <div>
    <!-- Overlay para cerrar en móviles -->
    <div
      v-if="isOpen && isMobile"
      class="fixed inset-0 bg-black/50 z-40"
      @click="toggleSidebar"
    ></div>

    <!-- Sidebar -->
    <aside
      :class="[
        'fixed top-0 left-0 z-50 h-screen transition-all duration-300 ease-in-out',
        'bg-white border-r border-gray-200 shadow-lg',
        isOpen ? 'w-64' : 'w-20',
        isMobile && !isOpen ? '-translate-x-full' : 'translate-x-0'
      ]"
    >
      <!-- ═══════════════════════════════════════════════════════════ -->
      <!-- LOGO (ARRIBA) - AQUÍ VA TU LOGO                         -->
      <!-- ═══════════════════════════════════════════════════════════ -->
      <div class="flex items-center justify-center h-20 border-b border-gray-200">
        <!-- Logo cuando la sidebar está ABIERTA -->
        <img
          v-if="isOpen"
          src="/src/assets/logo.png"
          alt="Logo Kairo"
          class="h-12 w-auto object-contain"
        />
        <!-- Logo cuando la sidebar está CERRADA -->
        <img
          v-else
          src="/src/assets/logo.png"
          alt="Logo Kairo"
          class="h-10 w-10 object-contain"
        />
      </div>

      <!-- Botón toggle (abrir/cerrar) - solo desktop -->
      <button
        @click="toggleSidebar"
        class="absolute -right-3 top-20 bg-white border border-gray-200 rounded-full p-1.5 shadow-md hover:bg-gray-50 transition-colors hidden md:flex"
      >
        <!-- Flecha izquierda (sidebar abierta) -->
        <svg v-if="isOpen" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        <!-- Flecha derecha (sidebar cerrada) -->
        <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <!-- ═══════════════════════════════════════════════════════════ -->
      <!-- MENÚ DE NAVEGACIÓN                                       -->
      <!-- ═══════════════════════════════════════════════════════════ -->
      <nav class="p-4 space-y-1 overflow-y-auto h-[calc(100vh-80px)]">
        <!-- Dashboard (siempre visible) -->
        <router-link
          to="/dashboard"
          class="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 hover:bg-blue-50 hover:text-blue-600 group"
          :class="[
            $route.path === '/dashboard' ? 'bg-blue-50 text-blue-600' : 'text-gray-700',
            isOpen ? 'justify-start' : 'justify-center'
          ]"
        >
          <!-- Ícono Dashboard -->
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span v-if="isOpen" class="text-sm font-medium whitespace-nowrap">Dashboard</span>
        </router-link>

        <!-- Ventas (con permiso) -->
        <router-link
          v-if="authStore.tienePermiso('dashboard_ventas')"
          to="/ventas"
          class="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 hover:bg-blue-50 hover:text-blue-600 group"
          :class="[
            $route.path === '/ventas' ? 'bg-blue-50 text-blue-600' : 'text-gray-700',
            isOpen ? 'justify-start' : 'justify-center'
          ]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <span v-if="isOpen" class="text-sm font-medium whitespace-nowrap">Ventas</span>
        </router-link>

        <!-- Cajas (con permiso) -->
        <router-link
          v-if="authStore.tienePermiso('cerrar_caja')"
          to="/cajas"
          class="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 hover:bg-blue-50 hover:text-blue-600 group"
          :class="[
            $route.path === '/cajas' ? 'bg-blue-50 text-blue-600' : 'text-gray-700',
            isOpen ? 'justify-start' : 'justify-center'
          ]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span v-if="isOpen" class="text-sm font-medium whitespace-nowrap">Cajas</span>
        </router-link>

        <!-- Trabajadores (con permiso) -->
        <router-link
          v-if="authStore.tienePermiso('gestionar_trabajadores')"
          to="/trabajadores"
          class="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 hover:bg-blue-50 hover:text-blue-600 group"
          :class="[
            $route.path === '/trabajadores' ? 'bg-blue-50 text-blue-600' : 'text-gray-700',
            isOpen ? 'justify-start' : 'justify-center'
          ]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span v-if="isOpen" class="text-sm font-medium whitespace-nowrap">Trabajadores</span>
        </router-link>

        <!-- Estadísticas (con permiso) -->
        <router-link
          v-if="authStore.tienePermiso('ver_reportes')"
          to="/estadisticas"
          class="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 hover:bg-blue-50 hover:text-blue-600 group"
          :class="[
            $route.path === '/estadisticas' ? 'bg-blue-50 text-blue-600' : 'text-gray-700',
            isOpen ? 'justify-start' : 'justify-center'
          ]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <span v-if="isOpen" class="text-sm font-medium whitespace-nowrap">Estadísticas</span>
        </router-link>

        <!-- Administración (con permiso) -->
        <router-link
          v-if="authStore.tienePermiso('crear_roles')"
          to="/admin"
          class="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 hover:bg-blue-50 hover:text-blue-600 group"
          :class="[
            $route.path === '/admin' ? 'bg-blue-50 text-blue-600' : 'text-gray-700',
            isOpen ? 'justify-start' : 'justify-center'
          ]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span v-if="isOpen" class="text-sm font-medium whitespace-nowrap">Administración</span>
        </router-link>

        <!-- Separador -->
        <div class="border-t border-gray-200 my-4"></div>

        <!-- Cerrar sesión -->
        <button
          @click="handleLogout"
          class="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 hover:bg-red-50 hover:text-red-600 group w-full"
          :class="isOpen ? 'justify-start' : 'justify-center'"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 flex-shrink-0 text-gray-500 group-hover:text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span
            v-if="isOpen"
            class="text-sm font-medium whitespace-nowrap text-gray-700 group-hover:text-red-600"
          >
            Cerrar Sesión
          </span>
        </button>
      </nav>
    </aside>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

// Estado de la sidebar (abierta/cerrada)
const isOpen = ref(window.innerWidth >= 768)

// Detectar si es móvil
const isMobile = computed(() => window.innerWidth < 768)

const toggleSidebar = () => {
  isOpen.value = !isOpen.value
}

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped>
/* Scrollbar personalizada */
aside::-webkit-scrollbar {
  width: 4px;
}

aside::-webkit-scrollbar-track {
  background: transparent;
}

aside::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 4px;
}

aside::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}
</style>