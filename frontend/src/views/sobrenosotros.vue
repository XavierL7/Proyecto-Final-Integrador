<template>
  <div class="min-h-screen bg-slate-50 flex flex-col">
    <!-- Header Reutilizable -->
    <Header />

    <!-- Sección de Equipo Directivo Centrada -->
    <main class="flex-1 max-w-7xl w-full mx-auto px-4 flex flex-col justify-center items-center py-12">
      
      <!-- Título en su posición actual -->
      <h1 class="text-3xl md:text-4xl font-bold text-center text-slate-900 mb-24">
        Equipo directivo
      </h1>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 w-full" style="margin-top: 60px;">
        <div 
          v-for="(member, index) in teamMembers" 
          :key="index" 
          class="flex flex-col items-center text-center"
        >
          <!-- Contenedor con fondo dinámico y esquinas redondeadas -->
          <div 
            class="w-full aspect-[4/3] rounded-2xl overflow-hidden mb-4 flex items-end justify-center"
            :style="{ backgroundColor: member.bgColor }"
          >
            <img 
              :src="member.image" 
              :alt="member.name"
              class="w-full h-full object-cover object-bottom"
            />
          </div>

          <!-- Nombre y Cargo -->
          <h2 class="text-xl font-bold text-slate-900 mb-1">
            {{ member.name }}
          </h2>
          <p class="text-sm text-slate-600 font-medium">
            {{ member.role }}
          </p>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
// Importación del Header
import Header from '../components/Header.vue' 

// Datos de los integrantes
const teamMembers = [
  {
    name: 'Xavier Lacunza',
    role: 'Desarrollador full stack (Enfoque en base de datos y backend)',
    image: new URL('../assets/xavier.png', import.meta.url).href,
    bgColor: '#14b8a6' // verde agua
  },
  {
    name: 'Lara Veloso',
    role: 'Desarrolladora full stack (Enfoque en frontend y diseño)',
    image: 'https://via.placeholder.com/400x300', // Reemplazá con la ruta/src de tu imagen
    bgColor: '#11161d' // azul oscuro
  },
  {
    name: 'Lautaro Sanchez Rosalín',
    role: 'Desarrollador full stack (Enfoque en hardware y maquetación)',
    image: 'https://via.placeholder.com/400x300', // Reemplazá con la ruta/src de tu imagen
    bgColor: '#14b8a6' // verde agua
  }
]
</script>