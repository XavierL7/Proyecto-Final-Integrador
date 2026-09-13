<!-- frontend/src/components/caja/CerrarCajaModal.vue -->
<!--
  Ventana emergente que se abre al apretar "Cerrar Caja" en /ventas.
  Al confirmar, cierra la caja activa, desloguea al trabajador y vuelve
  a la página principal (cerrar caja = terminar el turno).
-->
<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4"
    @click.self="$emit('cancelar')"
  >
    <div class="bg-white rounded-2xl shadow-xl border border-gray-100 max-w-md w-full p-6 relative animate-in fade-in zoom-in-95 duration-150">

      <!-- Botón de Cierre -->
      <button
        @click="$emit('cancelar')"
        class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 font-bold text-lg w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition"
        title="Cancelar"
      >
        ✕
      </button>

      <!-- Encabezado -->
      <div class="mb-5">
        <h3 class="text-lg font-bold text-gray-800">Cerrar caja</h3>
        <p v-if="cajaActiva" class="text-xs text-gray-500 mt-1">
          Caja #{{ cajaActiva.id_caja }} · abierta el {{ formatearFecha(cajaActiva.fecha_hora_apertura) }}
        </p>
      </div>

      <label class="block text-sm mb-1 text-gray-700">
        Monto real contado en el cajón (opcional)
      </label>
      <input
        v-model="montoFinalReal"
        type="number"
        step="0.01"
        placeholder="Ej: 15000"
        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 mb-1"
      />
      <p class="text-xs text-gray-500 mb-4">
        Si no lo completás, la caja igual se cierra y podés cargar el conteo después.
      </p>

      <label class="block text-sm mb-1 text-gray-700">Observaciones (opcional)</label>
      <textarea
        v-model="observaciones"
        rows="2"
        placeholder="Ej: faltaron $200, se usaron para comprar hielo"
        class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 mb-4 text-sm"
      ></textarea>

      <p v-if="error" class="text-sm text-red-600 mb-4">{{ error }}</p>

      <div class="flex gap-3">
        <button
          @click="$emit('cancelar')"
          type="button"
          class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm text-gray-700"
        >
          Cancelar
        </button>
        <button
          @click="confirmarCierre"
          :disabled="cerrando || !cajaActiva"
          class="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm font-semibold disabled:opacity-50"
        >
          {{ cerrando ? 'Cerrando...' : 'Confirmar cierre y salir' }}
        </button>
      </div>
      <p class="text-xs text-gray-500 mt-3">
        Al confirmar, se cierra tu sesión y volvés a la página principal.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useAuthStore } from '../../stores/auth'

const props = defineProps({
  cajaActiva: { type: Object, default: null }
})

const emit = defineEmits(['cerrada', 'cancelar'])

const authStore = useAuthStore()
const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'
const headers = () => ({ headers: { 'Authorization': `Bearer ${authStore.token}` } })

const montoFinalReal = ref('')
const observaciones = ref('')
const cerrando = ref(false)
const error = ref('')

const confirmarCierre = async () => {
  if (!props.cajaActiva) return
  error.value = ''
  cerrando.value = true
  try {
    const response = await axios.put(
      `${baseUrl}/api/cajas/${props.cajaActiva.id_caja}/cerrar`,
      {
        monto_final_real: montoFinalReal.value !== '' ? montoFinalReal.value : null,
        observaciones: observaciones.value.trim() || null
      },
      headers()
    )

    if (response.data.diferencia !== null && response.data.diferencia !== undefined) {
      const dif = response.data.diferencia
      if (dif !== 0) {
        alert(dif > 0
          ? `Caja cerrada. Sobraron $${dif.toFixed(2)} respecto de lo esperado.`
          : `Caja cerrada. Faltaron $${Math.abs(dif).toFixed(2)} respecto de lo esperado.`)
      } else {
        alert('Caja cerrada. El conteo coincide exactamente con lo esperado.')
      }
    } else {
      alert('Caja cerrada correctamente.')
    }

    emit('cerrada')
  } catch (err) {
    error.value = err.response?.data?.error || 'Error al cerrar la caja'
  } finally {
    cerrando.value = false
  }
}

const formatearFecha = (fecha) => {
  return new Date(fecha).toLocaleString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>
