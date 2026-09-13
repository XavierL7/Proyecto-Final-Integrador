<!-- frontend/src/components/caja/AbrirCajaModal.vue -->
<!--
  Ventana emergente que se muestra en /ventas cuando el trabajador no
  tiene ninguna caja abierta. No se puede cerrar haciendo click afuera
  ni con una X: o abre una caja, o vuelve al inicio con el botón de abajo.
-->
<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
    <div class="bg-white rounded-2xl shadow-xl border border-gray-100 max-w-md w-full p-6 relative animate-in fade-in zoom-in-95 duration-150">

      <!-- Encabezado -->
      <div class="mb-5">
        <h3 class="text-lg font-bold text-gray-800">Abrir caja</h3>
        <p class="text-xs text-gray-500 mt-1">
          Necesitás abrir una caja antes de poder registrar ventas.
        </p>
      </div>

      <label class="block text-sm mb-1 text-gray-700">Monto inicial en caja</label>
      <input
        v-model="montoInicial"
        type="number"
        step="0.01"
        placeholder="Ej: 5000"
        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 mb-1"
      />
      <p v-if="montoSugerido !== null" class="text-xs text-gray-500 mb-4">
        La última caja cerró con ${{ montoSugerido.toFixed(2) }} contados.
        <button @click="montoInicial = montoSugerido" type="button" class="text-teal-600 hover:underline">
          Usar ese monto
        </button>
      </p>
      <div v-else class="mb-4"></div>

      <label class="flex items-start gap-3 p-3 border border-gray-200 rounded-lg mb-5 cursor-pointer hover:bg-gray-50">
        <input type="checkbox" v-model="cajaCompartida" class="mt-1 w-4 h-4 text-teal-500" />
        <div>
          <p class="text-sm font-medium text-gray-800">Caja compartida</p>
          <p class="text-xs text-gray-500">
            Varios trabajadores pueden vender en esta misma caja. Cada venta
            queda pendiente hasta que alguien confirma el pago poniendo el
            dedo en el lector de huella (se registra a quien puso el dedo,
            no necesariamente a quien la abrió).
          </p>
        </div>
      </label>

      <p v-if="error" class="text-sm text-red-600 mb-4">{{ error }}</p>

      <div class="flex gap-3">
        <button
          @click="$emit('cancelar')"
          type="button"
          class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm text-gray-700"
        >
          Volver al inicio
        </button>
        <button
          @click="abrirCaja"
          :disabled="abriendo"
          class="flex-1 px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition text-sm font-semibold disabled:opacity-50"
        >
          {{ abriendo ? 'Abriendo...' : 'Abrir Caja' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useAuthStore } from '../../stores/auth'

const emit = defineEmits(['abierta', 'cancelar'])

const authStore = useAuthStore()
const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'
const headers = () => ({ headers: { 'Authorization': `Bearer ${authStore.token}` } })

const montoInicial = ref('')
const cajaCompartida = ref(false)
const abriendo = ref(false)
const error = ref('')
const montoSugerido = ref(null)

// Precarga el checkbox con el default que el admin haya guardado en
// Administración -> Configuración (modo_caja_default). El trabajador
// puede seguir cambiándolo para esta caja puntual si hace falta.
const cargarModoCajaDefault = async () => {
  try {
    const response = await axios.get(`${baseUrl}/api/configuracion`, headers())
    cajaCompartida.value = response.data.modo_caja_default === 'por_venta'
  } catch (err) {
    console.error('Error cargando el modo de caja por defecto:', err)
  }
}

// Sugerencia: lo que quedó contado (monto_final_real) en la última caja
// que se cerró. No lo forzamos -> el trabajador puede ajustarlo si hace
// falta (por ejemplo, si se retiró plata para otra cosa).
const cargarMontoSugerido = async () => {
  try {
    const response = await axios.get(`${baseUrl}/api/cajas`, headers())
    const ultimaCerrada = response.data.find(c => c.estado === 'cerrada' && c.monto_final_real !== null)
    montoSugerido.value = ultimaCerrada ? Number(ultimaCerrada.monto_final_real) : null
  } catch (err) {
    console.error('Error cargando historial de cajas:', err)
  }
}

const abrirCaja = async () => {
  if (montoInicial.value === '' || Number(montoInicial.value) < 0) {
    error.value = 'Ingresá un monto inicial válido.'
    return
  }
  error.value = ''
  abriendo.value = true
  try {
    const response = await axios.post(
      `${baseUrl}/api/cajas`,
      { monto_inicial: montoInicial.value, compartida: cajaCompartida.value },
      headers()
    )
    emit('abierta', response.data)
  } catch (err) {
    error.value = err.response?.data?.error || 'Error al abrir la caja'
  } finally {
    abriendo.value = false
  }
}

onMounted(() => {
  cargarMontoSugerido()
  cargarModoCajaDefault()
})
</script>
