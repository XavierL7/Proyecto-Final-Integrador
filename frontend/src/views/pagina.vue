<!-- frontend/src/views/Pagina.vue -->
<template>
  <main class="font-['Montserrat',sans-serif] scroll-smooth">
    
    <!-- HEADER FIJO QUE ACOMPAÑA EL SCROLL -->
    <Header />

    <!-- ========================================== -->
    <!-- SECCIÓN 1: HERO BANNER                    -->
    <!-- ========================================== -->
    <div class="w-full min-h-screen p-4 md:p-8 pt-28 md:pt-32 flex flex-col justify-between bg-[#f1f5f9]">
      
      <!-- HERO SECTION -->
      <div class="relative flex-1 rounded-2xl overflow-hidden flex items-center min-h-[500px]">
        <img 
          src="../assets/foto1.png" 
          alt="Fondo Kairo"
          class="absolute inset-0 w-full h-full object-cover object-top"
        />

        <div class="absolute inset-0 bg-gradient-to-r from-[#1e293b]/95 via-[#1e293b]/85 to-[#3b82f6]/20 mix-blend-multiply md:mix-blend-normal"></div>

        <div class="relative z-10 max-w-2xl px-8 py-12 md:px-16 flex flex-col justify-center h-full">
          <h1 class="text-white text-4xl md:text-5xl font-bold leading-[1.15] mb-12 tracking-wide">
            Vender, controlar y crecer. 
            <span class="text-white/80 font-normal">
              Tu huella es la llave de tu <span class="text-[#00e5ff] font-bold">negocio.</span>
            </span>
          </h1>

          <div class="flex flex-wrap gap-4 items-center">
            <a href="/sobrenosotros" class="bg-white text-[#0f172a] font-bold px-7 py-3.5 rounded-xl hover:bg-gray-100 transition shadow-sm text-center min-w-[160px]">
              Sobre nosotros
            </a>
            
            <a href="/contacto" class="bg-gradient-to-r from-[#14b8a6] to-[#06b6d4] text-white font-semibold px-7 py-3.5 rounded-xl hover:opacity-90 transition flex items-center justify-center gap-2 min-w-[160px]">
              Ver más 
              <svg class="w-4 h-4 stroke-[3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"></path>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>


    <!-- ========================================== -->
    <!-- SECCIÓN 2: BIOMETRÍA & PERSONALIZACIÓN     -->
    <!-- ========================================== -->
    <section id="biometria" class="bg-[#11161d] text-white py-16 px-4 sm:px-6 lg:px-8">
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
            <p class="text-gray-400 text-lg leading-relaxed max-w-md">
              Cada usuario ingresa con su huella. KAIRO identifica al instante quién está operando, registra el inicio de turno automáticamente y habilita solo las funciones que corresponden a su nivel de acceso.
            </p>
          </div>

          <div class="relative flex justify-center items-center p-8">
            <div class="absolute top-4 right-4 bg-[#11161d]/80 border border-[#06b6d4] rounded-lg px-4 py-2 flex items-center gap-2 text-xs font-medium text-[#2dd4bf] shadow-lg backdrop-blur-sm z-10">
              <span>Verificado</span>
              <img src="../assets/tick.png" alt="Verificado" class="w-4 h-4 object-contain" />
            </div>

            <div class="relative w-64 h-64 flex items-center justify-center">
              <img src="../assets/huella.png" alt="Huella Digital Kairo" class="w-full h-full object-contain" />
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
            <p class="text-gray-300 text-base mt-4 leading-relaxed">{{ feature.description }}</p>
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
            <p class="text-gray-400 text-lg leading-relaxed">
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
                <p class="text-gray-300 text-base leading-relaxed">{{ business.description }}</p>
              </div>
              <p class="text-[#06b6d4] text-sm font-medium mt-6">{{ business.tag }}</p>
            </div>
          </div>
        </div>

      </div>
    </section>


    <!-- ========================================== -->
    <!-- SECCIÓN 3: MÓDULOS DEL SISTEMA            -->
    <!-- ========================================== -->
    <section id="modulos" class="bg-[#e2e2e2] text-gray-800 min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div class="max-w-6xl mx-auto space-y-16">

        <div class="text-center space-y-4 max-w-3xl mx-auto">
          <h1 class="text-3xl md:text-5xl font-black tracking-tight text-black">
            Todo lo que tu negocio <br class="hidden sm:inline">
            necesita, <span class="text-[#00a8bd]">en uno.</span>
          </h1>
          <p class="text-gray-600 text-lg leading-relaxed px-4">
            Módulos integrados que trabajan juntos. No más planillas sueltas, no más sistemas que no se comuniquen.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
          <div 
            v-for="module in modules" 
            :key="module.id"
            class="relative rounded-2xl p-8 pt-12 flex flex-col justify-between shadow-lg"
            :class="module.isCyan ? 'bg-[#00a8bd] text-black' : 'bg-[#11161d] text-white'"
          >
            <!-- Badge Número -->
            <div 
              class="absolute -top-4 -left-4 font-bold w-12 h-12 rounded-full flex items-center justify-center text-sm border-2 border-[#e2e2e2]"
              :class="module.isCyan ? 'bg-[#11161d] text-white' : 'bg-[#007ba2] text-white'"
            >
              {{ module.id }}
            </div>

            <div class="space-y-6 text-center">
              <div class="flex justify-center">
                <div v-if="module.customIconWrapper" class="w-16 h-16 flex items-center justify-center" :class="module.customIconWrapper">
                  <component :is="module.icon" :class="module.isCyan ? 'text-gray-700' : 'text-[#00bcd4]'" class="w-10 h-10" />
                </div>
                <component v-else :is="module.icon" class="w-16 h-16" :class="module.isCyan ? 'text-black' : 'text-[#00bcd4]'" />
              </div>

              <h2 class="text-xl font-bold" :class="module.isCyan ? 'text-black' : 'text-[#00bcd4]'">
                {{ module.title }}
              </h2>
              <p 
                class="text-base leading-relaxed text-left" 
                :class="module.isCyan ? 'text-black/80 font-medium' : 'text-gray-300'"
              >
                {{ module.description }}
              </p>
            </div>

              <div 
                class="mt-8 space-y-3 text-sm"
                :class="module.isCyan ? 'text-black font-semibold' : 'text-gray-300'"
              >
                <div v-for="(feature, idx) in module.features" :key="idx" class="flex items-start gap-2">
                  <svg 
                    class="w-4 h-4 shrink-0"
                    :class="module.isCyan ? 'text-black' : 'text-[#06b6d4]'" 
                    fill="none" 
                    stroke="currentColor" 
                    stroke-width="2.5" 
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                  <span>{{ feature }}</span>
                </div>
              </div>
          </div>
        </div>

      </div>
    </section>


    <!-- ========================================== -->
    <!-- SECCIÓN 4: STACK TECNOLÓGICO & FOOTER     -->
    <!-- ========================================== -->
    <div class="bg-[#dcdcdc] text-gray-800 antialiased">
      <!-- BANNER STACK -->
      <section id="tecnologia" class="bg-[#11161d] text-white overflow-hidden py-12 md:py-16">
        <div class="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div class="md:col-span-8 space-y-6">
            <h1 class="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight">
              Construido con tecnología <br>
              pensada <span class="text-[#00bcd4]">para durar.</span>
            </h1>
            <p class="text-gray-400 text-lg leading-relaxed max-w-2xl font-normal">
              Stack moderno, probado y abierto. KAIRO se apoya en herramientas de primer nivel para garantizar rendimiento, seguridad y escalabilidad.
            </p>
          </div>

          <div class="md:col-span-4 flex justify-end items-end relative -mb-12 md:-mb-16">
            <img 
              src="../assets/mujer.png" 
              alt="Profesional con tablet KAIRO" 
              class="w-72 md:w-full object-cover rounded-tl-full rounded-tr-full h-80 md:h-auto drop-shadow-2xl" 
            />
          </div>
        </div>
      </section>

      <!-- GRID TECNOLOGÍAS -->
      <section class="py-16 md:py-24 max-w-7xl mx-auto px-6 lg:px-12">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div class="lg:col-span-5 space-y-6">
            <h2 class="text-3xl md:text-5xl font-extrabold text-black leading-tight">
              ¿Con qué está <br>
              hecho <span class="text-[#00bcd4]">KAIRO</span>?
            </h2>
            <p class="text-gray-700 text-base leading-relaxed font-normal">
              Elegimos cada herramienta con criterio. El frontend es rápido y responsivo, el backend es seguro y escalable, y la biometría funciona en hardware accesible. Tecnología al alcance de cualquier comercio.
            </p>
          </div>

          <div class="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div 
              v-for="tech in techStack" 
              :key="tech.name"
              class="bg-[#dcdcdc] border-2 border-[#00bcd4] rounded-2xl p-6 flex flex-col justify-between min-h-[220px] shadow-sm"
            >
              <div class="space-y-4">
                <div class="flex items-center gap-3">
                  <span class="text-2xl font-extrabold tracking-tight text-gray-900" v-html="tech.logoHtml"></span>
                </div>
                <p class="text-base text-gray-800 font-medium leading-relaxed">
                  {{ tech.description }}
                </p>
              </div>
              <span class="text-xs font-semibold text-[#3b93e5] tracking-wide mt-4">// {{ tech.category }}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- FOOTER -->
      <footer id= "footer" class="bg-[#050c1a] text-white pt-16 pb-8 border-t border-gray-800">
        <div class="max-w-7xl mx-auto px-6 lg:px-12 space-y-12">
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            <div class="lg:col-span-5 space-y-6">
              <div class="flex items-center">
                <img src="../assets/logo.png.png" alt="Logo KAIRO" class="h-12 w-auto object-contain" />
              </div>
              <p class="text-sm text-gray-300 leading-relaxed font-normal pr-4">
                KAIRO es el proyecto final de un equipo de desarrollo de último año de la Escuela Técnica N° 24 "Simón de Iriondo". Lo construimos para egresarnos, pero también para entender de primera mano qué significa trabajar en un entorno real: tomar decisiones de diseño, integrar hardware con software, organizar un equipo y entregar algo que funcione. No es solo un trabajo práctico, es nuestra primera experiencia construyendo un producto completo de principio a fin.
              </p>
            </div>

            <div class="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-8">
              <div v-for="group in footerLinks" :key="group.title" class="space-y-4">
                <div class="bg-[#14b8a6] text-white font-bold text-center py-2 px-4 rounded-full text-sm shadow">
                  {{ group.title }}
                </div>
                <ul class="space-y-3 text-sm text-gray-300 font-medium">
                  <li v-for="link in group.items" :key="link">
                    <a href="#" class="hover:text-[#00bcd4] transition-colors">{{ link }}</a>
                  </li>
                </ul>
              </div>
            </div>

          </div>

          <div class="pt-8 border-t border-gray-800 text-center text-xs text-gray-400 font-medium">
            © 2026 KAIRO · Proyecto Final
          </div>
        </div>
      </footer>
    </div>

  </main>
