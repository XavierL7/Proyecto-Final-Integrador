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

    <!-- Búsqueda y filtros (los resuelve el backend sobre todos los registros) -->
    <div class="flex flex-wrap items-center gap-2 mb-3">
      <input
        v-model="filtros.q"
        type="text"
        placeholder="Descripción, N° de caja o trabajador..."
        class="h-8 px-2.5 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 flex-1 min-w-[220px]"
      />
      <select v-model="filtros.tipo" class="h-8 px-2.5 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500">
        <option value="">Todos los tipos</option>
        <option value="ingreso">Ingresos</option>
        <option value="egreso">Egresos</option>
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
              <td colspan="6" class="px-4 py-6 text-center text-gray-400">
                {{ hayFiltros ? 'No se encontraron movimientos con esos filtros.' : 'Todavía no hay movimientos manuales registrados.' }}
              </td>
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

    <!-- Controles de paginación -->
    <div class="flex justify-between items-center mt-4">
      <span class="text-sm text-gray-500">
        Página {{ paginaActual }} de {{ totalPaginas }} ({{ totalMovimientos }} movimientos)
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
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import axios from 'axios'
import { useAuthStore } from '../stores/auth'
import HistorialSubNav from '../components/historial/HistorialSubNav.vue'

const authStore = useAuthStore()
const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'
const headers = () => ({ headers: { 'Authorization': `Bearer ${authStore.token}` } })

const movimientos = ref([])
const cargando = ref(false)

// ============================================================
// PAGINACIÓN Y FILTROS (los resuelve el backend)
// ============================================================
const paginaActual = ref(1)
const totalPaginas = ref(1)
const totalMovimientos = ref(0)
const porPagina = 10

const filtrosVacios = () => ({ q: '', tipo: '', desde: '', hasta: '' })
const filtros = ref(filtrosVacios())
const hayFiltros = computed(() => Object.values(filtros.value).some(v => v !== ''))

const irAPaginaAnterior = () => {
  if (paginaActual.value > 1) {
    paginaActual.value--
    cargarMovimientos()
  }
}

const irAPaginaSiguiente = () => {
  if (paginaActual.value < totalPaginas.value) {
    paginaActual.value++
    cargarMovimientos()
  }
}

// Cada cambio de búsqueda o filtro vuelve a la página 1 (el resultado
// cambia el total de páginas). Esperamos 300 ms para no pedirle al
// servidor en cada tecla.
const aplicarFiltros = () => {
  paginaActual.value = 1
  cargarMovimientos()
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
  const numeroPeticion = ++ultimaPeticion
  cargando.value = true
  try {
    const response = await axios.get(`${baseUrl}/api/cajas/movimientos/historial`, {
      ...headers(),
      params: {
        page: paginaActual.value,
        limit: porPagina,
        q: filtros.value.q.trim() || undefined,
        tipo: filtros.value.tipo || undefined,
        desde: filtros.value.desde || undefined,
        hasta: filtros.value.hasta || undefined
      }
    })
    if (numeroPeticion !== ultimaPeticion) return
    movimientos.value = response.data.movimientos
    totalPaginas.value = response.data.totalPages
    totalMovimientos.value = response.data.total
  } catch (error) {
    console.error('Error cargando historial de movimientos de caja:', error)
  } finally {
    if (numeroPeticion === ultimaPeticion) cargando.value = false
  }
}

onMounted(() => {
  cargarMovimientos()
})
</script>
