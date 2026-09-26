<template>
  <div class="relative min-h-screen w-full flex items-center justify-center bg-[#f1f5f9] p-4 font-montserrat">
 
    <header class="absolute top-6 right-6">
      <a href="pagina.vue" class="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-black transition-colors">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"/>
        </svg>
        Volver al Inicio
      </a>
    </header>
 
    <!-- flex-row-reverse fuerza a que el primer div quede a la izquierda si ajustamos el flujo -->
    <div class="w-full max-w-6xl bg-gray-200 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row">
 
      <!-- LADO IZQUIERDO: FORMULARIO -->
      <div class="w-full md:w-5/12 p-8 md:p-10 flex flex-col justify-center bg-[#131b2e]">
 
        <!-- Logo Kairo -->
        <div class="flex flex-col items-center mb-6">
          <div class="w-16 h-16 mb-1 flex items-center justify-center">
            <img
              src="../assets/logo.png"
              alt="Logo Kairo"
              class="w-full h-full object-contain"
            />
          </div>
          <span class="text-xs font-black tracking-widest text-white uppercase">KAIRO</span>
        </div>
 
        <h2 class="text-2xl md:text-3xl font-extrabold text-white text-center mb-6 tracking-tight">
          Inicio de Sesión
        </h2>
 
        <!-- Selector de método de login -->
        <div class="flex justify-center gap-1 mb-5 bg-white/5 rounded-full p-1">
          <button
            type="button"
            @click="modo = 'password'"
            class="flex-1 px-3 py-1.5 text-xs font-semibold rounded-full transition-colors"
            :class="modo === 'password'
              ? 'bg-gradient-to-r from-teal-500 to-cyan-400 text-white shadow'
              : 'text-slate-300 hover:text-white'"
          >
            Contraseña
          </button>
          <button
            type="button"
            @click="activarModoHuella"
            class="flex-1 px-3 py-1.5 text-xs font-semibold rounded-full transition-colors"
            :class="modo === 'huella'
              ? 'bg-gradient-to-r from-teal-500 to-cyan-400 text-white shadow'
              : 'text-slate-300 hover:text-white'"
          >
            Huella dactilar
          </button>
        </div>
 
        <!-- ============================================================ -->
        <!-- LOGIN CON CONTRASEÑA -->
        <!-- ============================================================ -->
        <form v-if="modo === 'password'" @submit.prevent="entrarTradicional" class="space-y-3.5">
 
          <!-- Nombre -->
          <div class="relative flex items-center">
            <span class="absolute left-3.5 text-gray-600">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"/>
              </svg>
            </span>
            <input
              type="text"
              v-model="credentials.nombre"
              placeholder="Nombre"
              required
              class="w-full bg-gray-300 text-gray-800 placeholder-gray-500 rounded-full py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
            />
          </div>
 
          <!-- Apellido -->
          <div class="relative flex items-center">
            <span class="absolute left-3.5 text-gray-600">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"/>
              </svg>
            </span>
            <input
              type="text"
              v-model="credentials.apellido"
              placeholder="Apellido"
              required
              class="w-full bg-gray-300 text-gray-800 placeholder-gray-500 rounded-full py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
            />
          </div>
 
          <!-- DNI -->
          <div class="relative flex items-center">
            <span class="absolute left-3.5 text-gray-600">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 2a1 1 0 00-1 1v1a1 1 0 002 0V3a1 1 0 00-1-1zM4 4a1 1 0 011 1v1a1 1 0 01-2 0V5a1 1 0 011-1zm12 0a1 1 0 011 1v1a1 1 0 11-2 0V5a1 1 0 011-1zM3 9a2 2 0 012-2h10a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" clip-rule="evenodd"/>
              </svg>
            </span>
            <input
              type="number"
              v-model="credentials.dni"
              placeholder="DNI"
              required
              class="w-full bg-gray-300 text-gray-800 placeholder-gray-500 rounded-full py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
            />
          </div>
 
          <!-- Contraseña -->
          <!-- Contraseña -->
          <div class="relative flex items-center w-full">
            <!-- Icono candado (Izquierda) -->
            <span class="absolute text-gray-600 pointer-events-none" style="left: 14px;">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"/>
              </svg>
            </span>

            <!-- Input con padding a ambos lados -->
            <input
              :type="mostrarPassword ? 'text' : 'password'"
              v-model="credentials.password"
              placeholder="Contraseña"
              required
              class="w-full bg-gray-300 text-gray-800 placeholder-gray-500 rounded-full py-2.5 pl-10 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
            />

            <!-- Botón del Ojo (Derecha forzada) -->
            <button
              type="button"
              @click="mostrarPassword = !mostrarPassword"
              class="absolute text-gray-600 hover:text-gray-800 focus:outline-none cursor-pointer"
              style="right: 14px; top: 50%; transform: translateY(-50%); z-index: 20;"
              :title="mostrarPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'"
            >
              <svg
                v-if="!mostrarPassword"
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"/>
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>

              <svg
                v-else
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"/>
              </svg>
            </button>
          </div>
          <!-- Botón de Envío -->
          <button
            type="submit"
            :disabled="enviando"
            class="w-full text-white font-bold py-2.5 rounded-full transition-colors shadow-md text-sm disabled:opacity-50"
            style="background: linear-gradient(135deg, #14b8a6, #34e5eb);"
          >
            {{ enviando ? 'Ingresando...' : 'Iniciar Sesión' }}
          </button>
        </form>
 
        <!-- ============================================================ -->
        <!-- LOGIN CON HUELLA -->
        <!-- ============================================================ -->
        <div v-else class="flex flex-col items-center text-center py-4">
          <img
            src="../assets/huella.png"
            alt="Huella dactilar"
            class="w-16 h-16 mb-4 opacity-90"
            :class="{ 'animate-pulse': esperandoHuella }"
          />
 
          <p v-if="esperandoHuella" class="text-sm text-slate-300 mb-4">
            Colocá tu dedo en el lector...
          </p>
          <p v-else class="text-sm text-slate-300 mb-4">
            Acercate al lector de huellas y presioná el botón para empezar.
          </p>
 
          <button
            v-if="!esperandoHuella"
            type="button"
            @click="iniciarLoginPorHuella"
            class="w-full text-white font-bold py-2.5 rounded-full transition-colors shadow-md text-sm"
            style="background: linear-gradient(135deg, #14b8a6, #34e5eb);"
          >
            Usar lector de huellas
          </button>
          <button
            v-else
            type="button"
            @click="cancelarLoginPorHuella"
            class="w-full bg-white/10 text-slate-200 py-2.5 rounded-full hover:bg-white/20 transition text-sm font-semibold"
          >
            Cancelar
          </button>
 
          <p v-if="errorHuella" class="text-sm text-red-400 mt-3">{{ errorHuella }}</p>
        </div>
      </div>
 
      <!-- LADO DERECHO: ILUSTRACIÓN -->
      <div class="hidden md:flex md:w-7/12 bg-[] relative items-center justify-center p-8 overflow-hidden">
        <div class="w-full h-full flex items-center justify-center">
          <img
            src="../assets/imglogin.svg"
            alt="Ilustración equipo"
            class="w-full max-w-md object-contain filter drop-shadow-xl"
          />
        </div>
      </div>
 
    </div>
  </div>
