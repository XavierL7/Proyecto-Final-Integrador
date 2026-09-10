<!-- frontend/src/views/EstadisticasView.vue -->
<template>
  <div class="p-6 max-w-6xl mx-auto">
    <div class="flex flex-wrap justify-between items-center gap-3 mb-6">
      <h1 class="text-2xl font-bold">Estadísticas</h1>
      <div class="flex items-center gap-2">
        <input type="date" v-model="desde" class="border rounded-lg px-2 py-1 text-sm" />
        <span class="text-sm text-gray-500">a</span>
        <input type="date" v-model="hasta" class="border rounded-lg px-2 py-1 text-sm" />
        <button
          @click="cargarTodo"
          class="bg-blue-500 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-blue-600 transition"
        >
          Filtrar
        </button>
      </div>
    </div>

    <div class="flex gap-1 mb-4 border-b border-gray-200">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        @click="tabActiva = tab.id"
        class="px-4 py-2 text-sm font-medium border-b-2 -mb-px transition"
        :class="tabActiva === tab.id
          ? 'border-blue-500 text-blue-600'
          : 'border-transparent text-gray-500 hover:text-gray-700'"
      >
        {{ tab.label }}
      </button>
    </div>

    <div v-if="cargando" class="text-center py-10 text-gray-500">
      Cargando estadísticas...
    </div>

    <template v-else>
      <!-- Productos más vendidos -->
      <div v-if="tabActiva === 'productos_vendidos'" class="rounded-lg shadow overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="border-b border-gray-200 text-xs font-semibold uppercase">
                <th class="px-4 py-3 w-10">#</th>
                <th class="px-4 py-3">Producto</th>
                <th class="px-4 py-3 text-right">Unidades</th>
                <th class="px-4 py-3 text-right">Ingresos</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 text-sm">
              <tr v-if="productosVendidos.length === 0">
                <td colspan="4" class="px-4 py-6 text-center text-gray-500">
                  Sin ventas en el período seleccionado.
                </td>
              </tr>
              <tr
                v-for="(p, i) in productosVendidos"
                :key="p.id_producto"
                class="hover:bg-gray-50"
              >
                <td class="px-4 py-3 text-gray-400">{{ i + 1 }}</td>
                <td class="px-4 py-3 font-medium">{{ p.nombre_producto }}</td>
                <td class="px-4 py-3 text-right">{{ p.unidades_vendidas }}</td>
                <td class="px-4 py-3 text-right">${{ p.ingresos.toFixed(2) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Productos con más ganancia -->
      <div v-if="tabActiva === 'productos_ganancia'" class="rounded-lg shadow overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="border-b border-gray-200 text-xs font-semibold uppercase">
                <th class="px-4 py-3 w-10">#</th>
                <th class="px-4 py-3">Producto</th>
                <th class="px-4 py-3 text-right">Unidades</th>
                <th class="px-4 py-3 text-right">Ganancia</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 text-sm">
              <tr v-if="productosGanancia.length === 0">
                <td colspan="4" class="px-4 py-6 text-center text-gray-500">
                  Sin ventas en el período seleccionado.
                </td>
              </tr>
              <tr
                v-for="(p, i) in productosGanancia"
                :key="p.id_producto"
                class="hover:bg-gray-50"
              >
                <td class="px-4 py-3 text-gray-400">{{ i + 1 }}</td>
                <td class="px-4 py-3 font-medium">{{ p.nombre_producto }}</td>
                <td class="px-4 py-3 text-right">{{ p.unidades_vendidas }}</td>
                <td class="px-4 py-3 text-right font-semibold text-emerald-600">
                  ${{ p.ganancia.toFixed(2) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Vendedores -->
      <div v-if="tabActiva === 'vendedores'" class="rounded-lg shadow overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="border-b border-gray-200 text-xs font-semibold uppercase">
                <th class="px-4 py-3 w-10">#</th>
                <th class="px-4 py-3">Trabajador</th>
                <th class="px-4 py-3 text-right">Ventas</th>
                <th class="px-4 py-3 text-right">Total vendido</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 text-sm">
              <tr v-if="vendedores.length === 0">
                <td colspan="4" class="px-4 py-6 text-center text-gray-500">
                  Sin ventas en el período seleccionado.
                </td>
              </tr>
              <tr
                v-for="(v, i) in vendedores"
                :key="v.id_trabajador"
                class="hover:bg-gray-50"
              >
                <td class="px-4 py-3 text-gray-400">{{ i + 1 }}</td>
                <td class="px-4 py-3 font-medium">{{ v.nombre }}</td>
                <td class="px-4 py-3 text-right">{{ v.cantidad_ventas }}</td>
                <td class="px-4 py-3 text-right">${{ v.total_vendido.toFixed(2) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Etiquetas -->
      <div v-if="tabActiva === 'etiquetas'" class="rounded-lg shadow overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="border-b border-gray-200 text-xs font-semibold uppercase">
                <th class="px-4 py-3 w-10">#</th>
                <th class="px-4 py-3">Etiqueta</th>
                <th class="px-4 py-3 text-right">Unidades</th>
                <th class="px-4 py-3 text-right">Ingresos</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 text-sm">
              <tr v-if="etiquetas.length === 0">
                <td colspan="4" class="px-4 py-6 text-center text-gray-500">
                  Sin ventas en el período seleccionado.
                </td>
              </tr>
              <tr
                v-for="(e, i) in etiquetas"
                :key="e.id_etiqueta"
                class="hover:bg-gray-50"
              >
                <td class="px-4 py-3 text-gray-400">{{ i + 1 }}</td>
                <td class="px-4 py-3 font-medium">{{ e.nombre_etiqueta }}</td>
                <td class="px-4 py-3 text-right">{{ e.unidades_vendidas }}</td>
                <td class="px-4 py-3 text-right">${{ e.ingresos.toFixed(2) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'
const headers = () => ({ headers: { Authorization: `Bearer ${authStore.token}` } })

const tabs = [
  { id: 'productos_vendidos', label: 'Más vendidos' },
  { id: 'productos_ganancia', label: 'Más ganancia' },
  { id: 'vendedores', label: 'Vendedores' },
  { id: 'etiquetas', label: 'Etiquetas' }
]
const tabActiva = ref('productos_vendidos')

const desde = ref('')
const hasta = ref('')
const cargando = ref(false)

const productosVendidos = ref([])
const productosGanancia = ref([])
const vendedores = ref([])
const etiquetas = ref([])

const parametros = () => {
  const p = { limit: 10 }
  if (desde.value) p.desde = desde.value
  if (hasta.value) p.hasta = hasta.value
  return p
}

const cargarTodo = async () => {
  cargando.value = true
  try {
    const [rVendidos, rGanancia, rVendedores, rEtiquetas] = await Promise.all([
      axios.get(`${baseUrl}/api/estadisticas/productos-mas-vendidos`, { ...headers(), params: parametros() }),
      axios.get(`${baseUrl}/api/estadisticas/productos-mas-ganancia`, { ...headers(), params: parametros() }),
      axios.get(`${baseUrl}/api/estadisticas/vendedores-top`, { ...headers(), params: parametros() }),
      axios.get(`${baseUrl}/api/estadisticas/etiquetas-top`, { ...headers(), params: parametros() })
    ])
    productosVendidos.value = rVendidos.data
    productosGanancia.value = rGanancia.data
    vendedores.value = rVendedores.data
    etiquetas.value = rEtiquetas.data
  } catch (error) {
    console.error('Error cargando estadísticas:', error)
  } finally {
    cargando.value = false
  }
}

onMounted(cargarTodo)
</script>