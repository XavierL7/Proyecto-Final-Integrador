<!--Login -->
<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4">
    <div class="w-full max-w-sm bg-white rounded-lg shadow border border-gray-200 p-6">
      <h2 class="text-xl font-bold text-gray-800 mb-1 text-center">Proyecto Kairo</h2>
      <p class="text-sm text-gray-500 mb-6 text-center">Iniciá sesión para continuar</p>

      <!-- Selector de método de login -->
      <div class="flex gap-2 border-b border-gray-200 mb-6">
        <button
          type="button"
          @click="modo = 'password'"
          class="px-3 py-2 text-sm font-medium transition-colors"
          :class="modo === 'password'
            ? 'border-b-2 border-blue-500 text-blue-600'
            : 'text-gray-500 hover:text-gray-700'"
        >
          Contraseña
        </button>
        <button
          type="button"
          @click="activarModoHuella"
          class="px-3 py-2 text-sm font-medium transition-colors"
          :class="modo === 'huella'
            ? 'border-b-2 border-blue-500 text-blue-600'
            : 'text-gray-500 hover:text-gray-700'"
        >
          Huella dactilar
        </button>
      </div>

      <!-- ============================================================ -->
      <!-- LOGIN CON CONTRASEÑA -->
      <!-- ============================================================ -->
      <form v-if="modo === 'password'" @submit.prevent="entrarTradicional" class="space-y-3">
        <input
          type="text"
          v-model="credentials.nombre"
          placeholder="Nombre"
          required
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          v-model="credentials.apellido"
          placeholder="Apellido"
          required
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="number"
          v-model="credentials.dni"
          placeholder="DNI"
          required
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="password"
          v-model="credentials.password"
          placeholder="Contraseña"
          required
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          type="submit"
          :disabled="enviando"
          class="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
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
          class="w-16 h-16 mb-4 opacity-80"
          :class="{ 'animate-pulse': esperandoHuella }"
        />

        <p v-if="esperandoHuella" class="text-sm text-gray-600 mb-4">
          Colocá tu dedo en el lector...
        </p>
        <p v-else class="text-sm text-gray-600 mb-4">
          Acercate al lector de huellas y presioná el botón para empezar.
        </p>

        <button
          v-if="!esperandoHuella"
          type="button"
          @click="iniciarLoginPorHuella"
          class="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
        >
          Usar lector de huellas
        </button>
        <button
          v-else
          type="button"
          @click="cancelarLoginPorHuella"
          class="w-full bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition"
        >
          Cancelar
        </button>

        <p v-if="errorHuella" class="text-sm text-red-500 mt-3">{{ errorHuella }}</p>
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
    const identificado = await authStore.consultarLoginPorHuella()
    if (identificado) {
      detenerPollingHuella()
      router.push('/')
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
