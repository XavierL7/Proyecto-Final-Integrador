<template>
  <div 
    class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4"
    @click.self="$emit('cerrar')"
  >
    <div class="bg-white rounded-2xl shadow-xl border border-gray-100 max-w-sm w-full p-6 relative animate-in fade-in zoom-in-95 duration-150">
      
      <!-- Botón de Cierre -->
      <button 
        @click="$emit('cerrar')"
        class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 font-bold text-lg w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition"
        title="Cerrar ventana"
      >
        ✕
      </button>

      <!-- Encabezado -->
      <div class="flex items-center gap-3 mb-5">
        <div>
          <h3 class="text-lg font-bold text-gray-800">Dinero Estimado en Caja</h3>
          <p class="text-xs text-gray-500">Resumen en tiempo real del turno activo</p>
        </div>
      </div>

      <!-- Estado Cargando -->
      <div v-if="cargando" class="flex flex-col items-center justify-center py-8 gap-2">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
        <span class="text-xs text-gray-400">Consultando estado de caja...</span>
      </div>

      <!-- Estado Error -->
      <div v-else-if="error" class="bg-red-50 text-red-600 border border-red-200 p-3 rounded-xl text-sm text-center my-2">
        {{ error }}
      </div>

      <!-- Contenido del Resumen -->
      <div v-else-if="resumen" class="space-y-4">
        
        <!-- Tarjeta del Total Estimado -->
        <div class="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl p-4 text-white shadow-md text-center">
          <span class="text-xs font-medium opacity-90 uppercase tracking-wider">Monto Total Estimado</span>
          <div class="text-3xl font-black mt-1">
            ${{ resumen.total_en_caja.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
          </div>
        </div>

        <!-- Muestra del Inicial y Desglose por Método -->
        <div>
          
          <div class="flex justify-between items-center text-gray-600">
            <span class="text-xs font-semibold text-gray-500">Monto Inicial de Apertura</span>
            <span class="font-medium text-gray-800">
              ${{ resumen.monto_inicial.toLocaleString('es-AR', { minimumFractionDigits: 2 }) }}
            </span>
          </div>

          <div class="border-t border-gray-200 pt-2">
            <span class="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">
              Ingresos por Ventas
            </span>

            <div v-if="resumen.desglose && resumen.desglose.length > 0" class="space-y-1.5">
              <div 
                v-for="(item, idx) in resumen.desglose" 
                :key="idx"
                class="flex justify-between items-center text-xs"
              >
                <span class="text-gray-600 font-medium">{{ item.metodo_pago }}</span>
                <span class="font-bold text-gray-800">
                  ${{ item.monto.toLocaleString('es-AR', { minimumFractionDigits: 2 }) }}
                </span>
              </div>
            </div>

            <p v-else class="text-xs text-gray-400 italic text-center py-1">
              Sin ventas registradas
            </p>
          </div>

          <div class="border-t border-gray-200 pt-2 flex justify-between items-center font-bold text-gray-800">
            <span>Total Recaudado</span>
            <span class="text-emerald-600">
              +${{ resumen.total_ventas.toLocaleString('es-AR', { minimumFractionDigits: 2 }) }}
            </span>
          </div>

        </div>

        <button
          @click="$emit('cerrar')"
          class="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition text-sm"
        >
          Entendido
        </button>

      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useAuthStore } from '../../stores/auth'

const emit = defineEmits(['cerrar'])

const authStore = useAuthStore()
const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'
const getHeaders = () => ({ headers: { 'Authorization': `Bearer ${authStore.token}` } })

const resumen = ref(null)
const cargando = ref(true)
const error = ref('')

const obtenerResumenCaja = async () => {
  cargando.value = true
  error.value = ''
  try {
    const response = await axios.get(`${baseUrl}/api/cajas/activa/resumen-dinero`, getHeaders())
    resumen.value = response.data
  } catch (err) {
    console.error('Error al obtener el dinero en caja:', err)
    error.value = err.response?.data?.error || 'No se pudo cargar la información de la caja.'
  } finally {
    cargando.value = false
  }
}

onMounted(() => {
  obtenerResumenCaja()
})
</script>