</template>

<script setup>
import { h } from 'vue'
import Header from '../components/Header.vue'

// Iconos inline
// Íconos generales / características
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

const StockIcon = () => h('svg', { fill: 'none', stroke: 'currentColor', 'stroke-width': '1.5', viewBox: '0 0 24 24' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' }),
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M17 17h2a1 1 0 001-1v-3a1 1 0 00-1-1h-2v4z' })
])

const PosIcon = () => h('svg', { fill: 'none', stroke: 'currentColor', 'stroke-width': '1.5', viewBox: '0 0 24 24' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' })
])

const CashIcon = () => h('svg', { fill: 'none', stroke: 'currentColor', 'stroke-width': '1.5', viewBox: '0 0 24 24' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' })
])

const AttendanceIcon = () => h('svg', { fill: 'none', stroke: 'currentColor', 'stroke-width': '2', viewBox: '0 0 24 24' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' })
])

const AnalyticsIcon = () => h('svg', { fill: 'none', stroke: 'currentColor', 'stroke-width': '1.5', viewBox: '0 0 24 24' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' }),
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M16 17v4m-4-8v8m-4-4v4' })
])

const SecurityIcon = () => h('svg', { fill: 'none', stroke: 'currentColor', 'stroke-width': '2', viewBox: '0 0 24 24' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' })
])

