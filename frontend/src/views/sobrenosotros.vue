<template>
  <div class="min-h-screen bg-slate-50">
    <!-- Header Reutilizable -->
    <Header />

    <!-- Sección de Equipo Directivo -->
    <main class="max-w-7xl mx-auto px-4 py-16">
      <h1 class="text-3xl md:text-4xl font-bold text-center text-slate-900 mb-12">
        Equipo directivo
      </h1>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
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
// Importación del Header (Ajustá la ruta según la ubicación exacta de tu Header.vue)
import Header from '../components/Header.vue' 

// Datos de los integrantes
const teamMembers = [
  {
    name: 'Andrey Khusid',
    role: 'Cofundador y director general',
    image: new URL('../assets/xavier.png', import.meta.url).href,
    bgColor: '#facc15' // Amarillo
  },
  {
    name: 'Jeff Chow',
    role: 'Director de Producto y tecnología',
    image: 'https://via.placeholder.com/400x300', // Reemplazá con la ruta/src de tu imagen
    bgColor: '#facc15' // Amarillo
  },
  {
    name: 'Justin Coulombe',
    role: 'Director financiero',
    image: 'https://via.placeholder.com/400x300', // Reemplazá con la ruta/src de tu imagen
    bgColor: '#a78bfa' // Lila / Violeta
  }
]
</script>