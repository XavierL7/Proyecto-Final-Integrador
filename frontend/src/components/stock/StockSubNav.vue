<!-- frontend/src/components/stock/StockSubNav.vue -->
<!--
  Barra de pestañas compartida entre /stock, /etiquetas y /descuentos.
  Se muestra arriba de cada una de esas tres vistas para poder moverse
  entre ellas sin volver al sidebar. Cada pestaña se oculta sola si el
  usuario no tiene el permiso correspondiente (por si entra directo a
  /stock con el link, no debería ver pestañas a las que no tiene acceso).
-->
<template>
  <div class="flex gap-2 border-b border-gray-200 mb-6">
    <router-link
      v-if="authStore.tienePermiso('Ver_Stock')"
      to="/stock"
      class="px-4 py-2 font-medium transition-colors"
      :class="esActiva('/stock')
        ? 'border-b-2 border-blue-500 text-blue-600'
        : 'text-gray-500 hover:text-gray-700'"
    >
      Stock
    </router-link>

    <router-link
      v-if="authStore.tienePermiso('Ver_Etiquetas')"
      to="/etiquetas"
      class="px-4 py-2 font-medium transition-colors"
      :class="esActiva('/etiquetas')
        ? 'border-b-2 border-blue-500 text-blue-600'
        : 'text-gray-500 hover:text-gray-700'"
    >
      Etiquetas
    </router-link>

    <router-link
      v-if="authStore.tienePermiso('Ver_Descuentos')"
      to="/descuentos"
      class="px-4 py-2 font-medium transition-colors"
      :class="esActiva('/descuentos')
        ? 'border-b-2 border-blue-500 text-blue-600'
        : 'text-gray-500 hover:text-gray-700'"
    >
      Descuentos
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
