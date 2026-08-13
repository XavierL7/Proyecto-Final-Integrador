<template>
  <div class="bg-[#dcdcdc] text-gray-800 antialiased">
    <!-- BANNER STACK -->
    <section class="bg-[#11161d] text-white overflow-hidden py-12 md:py-16">
      <div class="max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        <div class="md:col-span-8 space-y-6">
          <h1 class="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight">
            Construido con tecnología <br>
            pensada <span class="text-[#00bcd4]">para durar.</span>
          </h1>
          <p class="text-gray-400 text-sm md:text-base leading-relaxed max-w-2xl font-normal">
            Stack moderno, probado y abierto. KAIRO se apoya en herramientas de primer nivel para garantizar rendimiento, seguridad y escalabilidad.
          </p>
        </div>

        <div class="md:col-span-4 flex justify-end items-end relative -mb-12 md:-mb-16">
          <img 
            src="../../assets/mujer.png" 
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
          <p class="text-gray-700 text-sm md:text-base leading-relaxed font-normal">
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
              <p class="text-xs text-gray-800 font-medium leading-relaxed">
                {{ tech.description }}
              </p>
            </div>
            <span class="text-xs font-semibold text-[#4f46e5] tracking-wide mt-4">// {{ tech.category }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- FOOTER -->
    <footer class="bg-[#050c1a] text-white pt-16 pb-8 border-t border-gray-800">
      <div class="max-w-7xl mx-auto px-6 lg:px-12 space-y-12">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          <div class="lg:col-span-5 space-y-6">
            <div class="flex items-center">
              <img src="../../assets/logo.png" alt="Logo KAIRO" class="h-20 w-auto object-contain" />
            </div>
            <p class="text-xs text-gray-300 leading-relaxed font-normal pr-4">
              KAIRO es el proyecto final de un equipo de desarrollo de último año de la Escuela Técnica N° 24 "Simón de Iriondo". Lo construimos para egresarnos, pero también para entender de primera mano qué significa trabajar en un entorno real...
            </p>
          </div>

          <div class="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div v-for="group in footerLinks" :key="group.title" class="space-y-4">
              <div class="bg-[#14b8a6] text-white font-bold text-center py-2 px-4 rounded-full text-sm shadow">
                {{ group.title }}
              </div>
              <ul class="space-y-3 text-xs text-gray-300 font-medium">
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
</template>

<script setup>
const techStack = [
  { name: 'Supabase', description: 'Motor relacional robusto y seguro', category: 'Base de datos', logoHtml: '<span class="text-[#3ecf8e]">⚡</span> supabase' },
  { name: 'Vue.js', description: 'Interfaz de usuario y Aplicación Web', category: 'Frontend', logoHtml: '<span class="text-[#41b883]">💚</span> Vue.js' },
  { name: 'Node.js', description: 'Entorno de ejecución para javascript', category: 'Frontend & Backend', logoHtml: 'node<span class="text-xs bg-[#539e43] text-white px-1 rounded ml-1">JS</span>' },
  { name: 'Arduino', description: 'Programar el microcontrolador para interactuar entre el lector y el sistema', category: 'Hardware', logoHtml: '<span class="text-[#00979d]">♾️ ARDUINO</span>' },
  { name: 'Express.js', description: 'Puente central en todas las partes del sistema', category: 'Backend', logoHtml: 'Express <span class="bg-black text-white text-xs px-2 py-1 rounded">JS</span>' }
]

const footerLinks = [
  { title: 'Producto', items: ['Biometría y acceso', 'Personalización'] },
  { title: 'Servicios', items: ['Gestión de stock', 'Punto de ventas', 'Gestión de caja', 'Asistencia personal', 'Reportes y analítica', 'Seguridad y roles'] },
  { title: 'Recursos', items: ['Supabase', 'Vue.js', 'Node.js', 'Arduino IDE', 'Express.js'] }
]
</script>