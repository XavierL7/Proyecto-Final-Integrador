<!-- frontend/src/views/CajasView.vue -->
<template>
  <div class="p-6 max-w-5xl mx-auto">
    <HistorialSubNav />

    <h1 class="text-2xl font-bold mb-6">Cajas</h1>

    <!-- Búsqueda y filtros (los resuelve el backend sobre todos los registros) -->
    <div class="flex flex-wrap items-center gap-2 mb-3">
      <input
        v-model="filtros.q"
        type="text"
        placeholder="Buscar por N° de caja o trabajador..."
        class="h-8 px-2.5 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 flex-1 min-w-[220px]"
      />
      <select v-model="filtros.estado" class="h-8 px-2.5 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500">
        <option value="">Todos los estados</option>
        <option value="abierta">Abierta</option>
        <option value="cerrada">Cerrada</option>
      </select>
      <select v-model="filtros.modo" class="h-8 px-2.5 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500">
        <option value="">Todos los modos</option>
        <option value="sesion_inicial">Individual</option>
        <option value="por_venta">Compartida</option>
      </select>
      <label class="flex items-center gap-1 text-xs text-gray-500">
        Desde
        <input v-model="filtros.desde" type="date" class="h-8 px-2.5 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500" />
      </label>
      <label class="flex items-center gap-1 text-xs text-gray-500">
        Hasta
        <input v-model="filtros.hasta" type="date" class="h-8 px-2.5 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500" />
      </label>
      <button
        v-if="hayFiltros"
        @click="limpiarFiltros"
        class="h-8 px-2.5 text-xs text-gray-500 hover:text-red-600 border border-gray-300 rounded-md hover:bg-gray-50 transition"
      >
        ✕ Limpiar
      </button>
    </div>

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
              <td colspan="11" class="px-4 py-6 text-center text-gray-400">
                {{ hayFiltros ? 'No se encontraron cajas con esos filtros.' : 'Todavía no hay cajas registradas.' }}
              </td>
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

    <!-- Controles de paginación -->
    <div class="flex justify-between items-center mt-4">
      <span class="text-sm text-gray-500">
        Página {{ paginaActual }} de {{ totalPaginas }} ({{ totalCajas }} cajas)
      </span>
      <div class="flex gap-2">
        <button
          @click="irAPaginaAnterior"
          :disabled="paginaActual === 1"
          class="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-white text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          ← Anterior
        </button>
        <button
          @click="irAPaginaSiguiente"
          :disabled="paginaActual === totalPaginas"
          class="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-white text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          Siguiente →
        </button>
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
import { ref, computed, watch, onMounted } from 'vue'
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

// ============================================================
// PAGINACIÓN Y FILTROS (los resuelve el backend)
// ============================================================
const paginaActual = ref(1)
const totalPaginas = ref(1)
const totalCajas = ref(0)
const porPagina = 10

const filtrosVacios = () => ({ q: '', estado: '', modo: '', desde: '', hasta: '' })
const filtros = ref(filtrosVacios())
const hayFiltros = computed(() => Object.values(filtros.value).some(v => v !== ''))

const irAPaginaAnterior = () => {
  if (paginaActual.value > 1) {
    paginaActual.value--
    cargarHistorial()
  }
}

const irAPaginaSiguiente = () => {
  if (paginaActual.value < totalPaginas.value) {
    paginaActual.value++
    cargarHistorial()
  }
}

// Cada cambio de búsqueda o filtro vuelve a la página 1 (el resultado
// cambia el total de páginas). Esperamos 300 ms para no pedirle al
// servidor en cada tecla.
const aplicarFiltros = () => {
  paginaActual.value = 1
  cargarHistorial()
}

let temporizadorFiltros = null
watch(filtros, () => {
  clearTimeout(temporizadorFiltros)
  temporizadorFiltros = setTimeout(aplicarFiltros, 300)
}, { deep: true })

const limpiarFiltros = () => {
  filtros.value = filtrosVacios()
}

// Si el usuario escribe rápido pueden llegar respuestas fuera de orden:
// nos quedamos solo con la de la última petición.
let ultimaPeticion = 0

const cargarHistorial = async () => {
  const numeroPeticion = ++ultimaPeticion
  cargandoHistorial.value = true
  try {
    const response = await axios.get(`${baseUrl}/api/cajas`, {
      ...headers(),
      params: {
        page: paginaActual.value,
        limit: porPagina,
        q: filtros.value.q.trim() || undefined,
        estado: filtros.value.estado || undefined,
        modo: filtros.value.modo || undefined,
        desde: filtros.value.desde || undefined,
        hasta: filtros.value.hasta || undefined
      }
    })
    if (numeroPeticion !== ultimaPeticion) return
    cajas.value = response.data.cajas
    totalPaginas.value = response.data.totalPages
    totalCajas.value = response.data.total
  } catch (error) {
    console.error('Error cargando historial de cajas:', error)
  } finally {
    if (numeroPeticion === ultimaPeticion) cargandoHistorial.value = false
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