// Íconos de las tecnologías
const SupabaseIcon = () => h('svg', { class: 'w-8 h-8 text-[#3ecf8e]', fill: 'currentColor', viewBox: '0 0 24 24' }, [
  h('path', { d: 'M11.523 0L1.92 12.022h8.736L9.6 24l12.48-13.882h-8.736L14.4 0h-2.877z' })
])

const VueIcon = () => h('svg', { class: 'w-8 h-8', viewBox: '0 0 24 24' }, [
  h('path', { fill: '#41b883', d: 'M2 3h3.5L12 15 20.5 3H24L12 21 0 3h2z' }),
  h('path', { fill: '#35495e', d: 'M6.5 3h3.5L12 7.5 14 3h3.5L12 12 6.5 3z' })
])

const NodeIcon = () => h('svg', { class: 'w-8 h-8 text-[#539e43]', fill: 'currentColor', viewBox: '0 0 24 24' }, [
  h('path', { d: 'M12 0L1.75 5.92v12.16L12 24l10.25-5.92V5.92L12 0zm0 2.8l7.8 4.5v9l-7.8 4.5-7.8-4.5v-9l7.8-4.5z' })
])

const ArduinoIcon = () => h('svg', { class: 'w-10 h-10 text-[#00979d]', fill: 'none', stroke: 'currentColor', 'stroke-width': '2', viewBox: '0 0 24 24' }, [
  h('circle', { cx: '12', cy: '12', r: '9' }),
  h('path', { d: 'M8 12h2.5m1.5 0h2.5M16 10v4' })
])

