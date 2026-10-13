<template>
  <div class="min-h-screen bg-[#f1f5f9] text-slate-200 p-4 md:p-8 font-sans antialiased select-none">
    <div class="max-w-6xl mx-auto space-y-6">
      <Header />

      <main class="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-24">
        
        <!-- COLUMNA IZQUIERDA -->
        <section class="lg:col-span-5 flex flex-col justify-center space-y-6">
          <div class="space-y-3">
            <h1 class="text-3xl md:text-4xl font-extrabold text-black leading-tight">
              Únete a la Red de Administradores 
              <span class="text-[#34e5eb]">Kairo Pro</span>
            </h1>
            <p class="text-black text-lg leading-relaxed">
              Solicita tu acceso y gestiona tu negocio con seguridad biométrica de vanguardia.
            </p>
          </div>

          <div class="bg-[#34e5eb] border-2 rounded-2xl p-6" style="background-color:#131b2e;">
            <h2 class="text-lg font-bold text-[#34e5eb] mb-6">Proceso de Integración</h2>
            <div class="space-y-6">
              <div class="flex items-start gap-4">
                <span class="flex items-center justify-center w-8 h-8 rounded-full border-2 text-black text-sm font-bold shrink-0" style="background-color: #34e5eb;">1</span>
                <div class="flex flex-col">
                  <h3 class="text-base font-bold text-white leading-8">Solicitud</h3>
                  <p class="text-base text-white">Completa el formulario con tus datos.</p>
                </div>
              </div>
              <div class="flex items-start gap-4">
                <span class="flex items-center justify-center w-8 h-8 rounded-full text-black text-xs font-bold shrink-0" style="background-color: #34e5eb;">2</span>
                <div class="flex flex-col">
                  <h3 class="text-base font-bold text-white leading-8">Verificación</h3>
                  <p class="text-base text-white">Evaluamos tu perfil comercial rápidamente.</p>
                </div>
              </div>
              <div class="flex items-start gap-4">
                <span class="flex items-center justify-center w-8 h-8 rounded-full text-black text-xs font-bold shrink-0" style="background-color: #34e5eb;">3</span>
                <div class="flex flex-col">
                  <h3 class="text-base font-bold text-white leading-8">Alta de Administrador</h3>
                  <p class="text-base text-white">Se generan tus credenciales de acceso seguro.</p>
                </div>
              </div>
              <div class="flex items-start gap-4">
                <span class="flex items-center justify-center w-8 h-8 rounded-full border-2 text-black text-xs font-bold shrink-0" style="background-color: #34e5eb;">4</span>
                <div class="flex flex-col">
                  <h3 class="text-base font-bold text-white leading-8">Configuración Biométrica</h3>
                  <p class="text-base text-white">Asistencia en la instalación de hardware y sistema.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- COLUMNA DERECHA: Formulario -->
        <section class="lg:col-span-7 rounded-2xl p-6 md:p-8 flex flex-col justify-between shadow-xl" style="background-color: #131b2e;">
          <div>
            <h2 class="text-2xl font-extrabold text-[#34e5eb] mb-6">Formulario de Solicitud</h2>

            <form @submit.prevent="handleSubmit" class="space-y-4">
              
              <!-- Fila 1: Nombre + Nombre del Negocio -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="space-y-5">
                  <label class="text-base font-semibold text-white">Nombre Completo</label>
                  <div class="flex items-center bg-white border border-slate-200 rounded-lg px-3 py-2.5 focus-within:border-slate-900 transition-colors shadow-sm">
                    <svg class="w-6 h-6 text-slate-400 mr-2.5 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                    </svg>
                    <input v-model="form.nombre" type="text" placeholder="Ej: Juan Pérez" required class="bg-transparent w-full text-base text-slate-800 placeholder-slate-400 outline-none" />
                  </div>
                </div>

                <div class="space-y-5">
                  <label class="text-base font-semibold text-white">Nombre del Negocio</label>
                  <div class="flex items-center bg-white border border-slate-200 rounded-lg px-3 py-2.5 focus-within:border-slate-900 transition-colors shadow-sm">
                    <svg class="w-6 h-6 text-slate-400 mr-2.5 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0h5m-5 0V12m0 0h5m-5 0H7"/>
                    </svg>
                    <input v-model="form.negocio" type="text" placeholder="Ej: Comercial Los Andes" required class="bg-transparent w-full text-base text-slate-800 placeholder-slate-400 outline-none" />
                  </div>
                </div>
              </div>

              <!-- Fila 2: Correo + Teléfono -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="space-y-5">
                  <label class="text-base font-semibold text-white">Correo Electrónico</label>
                  <div class="flex items-center bg-white border border-slate-200 rounded-lg px-3 py-2.5 focus-within:border-slate-900 transition-colors shadow-sm">
                    <svg class="w-6 h-6 text-slate-400 mr-2.5 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                    </svg>
                    <input v-model="form.email" type="email" placeholder="correo@empresa.com" required class="bg-transparent w-full text-base text-slate-800 placeholder-slate-400 outline-none" />
                  </div>
                </div>

                <div class="space-y-5">
                  <label class="text-base font-semibold text-white">Número de Teléfono</label>
                  <div class="flex items-center bg-white border border-slate-200 rounded-lg px-3 py-2.5 focus-within:border-slate-900 transition-colors shadow-sm">
                    <svg class="w-6 h-6 text-slate-400 mr-2.5 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                    </svg>
                    <input v-model="form.telefono" type="tel" placeholder="+56 9 1234 5678" required class="bg-transparent w-full text-base text-slate-800 placeholder-slate-400 outline-none" />
                  </div>
                </div>
              </div>

              <!-- Categoría del Negocio -->
              <div class="space-y-5">
                <label class="text-base font-semibold text-white">Categoría del Negocio</label>
                <div class="relative flex items-center bg-white border border-slate-200 rounded-lg px-3 py-2.5 focus-within:border-slate-900 transition-colors shadow-sm">
                  <svg class="w-6 h-6 text-slate-400 mr-2.5 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
                  </svg>
                  <select v-model="form.categoria" required class="bg-transparent w-full text-base text-slate-800 outline-none appearance-none cursor-pointer pr-6">
                    <option value="" disabled selected class="text-slate-400">Selecciona una categoría...</option>
                    <option value="retail" class="text-slate-800">Comercio / Retail</option>
                    <option value="servicios" class="text-slate-800">Servicios Profesionales</option>
                    <option value="tecnologia" class="text-slate-800">Tecnología</option>
                  </select>
                  <svg class="w-6 h-6 text-slate-400 absolute right-3 pointer-events-none" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/>
                  </svg>
                </div>
              </div>

              <!-- Mensaje / Notas adicionales -->
              <div class="space-y-5">
                <label class="text-base font-semibold text-white">Mensaje / Notas adicionales</label>
                <textarea v-model="form.mensaje" rows="4" placeholder="Describe brevemente tus necesidades o preguntas específicas..." class="w-full bg-white border border-slate-200 rounded-lg p-3 text-base text-slate-800 placeholder-slate-400 outline-none focus:border-slate-900 transition-colors resize-none shadow-sm"></textarea>
              </div>

              <!-- Feedback visual para el usuario -->
              <div v-if="statusMessage" :class="isError ? 'bg-red-500/20 text-red-300 border-red-500' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500'" class="p-3 rounded-lg border text-sm text-center">
                {{ statusMessage }}
              </div>

              <!-- Botón Submit -->
              <button 
                type="submit" 
                :disabled="loading"
                class="w-full bg-[#0a0f1d] hover:bg-[#131b2e] active:scale-[0.99] text-white font-extrabold py-3.5 px-6 rounded-xl text-base flex items-center justify-center gap-2 transition-all shadow-lg mt-2 disabled:opacity-50"
                style="background: linear-gradient(135deg, #14b8a6, #34e5eb);"
              >
                {{ loading ? 'Enviando...' : 'Enviar Solicitud' }}
                <svg v-if="!loading" class="w-4 h-4 text-[#34e5eb]" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 12L3 21l18-9L3 3l3 9zm0 0h7"/>
                </svg>
              </button>

            </form>
          </div>

        </section>

      </main>

    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import emailjs from '@emailjs/browser'
