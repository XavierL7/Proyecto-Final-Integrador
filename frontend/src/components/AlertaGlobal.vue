<!-- frontend/src/components/AlertaGlobal.vue -->
<!--
  Aviso flotante genérico para toda la app. Se monta UNA vez en App.vue
  y queda escuchando el store de alertas: cuando el interceptor de axios
  detecta que el servidor o la base de datos no responden, este cartel
  aparece con un mensaje amigable en vez de dejar la pantalla colgada o
  exponer el error crudo de la API.
-->
<template>
  <transition name="alerta-fade">
    <div
      v-if="alertas.visible"
      class="fixed bottom-6 right-6 z-[9999] max-w-sm bg-red-600 text-white px-4 py-3 rounded-lg shadow-2xl flex items-start gap-3"
      role="alert"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
      </svg>
      <p class="text-sm flex-1">{{ alertas.mensaje }}</p>
      <button @click="alertas.ocultar()" class="text-white/80 hover:text-white text-sm leading-none">✕</button>
    </div>
  </transition>
</template>

<script setup>
import { useAlertasStore } from '../stores/alertas'

const alertas = useAlertasStore()
</script>

<style scoped>
.alerta-fade-enter-active,
.alerta-fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.alerta-fade-enter-from,
.alerta-fade-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>