const ExpressIcon = () => h('div', { class: 'flex items-center gap-2' }, [
  h('span', { class: 'text-2xl font-light text-gray-700 tracking-tight' }, 'Express'),
  h('span', { class: 'bg-black text-white text-xs font-bold px-2 py-1 rounded' }, 'JS')
])

const TailwindIcon = () => h('svg', { class: 'w-8 h-8 text-[#38bdf8]', fill: 'currentColor', viewBox: '0 0 24 24' }, [
  h('path', { d: 'M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.336 6.182 14.975 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C7.666 17.818 9.027 19.2 12.001 19.2c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.336 13.382 8.975 12 6.001 12z' }),
  h('span', { class: 'text-2xl font-light text-gray-700 tracking-tight' }, 'Express'),
  h('span', { class: 'bg-black text-white text-xs font-bold px-2 py-1 rounded' }, 'JS')
])

// Datos estáticos
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

const modules = [
  {
    id: '01',
    isCyan: false,
    title: 'Gestión de Stock',
    description: 'Control de inventario en tiempo real con alertas automáticas cuando el stock llega al mínimo configurado.',
    icon: StockIcon,
    features: ['Registro de entrada y salida', 'Cálculo de horas trabajadas', 'Historial por empleado']
  },
  {
    id: '02',
    isCyan: true,
    title: 'Punto de Ventas',
    description: 'Caja rápida e intuitiva para el vendedor. Registro de ventas, cálculo de cambio, medios de pago múltiples.',
    icon: PosIcon,
    features: ['Efectivo, tarjeta, transferencia', 'Ventas en cuenta corriente', 'Descuentos y promociones']
  },
  {
    id: '03',
    isCyan: false,
    title: 'Gestión de Caja',
    description: 'Apertura y cierre de caja con resumen diario. Seguimiento de ingresos y egresos por tipo de pago.',
    icon: CashIcon,
    features: ['Apertura y cierre diario', 'Egresos y gastos del día', 'Resumen por vendedor']
  },
  {
    id: '04',
    isCyan: true,
    title: 'Asistencia del Personal',
    description: 'El ingreso al sistema con huella digital registra automáticamente la asistencia. Sin papeles ni relojes adicionales.',
    icon: AttendanceIcon,
    customIconWrapper: 'bg-gray-200/60 rounded-full',
    features: ['Registro de entrada y salida', 'Cálculo de horas trabajadas', 'Historial por empleado']
  },
  {
    id: '05',
    isCyan: false,
    title: 'Reportes & Analítica',
    description: 'Visualización de ventas, rentabilidad y tendencias. Disponible solo para usuarios con nivel de acceso Admin.',
    icon: AnalyticsIcon,
    features: ['Top productos del período', 'Ingresos por vendedor', 'Comparativa mensual', 'Top vendedores por día']
  },
  {
    id: '06',
    isCyan: true,
    title: 'Seguridad & Roles',
    description: 'Sistema de permisos por nivel. Cada usuario accede únicamente a lo que corresponde a su rol dentro de la organización.',
    icon: SecurityIcon,
    customIconWrapper: 'bg-gray-200/60 rounded-t-full rounded-b-2xl',
    features: ['Niveles: Admin y roles creados', 'Log de acciones por usuario', 'Bloqueo por inactividad']
  }
]

