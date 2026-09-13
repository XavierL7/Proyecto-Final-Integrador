<!-- frontend/src/components/historial/HistorialSubNav.vue -->
<!--
  Barra de pestañas compartida entre /cajas, /historial y /asistencias.
  Mismo patrón que StockSubNav: se muestra arriba de cada una de esas
  vistas para moverse entre ellas sin volver al sidebar, y cada pestaña
  se oculta sola si el usuario no tiene el permiso correspondiente.
-->
<template>
  <div class="flex gap-2 border-b border-gray-200 mb-6">
    <router-link
      v-if="authStore.tienePermiso('Ver_Cajas')"
      to="/cajas"
      class="px-4 py-2 font-medium transition-colors"
      :class="esActiva('/cajas')
        ? 'border-b-2 border-blue-500 text-blue-600'
        : 'text-gray-500 hover:text-gray-700'"
    >
      Cajas
    </router-link>

    <router-link
      v-if="authStore.tienePermiso('Ver_Historial_Ventas')"
      to="/historial"
      class="px-4 py-2 font-medium transition-colors"
      :class="esActiva('/historial')
        ? 'border-b-2 border-blue-500 text-blue-600'
        : 'text-gray-500 hover:text-gray-700'"
    >
      Ventas
    </router-link>

    <router-link
      v-if="authStore.tienePermiso('Ver_Historial_Trabajadores')"
      to="/asistencias"
      class="px-4 py-2 font-medium transition-colors"
      :class="esActiva('/asistencias')
        ? 'border-b-2 border-blue-500 text-blue-600'
        : 'text-gray-500 hover:text-gray-700'"
    >
      Asistencias
    </router-link>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { useAuthStore } from '../../stores/auth'

const route = useRoute()
const authStore = useAuthStore()

const esActiva = (path) => route.path === path
</script>
