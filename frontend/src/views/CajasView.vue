<!-- frontend/src/views/CajasView.vue -->
<template>
  <div class="p-6 max-w-5xl mx-auto">
    <HistorialSubNav />

    <h1 class="text-2xl font-bold mb-6">Cajas</h1>

    <!-- ============================================================ -->
    <!-- HISTORIAL DE CAJAS -->
    <!-- ============================================================ -->
    <div class=" rounded-lg shadow overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class=" border-b border-gray-200 text-xs font-semibold uppercase">
              <th class="px-4 py-3">#</th>
              <th class="px-4 py-3">Modo</th>
              <th class="px-4 py-3">Apertura</th>
              <th class="px-4 py-3">Cierre</th>
              <th class="px-4 py-3">Abrió</th>
              <th class="px-4 py-3">Cerró</th>
              <th class="px-4 py-3 text-right">Inicial</th>
              <th class="px-4 py-3 text-right">Esperado</th>
              <th class="px-4 py-3 text-right">Real</th>
              <th class="px-4 py-3">Estado</th>
              <th class="px-4 py-3">Observaciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 text-sm">
            <tr v-if="cargandoHistorial">
              <td colspan="11" class="px-4 py-6 text-center text-gray-400">Cargando...</td>
            </tr>
            <tr v-else-if="cajas.length === 0">
              <td colspan="11" class="px-4 py-6 text-center text-gray-400">Todavía no hay cajas registradas.</td>
            </tr>
            <tr
              v-for="caja in cajas"
              :key="caja.id_caja"
              @click="abrirDetalle(caja)"
              class="hover:bg-blue-50 cursor-pointer transition"
            >
              <td class="px-4 py-3 ">#{{ caja.id_caja }}</td>
              <td class="px-4 py-3">
                <span
                  class="text-xs font-semibold px-2 py-1 rounded"
                  :class="caja.modo_autenticacion === 'por_venta' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'"
                >
                  {{ caja.modo_autenticacion === 'por_venta' ? 'Compartida' : 'Individual' }}
                </span>
              </td>
              <td class="px-4 py-3 whitespace-nowrap">{{ formatearFecha(caja.fecha_hora_apertura) }}</td>
              <td class="px-4 py-3 whitespace-nowrap">
                {{ caja.fecha_hora_cierre ? formatearFecha(caja.fecha_hora_cierre) : '-' }}
              </td>
              <td class="px-4 py-3 whitespace-nowrap">
                {{ caja.trabajador_apertura?.nombre }} {{ caja.trabajador_apertura?.apellido }}
              </td>
              <td class="px-4 py-3 whitespace-nowrap">
                {{ caja.trabajador_cierre ? `${caja.trabajador_cierre.nombre} ${caja.trabajador_cierre.apellido}` : '-' }}
              </td>
              <td class="px-4 py-3 text-right">${{ Number(caja.monto_inicial).toFixed(2) }}</td>
              <td class="px-4 py-3 text-right">
                {{ caja.monto_final_esperado !== null ? `$${Number(caja.monto_final_esperado).toFixed(2)}` : '-' }}
              </td>
              <td class="px-4 py-3 text-right">
                {{ caja.monto_final_real !== null ? `$${Number(caja.monto_final_real).toFixed(2)}` : '-' }}
              </td>
              <td class="px-4 py-3">
                <span
                  class="text-xs font-semibold px-2 py-1 rounded"
                  :class="caja.estado === 'abierta' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-red-700'"
                >
                  {{ caja.estado }}
                </span>
              </td>
              <td class="px-4 py-3 text-xs max-w-xs">
                {{ caja.arqueos_caja?.[0]?.observaciones || '-' }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <DetalleCajaModal
      :visible="modalDetalleVisible"
      :id-caja="idCajaSeleccionada"
      @close="cerrarDetalle"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useAuthStore } from '../stores/auth'
import DetalleCajaModal from '../components/caja/DetalleCajaModal.vue'
import HistorialSubNav from '../components/historial/HistorialSubNav.vue'

const authStore = useAuthStore()
const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const headers = () => ({ headers: { 'Authorization': `Bearer ${authStore.token}` } })

// ============================================================
// HISTORIAL
// ============================================================
const cajas = ref([])
const cargandoHistorial = ref(true)

const cargarHistorial = async () => {
  cargandoHistorial.value = true
  try {
    const response = await axios.get(`${baseUrl}/api/cajas`, headers())
    cajas.value = response.data
  } catch (error) {
    console.error('Error cargando historial de cajas:', error)
  } finally {
    cargandoHistorial.value = false
  }
}

// ============================================================
// MODAL DE DETALLE
// ============================================================
const modalDetalleVisible = ref(false)
const idCajaSeleccionada = ref(null)

const abrirDetalle = (caja) => {
  idCajaSeleccionada.value = caja.id_caja
  modalDetalleVisible.value = true
}

const cerrarDetalle = () => {
  modalDetalleVisible.value = false
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

onMounted(() => {
  cargarHistorial()
})
</script>