const techStack = [
  { name: 'Supabase', description: 'Motor relacional robusto y seguro', category: 'Base de datos', logoHtml: '<div class="flex items-center gap-3"><svg class="w-8 h-8 text-[#3ecf8e]" fill="currentColor" viewBox="0 0 24 24"><path d="M11.523 0L1.92 12.022h8.736L9.6 24l12.48-13.882h-8.736L14.4 0h-2.877z"/></svg> <span class="text-2xl font-extrabold tracking-tight text-gray-900">supabase</span></div>' },
  { name: 'Vue.js', description: 'Interfaz de usuario y Aplicación Web', category: 'Frontend', logoHtml: '<div class="flex items-center gap-3"><svg class="w-8 h-8" viewBox="0 0 24 24"><path d="M2 3h3.5L12 15 20.5 3H24L12 21 0 3h2z" fill="#41b883"/><path d="M6.5 3h3.5L12 7.5 14 3h3.5L12 12 6.5 3z" fill="#35495e"/></svg> <span class="text-2xl font-extrabold tracking-tight text-gray-900">Vue.js</span></div>' },
  { name: 'Node.js', description: 'Entorno de ejecución para javascript', category: 'Frontend & Backend', logoHtml: '<div class="flex items-center gap-3"><svg class="w-8 h-8 text-[#539e43]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0L1.75 5.92v12.16L12 24l10.25-5.92V5.92L12 0zm0 2.8l7.8 4.5v9l-7.8 4.5-7.8-4.5v-9l7.8-4.5z"/></svg> <span class="text-2xl font-extrabold tracking-tight text-gray-900">node<span class="text-xs font-normal bg-[#539e43] text-white px-1 rounded ml-1">JS</span></span></div>' },
  { name: 'Arduino', description: 'Programar el microcontrolador para interactuar entre el lector y el sistema', category: 'Hardware', logoHtml: '<div class="flex items-center gap-2 text-[#00979d]"><svg class="w-10 h-10" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M8 12h2.5m1.5 0h2.5M16 10v4"/></svg> <span class="text-xl font-extrabold tracking-widest text-[#00979d]">ARDUINO</span></div>' },
  { name: 'Express.js', description: 'Puente central en todas las partes del sistema', category: 'Backend', logoHtml: '<div class="flex items-center gap-2"><span class="text-2xl font-light text-gray-700 tracking-tight">Express</span> <span class="bg-black text-white text-xs font-bold px-2 py-1 rounded">JS</span></div>' },
  { name: 'Tailwind CSS', description: 'Framework CSS para diseño rápido, flexible y responsivo', category: 'Estilos & UI', logoHtml: '<div class="flex items-center gap-3"><svg class="w-8 h-8 text-[#38bdf8]" fill="currentColor" viewBox="0 0 24 24"><path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.336 6.182 14.975 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C7.666 17.818 9.027 19.2 12.001 19.2c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.336 13.382 8.975 12 6.001 12z"/></svg> <span class="text-2xl font-extrabold tracking-tight text-gray-900">Tailwind</span></div>' }
]

const footerLinks = [
  { title: 'Producto', items: ['Biometría y acceso', 'Personalización'] },
  { title: 'Servicios', items: ['Gestión de stock', 'Punto de ventas', 'Gestión de caja', 'Asistencia personal', 'Reportes y analítica', 'Seguridad y roles'] },
  { title: 'Recursos', items: ['Supabase', 'Vue.js', 'Node.js', 'Arduino IDE', 'Express.js', 'Tailwind.css'] }
]
</script>