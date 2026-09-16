<!-- frontend/src/views/HistorialMovimientosCajaView.vue -->
<template>
  <div class="p-6 max-w-6xl mx-auto">
    <HistorialSubNav />

    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Movimientos de Caja</h1>
      <button
        @click="cargarMovimientos"
        class="text-sm text-blue-500 hover:text-blue-700"
      >
        Actualizar
      </button>
    </div>

    <div class="rounded-lg shadow overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-gray-200 text-xs font-semibold uppercase">
              <th class="px-4 py-3">Fecha y hora</th>
              <th class="px-4 py-3">Caja</th>
              <th class="px-4 py-3">Tipo</th>
              <th class="px-4 py-3">Descripción</th>
              <th class="px-4 py-3">Registrado por</th>
              <th class="px-4 py-3 text-right">Monto</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 text-sm">
            <tr v-if="cargando">
              <td colspan="6" class="px-4 py-6 text-center text-gray-400">Cargando movimientos...</td>
            </tr>
            <tr v-else-if="movimientos.length === 0">
              <td colspan="6" class="px-4 py-6 text-center text-gray-400">Todavía no hay movimientos manuales registrados.</td>
            </tr>
            <tr
              v-for="mov in movimientos"
              :key="mov.id_movimiento"
              class="hover:bg-blue-50 transition"
            >
              <td class="px-4 py-3 whitespace-nowrap">{{ formatearFecha(mov.fecha_hora) }}</td>
              <td class="px-4 py-3 whitespace-nowrap">
                #{{ mov.caja?.id_caja }}
                <span
                  v-if="mov.caja"
                  class="ml-1 text-[10px] font-semibold px-1.5 py-0.5 rounded align-middle"
                  :class="mov.caja.modo_autenticacion === 'por_venta' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'"
                >
                  {{ mov.caja.modo_autenticacion === 'por_venta' ? 'Compartida' : 'Individual' }}
                </span>
              </td>
              <td class="px-4 py-3">
                <span
                  class="text-xs font-semibold px-2 py-1 rounded"
                  :class="mov.tipo_movimiento === 'ingreso' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'"
                >
                  {{ mov.tipo_movimiento === 'ingreso' ? 'Ingreso' : 'Egreso' }}
                </span>
              </td>
              <td class="px-4 py-3">{{ mov.descripcion || '-' }}</td>
              <td class="px-4 py-3 whitespace-nowrap">
                {{ mov.trabajador?.nombre }} {{ mov.trabajador?.apellido }}
              </td>
              <td
                class="px-4 py-3 text-right font-semibold whitespace-nowrap"
                :class="mov.tipo_movimiento === 'ingreso' ? 'text-emerald-600' : 'text-red-600'"
              >
                {{ mov.tipo_movimiento === 'ingreso' ? '+' : '-' }}${{ Number(mov.monto).toFixed(2) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useAuthStore } from '../stores/auth'
import HistorialSubNav from '../components/historial/HistorialSubNav.vue'

const authStore = useAuthStore()
const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'
const headers = () => ({ headers: { 'Authorization': `Bearer ${authStore.token}` } })

const movimientos = ref([])
const cargando = ref(false)

const formatearFecha = (fecha) => {
  return new Date(fecha).toLocaleString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const cargarMovimientos = async () => {
  cargando.value = true
  try {
    const response = await axios.get(`${baseUrl}/api/cajas/movimientos/historial`, headers())
    movimientos.value = response.data
  } catch (error) {
    console.error('Error cargando historial de movimientos de caja:', error)
  } finally {
    cargando.value = false
  }
}

onMounted(() => {
  cargarMovimientos()
})
</script>