import Header from '../components/Header.vue'


const loading = ref(false)
const statusMessage = ref('')
const isError = ref(false)

const form = reactive({
  nombre: '',
  negocio: '',
  email: '',
  telefono: '',
  categoria: '',
  mensaje: ''
})

const handleSubmit = async () => {
  loading.value = true
  statusMessage.value = ''

  const SERVICE_ID = import.meta.env.VITE_SERVICE_ID 
  const TEMPLATE_ID = import.meta.env.VITE_TEMPLATE_ID
  const PUBLIC_KEY = import.meta.env.VITE_PUBLIC_KEY

  try {
    await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      {
        nombre: form.nombre,
        negocio: form.negocio,
        email: form.email,
        telefono: form.telefono,
        categoria: form.categoria,
        mensaje: form.mensaje
      },
      PUBLIC_KEY
    )

    isError.value = false
    statusMessage.value = '¡Solicitud enviada correctamente! Te responderemos pronto.'

    // Resetear formulario
    form.nombre = ''
    form.negocio = ''
    form.email = ''
    form.telefono = ''
    form.categoria = ''
    form.mensaje = ''

  } catch (error) {
    console.error('EmailJS Error:', error)
    isError.value = true
    statusMessage.value = 'Hubo un problema enviando el formulario. Intenta nuevamente.'
  } finally {
    loading.value = false
  }
}
</script>