</template>
 
<script setup>
import { ref, onUnmounted } from 'vue';
import { useAuthStore } from '../stores/auth'; //autorizacion
import { useRouter } from 'vue-router'; //router
 
const authStore = useAuthStore(); //autorizacion de ponia
const router = useRouter(); //para acceder a otras rutas
 
const modo = ref('password') // 'password' | 'huella'
const mostrarPassword = ref(false)

 
// ============================================================
// LOGIN CON CONTRASEÑA
// ============================================================
const credentials = ref({  //credenciales del usuario que se usan en cont resultado =
  nombre: '', 
  apellido: '', 
  dni: '',    
  password: '' 
});
const enviando = ref(false)
 
//fuuncion encargada de verificar que existis como usuario
const entrarTradicional = async () => {
  enviando.value = true
  const resultado = await authStore.loginConContrasena(credentials.value); //resultado es = a la funcion loginConContrasena del auth.js en stores
  enviando.value = false
 
  if (resultado.success) {
    router.push('/'); //si seinicio sesion te envia a / que es el dashboard
  } else {
    alert(resultado.message || 'Error al iniciar sesión');
  }
};
 
// ============================================================
// LOGIN CON HUELLA
// ============================================================
const esperandoHuella = ref(false)
const errorHuella = ref('')
let intervaloHuella = null
let timeoutHuella = null
 
const INTERVALO_MS = 2000
const TIMEOUT_MS = 25000
 
const activarModoHuella = () => {
  modo.value = 'huella'
  errorHuella.value = ''
}
 
const detenerPollingHuella = () => {
  clearInterval(intervaloHuella)
  clearTimeout(timeoutHuella)
  intervaloHuella = null
  timeoutHuella = null
  esperandoHuella.value = false
}
 
const iniciarLoginPorHuella = () => {
  errorHuella.value = ''
  esperandoHuella.value = true
 
  intervaloHuella = setInterval(async () => {
    const { encontrado, error } = await authStore.consultarLoginPorHuella()
    if (encontrado) {
      detenerPollingHuella()
      router.push('/')
    } else if (error) {
      detenerPollingHuella()
      errorHuella.value = error
    }
  }, INTERVALO_MS)
 
  timeoutHuella = setTimeout(() => {
    detenerPollingHuella()
    errorHuella.value = 'No se detectó ninguna huella. Probá de nuevo o usá tu contraseña.'
  }, TIMEOUT_MS)
}
 
const cancelarLoginPorHuella = () => {
  detenerPollingHuella()
}
 
// Por si el usuario cambia de pantalla con el polling activo
onUnmounted(() => {
  detenerPollingHuella()
})
</script>
 