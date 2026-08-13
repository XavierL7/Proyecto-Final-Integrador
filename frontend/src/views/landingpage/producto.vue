<template>
  <section class="bg-[#11161d] text-white py-16 px-4 sm:px-6 lg:px-8">
    <div class="max-w-5xl mx-auto space-y-24">

      <!-- BIOMETRÍA & ACCESO -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div class="space-y-6">
          <span class="inline-block bg-[#14b8a6]/20 border border-[#14b8a6]/40 text-[#2dd4bf] text-xs font-bold px-4 py-1.5 rounded-full">
            Biometría & Acceso
          </span>
          <h2 class="text-3xl md:text-4xl font-extrabold leading-tight tracking-tight">
            Acceso seguro con <br>
            <span class="text-[#06b6d4]">huella digital</span>. Sin <br>
            contraseñas, sin <br>
            demoras.
          </h2>
          <p class="text-gray-400 text-sm leading-relaxed max-w-md">
            Cada usuario ingresa con su huella. KAIRO identifica al instante quién está operando, registra el inicio de turno automáticamente y habilita solo las funciones que corresponden a su nivel de acceso.
          </p>
        </div>

        <div class="relative flex justify-center items-center p-8">
          <div class="absolute top-4 right-4 bg-[#11161d]/80 border border-[#06b6d4] rounded-lg px-4 py-2 flex items-center gap-2 text-xs font-medium text-[#2dd4bf] shadow-lg backdrop-blur-sm z-10">
            <span>Verificado</span>
            <img src="../../assets/tick.png" alt="Verificado" class="w-4 h-4 object-contain" />
          </div>

          <div class="relative w-64 h-64 flex items-center justify-center">
            <img src="../../assets/huella.png" alt="Huella Digital Kairo" class="w-full h-full object-contain" />
          </div>

          <div class="absolute bottom-4 left-4 bg-[#11161d]/80 border border-[#06b6d4] rounded-lg px-4 py-2 text-xs font-medium text-[#2dd4bf] shadow-lg backdrop-blur-sm z-10">
            Turno iniciado 00:00
          </div>
        </div>
      </div>

      <!-- TARJETAS DE CARACTERÍSTICAS -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div 
          v-for="feature in features" 
          :key="feature.title" 
          class="bg-black/40 border border-[#06b6d4]/80 rounded-xl p-6 flex flex-col min-h-[180px]"
        >
          <div class="flex items-center gap-3">
            <div class="p-2 rounded-lg flex items-start justify-center">
              <component :is="feature.icon" class="w-7 h-7 text-[#06b6d4]" />
            </div>
            <h3 class="text-lg font-bold text-[#06b6d4]">{{ feature.title }}</h3>
          </div>
          <p class="text-gray-300 text-sm mt-4 leading-relaxed">{{ feature.description }}</p>
        </div>
      </div>

      <!-- PERSONALIZACIÓN POR COMERCIO -->
      <div class="space-y-12 text-center pt-8">
        <div class="space-y-4 max-w-2xl mx-auto">
          <span class="inline-block bg-[#14b8a6]/20 border border-[#14b8a6]/40 text-[#2dd4bf] text-xs font-bold px-4 py-1.5 rounded-full">
            Personalización
          </span>
          <h2 class="text-3xl md:text-4xl font-extrabold tracking-tight">
            Adaptado a <span class="text-[#06b6d4]">tu tipo de comercio</span>
          </h2>
          <p class="text-gray-400 text-sm leading-relaxed">
            No hay dos negocios iguales. KAIRO se configura para encajar en tu operativa, tu vocabulario y tus necesidades específicas.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div 
            v-for="business in businessTypes" 
            :key="business.title" 
            class="bg-black/40 border border-[#06b6d4]/60 rounded-xl p-6 flex flex-col justify-between min-h-[240px]"
          >
            <div class="space-y-4">
              <component :is="business.icon" class="w-8 h-8 text-[#06b6d4]" />
              <h3 class="text-lg font-bold text-[#06b6d4]">{{ business.title }}</h3>
              <p class="text-gray-300 text-xs leading-relaxed">{{ business.description }}</p>
            </div>
            <p class="text-[#06b6d4] text-xs font-medium mt-6">{{ business.tag }}</p>
          </div>
        </div>
      </div>

    </div>
  </section>
</template>

<script setup>
import { h } from 'vue'

const LockIcon = () => h('svg', { fill: 'none', stroke: 'currentColor', 'stroke-width': '2.5', viewBox: '0 0 24 24' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' })
])

const UsersIcon = () => h('svg', { fill: 'none', stroke: 'currentColor', 'stroke-width': '2', viewBox: '0 0 24 24' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' })
])

const ClockIcon = () => h('svg', { fill: 'none', stroke: 'currentColor', 'stroke-width': '2.5', viewBox: '0 0 24 24' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' })
])

const CartIcon = () => h('svg', { fill: 'none', stroke: 'currentColor', 'stroke-width': '2', viewBox: '0 0 24 24' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z' })
])

const BagIcon = () => h('svg', { fill: 'none', stroke: 'currentColor', 'stroke-width': '2', viewBox: '0 0 24 24' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' })
])

const GearIcon = () => h('svg', { fill: 'none', stroke: 'currentColor', 'stroke-width': '1.8', viewBox: '0 0 24 24' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' }),
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z' })
])

const features = [
  { title: 'Autenticación', description: 'Huella digital + Contraseña', icon: LockIcon },
  { title: 'Roles diferenciados', description: 'Admin · Vendedor · Supervisor. Cada rol ve y hace solo lo que necesita.', icon: UsersIcon },
  { title: 'Asistencia automática', description: 'El login es el fichaje. Registra entradas, salidas y horas trabajadas sin pasos extra.', icon: ClockIcon }
]

const businessTypes = [
  { title: 'Kiosco/Supermercado', description: 'Gestión por unidades. Códigos de barras y escaneo rápido en caja.', tag: 'Stock por unidades', icon: CartIcon },
  { title: 'Ropa/calzado', description: 'Filtrado por talle y color. Temporadas y liquidaciones. Panel de tendencias para entender qué vende más.', tag: 'Filtros', icon: BagIcon },
  { title: 'Ferretería', description: 'Menú configurable. Descuento de productos al registrar stock.', tag: 'Configurable', icon: GearIcon }
]
</script>