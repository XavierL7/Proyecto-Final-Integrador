<template>
  <header 
    class="fixed top-0 left-0 z-50 bg-white shadow-sm transition-all duration-300 px-4 md:px-8 py-3 w-full"
  >
    <div class="max-w-7xl mx-auto flex items-center justify-between gap-4">
      
      <!-- LADO IZQUIERDO: Botón Retroceder + Logo compacto -->
      <div class="flex items-center gap-3 shrink-0">

        <a href="#" class="inline-flex items-center">
          <img 
            src="../assets/logo-removebg-preview.png" 
            alt="Kairo Logo" 
            class="h-10 md:h-12 w-auto object-contain max-w-full"
          />
        </a>
      </div>

      <!-- NAVEGACIÓN PRINCIPAL -->
      <nav class="hidden md:flex items-center gap-8 text-[#0f172a] font-bold text-sm">
        <a 
          v-for="item in navLinks" 
          :key="item.text" 
          :href="item.href" 
          class="flex items-center gap-1 hover:opacity-80 transition-opacity"
        >
          {{ item.text }}
          <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5"></path>
          </svg>
        </a>
      </nav>

      <!-- ACCIONES DE USUARIO -->
      <div class="flex items-center gap-6 text-[#0f172a] font-bold text-sm shrink-0">
        <a href="/login" class="hover:opacity-80">Iniciar Sesión</a>
      </div>

    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'

const isClicked = ref(false)

const navLinks = [
  { text: 'Producto', href: '#biometria' },
  { text: 'Servicios', href: '#modulos' },
  { text: 'Recursos', href: '#tecnologia' }
]

const handleBack = () => {
  isClicked.value = true
  setTimeout(() => {
    isClicked.value = false
    if (window.history.length > 1) {
      window.history.back()
    } else {
      window.location.href = '/'
    }
  }, 250)
}
</script>