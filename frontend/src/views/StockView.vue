<!-- frontend/src/views/StockView.vue -->
<template>
  <div class="p-6 max-w-6xl mx-auto">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Stock</h1>
      <button
        @click="abrirModal()"
        class="bg-blue-500 px-5 py-2 rounded-lg hover:bg-blue-600 transition shadow-sm hover:shadow"
      >
        + Nuevo Producto
      </button>
    </div>

    <!-- Barra de búsqueda -->
    <div class="mb-4">
      <input
        v-model="busqueda"
        type="text"
        placeholder="Buscar por nombre o código de barras..."
        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    <!-- Tabla de productos -->
    <div class="overflow-x-auto rounded-lg shadow">
      <table class="border-white min-w-full divide-y divide-gray-200">
        <thead class="">
          <tr>
            <th class="px-4 py-3 text-left text-xs font-medium uppercase">Código</th>
            <th class="px-4 py-3 text-left text-xs font-medium uppercase">Producto</th>
            <th class="px-4 py-3 text-left text-xs font-medium uppercase">Etiquetas</th>
            <th class="px-4 py-3 text-left text-xs font-medium uppercase">Precio</th>
            <th class="px-4 py-3 text-left text-xs font-medium uppercase">Stock</th>
            <th class="px-4 py-3 text-left text-xs font-medium uppercase">Acciones</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="producto in productosFiltrados" :key="producto.id_producto">
            <td class="px-4 py-3 text-sm">{{ producto.codigo_barras || '-' }}</td>
            <td class="px-4 py-3 text-sm">{{ producto.nombre_producto }}</td>
            <td class="px-4 py-3 text-sm">
              <!-- 👇 NUEVO SISTEMA DE ETIQUETAS -->
              <div class="flex items-center gap-1">
                <!-- Primera etiqueta (si existe) -->
                <span
                  v-if="producto.productos_etiquetas && producto.productos_etiquetas.length > 0"
                  class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                  :style="{
                    backgroundColor: colores[producto.productos_etiquetas[0].id_etiqueta % colores.length].bg,
                    color: colores[producto.productos_etiquetas[0].id_etiqueta % colores.length].text
                  }"
                >
                  {{ producto.productos_etiquetas[0].etiqueta.nombre_etiqueta }}
                </span>
                <span v-else class="text-gray-400 text-xs">Sin etiquetas</span>

                <!-- Contador de etiquetas adicionales -->
                <button
                  v-if="producto.productos_etiquetas && producto.productos_etiquetas.length > 1"
                  @click="abrirModalEtiquetas(producto)"
                  class="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold bg-blue-100 text-blue-700 hover:bg-blue-200 hover:scale-110 transition-all"
                  title="Ver más etiquetas"
                >
                  +{{ producto.productos_etiquetas.length - 1 }}
                </button>
              </div>
            </td>
            <td class="px-4 py-3 text-sm">${{ producto.precio_unitario }}</td>
            <td class="px-4 py-3 text-sm">
              <span :class="producto.stock_actual < producto.stock_minimo ? 'text-red-500 font-bold' : 'text-sm'">
                {{ producto.stock_actual }}
              </span>
              <span v-if="producto.stock_actual < producto.stock_minimo" class="text-red-500 text-xs ml-1"></span>
            </td>
            <td class="px-4 py-3 text-sm">
              <button @click="abrirModal(producto)" class="text-blue-500 hover:text-blue-700 mr-2">Editar</button>
              <button @click="eliminarProducto(producto.id_producto)" class="text-red-500 hover:text-red-700">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- ======================================================== -->
    <!-- MODAL: ETIQUETAS COMPLETAS                               -->
    <!-- ======================================================== -->
    <div
      v-if="modalEtiquetasVisible"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm"
      @click.self="modalEtiquetasVisible = false"
    >
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-fadeIn">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-bold text-gray-800">
            Etiquetas de "{{ productoEtiquetas?.nombre_producto || '' }}"
          </h3>
          <button
            @click="modalEtiquetasVisible = false"
            class="text-gray-400 hover:text-gray-600 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="flex flex-wrap gap-2">
          <span
            v-for="rel in productoEtiquetas?.productos_etiquetas || []"
            :key="rel.id_etiqueta"
            class="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium"
            :style="{
              backgroundColor: colores[rel.id_etiqueta % colores.length].bg,
              color: colores[rel.id_etiqueta % colores.length].text
            }"
          >
            {{ rel.etiqueta.nombre_etiqueta }}
            <span
              v-if="rel.etiqueta.descripcion"
              class="ml-1 text-xs opacity-60 cursor-help"
              :title="rel.etiqueta.descripcion"
            >
              ⓘ
            </span>
          </span>
          <p v-if="!productoEtiquetas?.productos_etiquetas?.length" class="text-gray-400 text-sm">
            Este producto no tiene etiquetas
          </p>
        </div>

        <div class="mt-4 flex justify-end">
          <button
            @click="modalEtiquetasVisible = false"
            class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>

    <!-- ======================================================== -->
    <!-- MODAL: PRODUCTO                                          -->
    <!-- ======================================================== -->
    <div
      v-if="modalVisible"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm"
      @click.self="modalVisible = false"
    >
      <div class="rounded-2xl shadow-2xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-bold">
            {{ editando ? 'Editar Producto' : 'Nuevo Producto' }}
          </h2>
          <button @click="modalVisible = false" class=" text-gray-400 hover:text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form @submit.prevent="guardarProducto">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium mb-1">Código de barras</label>
              <input
                v-model="form.codigo_barras"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Opcional"
              />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Nombre *</label>
              <input
                v-model="form.nombre_producto"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4 mt-3">
            <div>
              <label class="block text-sm font-medium mb-1">Precio venta *</label>
              <input
                v-model="form.precio_unitario"
                type="number"
                step="0.01"
                min="0"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Costo</label>
              <input
                v-model="form.costo_unitario"
                type="number"
                step="0.01"
                min="0"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Opcional"
              />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4 mt-3">
            <div>
              <label class="block text-sm font-medium mb-1">Stock actual *</label>
              <input
                v-model="form.stock_actual"
                type="number"
                min="0"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Stock mínimo</label>
              <input
                v-model="form.stock_minimo"
                type="number"
                min="0"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="5"
              />
            </div>
          </div>

          <div class="mt-3">
            <label class="block text-sm font-medium mb-1">Etiquetas</label>
            <div class="flex flex-wrap gap-2 p-3 border border-gray-300 rounded-lg max-h-32 overflow-y-auto">
              <label
                v-for="etiqueta in etiquetas"
                :key="etiqueta.id_etiqueta"
                class="flex items-center gap-1.5 cursor-pointer"
              >
                <input
                  type="checkbox"
                  :value="etiqueta.id_etiqueta"
                  v-model="form.etiquetas"
                  class="w-4 h-4 text-blue-500"
                />
                <span class="text-sm">{{ etiqueta.nombre_etiqueta }}</span>
              </label>
              <p v-if="etiquetas.length === 0" class="text-sm text-gray-400">No hay etiquetas disponibles</p>
            </div>
          </div>

          <div class="flex justify-end gap-3 mt-6">
            <button type="button" @click="modalVisible = false" class="px-5 py-2.5 text-gray-600 hover:text-gray-800 rounded-xl hover:bg-gray-100">
              Cancelar
            </button>
            <button type="submit" class="px-5 py-2.5 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition">
              {{ editando ? 'Actualizar' : 'Crear' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'

// Paleta de colores para etiquetas
const colores = [
  { bg: '#E3F2FD', text: '#1565C0' },
  { bg: '#E8F5E9', text: '#2E7D32' },
  { bg: '#FFF3E0', text: '#E65100' },
  { bg: '#FCE4EC', text: '#C62828' },
  { bg: '#F3E5F5', text: '#6A1B9A' },
  { bg: '#E0F7FA', text: '#00695C' },
  { bg: '#FFFDE7', text: '#F57F17' },
  { bg: '#EFEBE9', text: '#4E342E' },
  { bg: '#E8EAF6', text: '#283593' },
  { bg: '#FBE9E7', text: '#BF360C' },
]

// ============================================================
// DATOS
// ============================================================
const productos = ref([])
const etiquetas = ref([])
const busqueda = ref('')

const productosFiltrados = computed(() => {
  if (!busqueda.value) return productos.value
  const q = busqueda.value.toLowerCase()
  return productos.value.filter(p =>
    p.nombre_producto.toLowerCase().includes(q) ||
    p.codigo_barras?.includes(q)
  )
})

// ============================================================
// MODAL: PRODUCTO
// ============================================================
const modalVisible = ref(false)
const editando = ref(false)
const form = ref({
  id_producto: null,
  codigo_barras: '',
  nombre_producto: '',
  precio_unitario: '',
  costo_unitario: '',
  stock_actual: '',
  stock_minimo: '',
  etiquetas: []
})

// ============================================================
// MODAL: ETIQUETAS
// ============================================================
const modalEtiquetasVisible = ref(false)
const productoEtiquetas = ref(null)

// ============================================================
// FUNCIONES
// ============================================================
const cargarProductos = async () => {
  try {
    const response = await axios.get(`${baseUrl}/api/productos`, {
      headers: { 'Authorization': `Bearer ${authStore.token}` }
    })
    productos.value = response.data
  } catch (error) {
    console.error('Error cargando productos:', error)
  }
}

const cargarEtiquetas = async () => {
  try {
    const response = await axios.get(`${baseUrl}/api/etiquetas`, {
      headers: { 'Authorization': `Bearer ${authStore.token}` }
    })
    etiquetas.value = response.data
  } catch (error) {
    console.error('Error cargando etiquetas:', error)
  }
}

const abrirModal = (producto = null) => {
  if (producto) {
    editando.value = true
    form.value = {
      id_producto: producto.id_producto,
      codigo_barras: producto.codigo_barras || '',
      nombre_producto: producto.nombre_producto,
      precio_unitario: producto.precio_unitario,
      costo_unitario: producto.costo_unitario || '',
      stock_actual: producto.stock_actual,
      stock_minimo: producto.stock_minimo || '',
      etiquetas: producto.productos_etiquetas?.map(rel => rel.id_etiqueta) || []
    }
  } else {
    editando.value = false
    form.value = {
      id_producto: null,
      codigo_barras: '',
      nombre_producto: '',
      precio_unitario: '',
      costo_unitario: '',
      stock_actual: '',
      stock_minimo: '',
      etiquetas: []
    }
  }
  modalVisible.value = true
}

const abrirModalEtiquetas = (producto) => {
  productoEtiquetas.value = producto
  modalEtiquetasVisible.value = true
}

const guardarProducto = async () => {
  try {
    const url = editando.value
      ? `${baseUrl}/api/productos/${form.value.id_producto}`
      : `${baseUrl}/api/productos`
    const method = editando.value ? 'put' : 'post'

    const data = {
      codigo_barras: form.value.codigo_barras || null,
      nombre_producto: form.value.nombre_producto,
      precio_unitario: parseFloat(form.value.precio_unitario),
      costo_unitario: parseFloat(form.value.costo_unitario) || 0,
      stock_actual: parseInt(form.value.stock_actual),
      stock_minimo: parseInt(form.value.stock_minimo) || 5,
      etiquetas: form.value.etiquetas
    }

    await axios[method](url, data, {
      headers: { 'Authorization': `Bearer ${authStore.token}` }
    })

    modalVisible.value = false
    cargarProductos()
  } catch (error) {
    console.error('Error:', error)
    alert(error.response?.data?.error || 'Error al guardar')
  }
}

const eliminarProducto = async (id) => {
  if (!confirm('Eliminar este producto?')) return
  try {
    await axios.delete(`${baseUrl}/api/productos/${id}`, {
      headers: { 'Authorization': `Bearer ${authStore.token}` }
    })
    cargarProductos()
  } catch (error) {
    alert(error.response?.data?.error || 'Error al eliminar')
  }
}

// ============================================================
// LIFECYCLE
// ============================================================
onMounted(() => {
  cargarProductos()
  cargarEtiquetas()
})
</script>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.95) translateY(10px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}

.animate-fadeIn {
  animation: fadeIn 0.2s ease-out;
}
</style>