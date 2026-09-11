<!-- frontend/src/views/StockView.vue -->
<template>
  <div class="p-6 max-w-6xl mx-auto">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Stock</h1>
      <button
        @click="abrirModal()"
        class="bg-blue-500 px-5 py-2 text-white rounded-lg hover:bg-blue-600 transition shadow-sm hover:shadow"
      >
        + Nuevo Producto
      </button>
    </div>

    <!-- Barra de búsqueda + filtro por etiquetas, lado a lado -->
    <div class="flex flex-col sm:flex-row gap-3 mb-4">
      <div class="flex-1">
        <label class="block text-xs font-medium text-gray-500 mb-1">Buscar</label>
        <input
          v-model="busqueda"
          type="text"
          placeholder="Nombre o código de barras..."
          class="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <!-- Filtro por etiquetas (barra de búsqueda con chips, no un listado gigante) -->
      <div class="flex-1">
        <label class="block text-xs font-medium text-gray-500 mb-1">Filtrar por etiquetas</label>
        <SelectorEtiquetas
          v-model="etiquetasFiltro"
          :etiquetas="etiquetas"
          placeholder="Buscar etiquetas para filtrar..."
        />
      </div>
    </div>

    <!-- Tabla de productos -->
    <div class="overflow-x-auto rounded-lg shadow">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="border-b border-gray-200 text-xs font-semibold uppercase">
            <th class="px-4 py-3">Código</th>
            <th class="px-4 py-3">Producto</th>
            <th class="px-4 py-3">Etiquetas</th>
            <th class="px-4 py-3">Precio</th>
            <th class="px-4 py-3">Stock</th>
            <th class="px-4 py-3 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100 text-sm">
          <tr v-if="cargando">
            <td colspan="6" class="px-4 py-6 text-center">Cargando productos...</td>
          </tr>
          <tr v-else-if="productosFiltrados.length === 0">
            <td colspan="6" class="px-4 py-6 text-center">No se encontraron productos.</td>
          </tr>
          <tr
            v-else
            v-for="producto in productosFiltrados"
            :key="producto.id_producto"
            class="hover:bg-blue-50/60 dark:hover:bg-slate-800 transition-colors duration-150"
          >
            <!-- Código -->
            <td class="px-4 py-3 whitespace-nowrap">
              {{ producto.codigo_barras || '-' }}
            </td>

            <!-- Nombre Producto -->
            <td class="px-4 py-3 font-medium whitespace-nowrap">
              {{ producto.nombre_producto }}
            </td>

            <!-- Etiquetas -->
            <td class="px-4 py-3">
              <div class="flex items-center gap-1">
                <!-- Primera etiqueta -->
                <span
                  v-if="producto.productos_etiquetas && producto.productos_etiquetas.length > 0"
                  class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium shadow-sm"
                  :style="{
                    backgroundColor: colores[producto.productos_etiquetas[0].id_etiqueta % colores.length].bg,
                    color: colores[producto.productos_etiquetas[0].id_etiqueta % colores.length].text
                  }"
                >
                  {{ producto.productos_etiquetas[0].etiqueta.nombre_etiqueta }}
                </span>
                <span v-else class="text-xs ">
                  Sin etiquetas
                </span>

                <!-- Contador de etiquetas adicionales -->
                <button
                  v-if="producto.productos_etiquetas && producto.productos_etiquetas.length > 1"
                  @click="abrirModalEtiquetas(producto)"
                  class="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold bg-blue-100 text-blue-700 hover:bg-blue-200 transition-all hover:scale-110"
                  title="Ver más etiquetas"
                >
                  +{{ producto.productos_etiquetas.length - 1 }}
                </button>
              </div>
            </td>

            <!-- Precio -->
            <td class="px-4 py-3 font-semibold whitespace-nowrap">
              ${{ Number(producto.precio_unitario).toFixed(2) }}
            </td>

           <!-- Stock -->
          <td class="px-4 py-3 whitespace-nowrap">
            <span
              class="font-bold"
              :style="{ color: Number(producto.stock_actual) < 0 ? '#ef4444' : 'inherit' }"
            >
              {{ producto.stock_actual }}
            </span>
          </td>

            <!-- Acciones -->
            <td class="px-4 py-3 text-right whitespace-nowrap">
              <div class="flex items-center justify-end gap-2">

                <!-- Botón Editar -->
                <button
                  @click="abrirModal(producto)"
                  class="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-600 transition-colors"
                  title="Editar producto"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 20h9"/>
                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
                  </svg>
                </button>
                <!-- Botón Eliminar -->
                <button
                  @click="eliminarProducto(producto.id_producto)"
                  class="flex items-center justify-center w-8 h-8 rounded-lg bg-orange-50 hover:bg-orange-100 text-orange-500 transition-colors"
                  title="Eliminar producto"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M3 6h18"/>
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                    <line x1="10" x2="10" y1="11" y2="17"/>
                    <line x1="14" x2="14" y1="11" y2="17"/>
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Controles de paginación -->
    <div class="flex justify-between items-center mt-4">
      <span class="text-sm text-gray-500">
        Página {{ paginaActual }} de {{ totalPaginas }} ({{ totalProductos }} productos)
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

    <!-- ======================================================== -->
    <!-- MODAL: ETIQUETAS COMPLETAS                               -->
    <!-- ======================================================== -->
    <div
      v-if="modalEtiquetasVisible"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm"
      @click.self="modalEtiquetasVisible = false"
    >
      <div class=" rounded-2xl shadow-2xl w-full max-w-md p-6 animate-fadeIn">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-bold">
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
            class="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>

    <!-- ======================================================== -->
    <!-- MODAL: PRODUCTO (CREAR / EDITAR)                         -->
    <!-- ======================================================== -->
    <div
      v-if="modalVisible"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm"
      @click.self="modalVisible = false"
    >
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto text-gray-800">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-bold">
            {{ editando ? 'Editar Producto' : 'Nuevo Producto' }}
          </h2>
          <button @click="modalVisible = false" class="text-gray-400 hover:text-gray-600">
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
              <label class="block  text-sm font-medium mb-1">Costo</label>
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
            <SelectorEtiquetas
              v-model="form.etiquetas"
              :etiquetas="etiquetasActivas"
              placeholder="Buscar etiquetas para agregar..."
            />
            <p v-if="etiquetasActivas.length === 0" class="text-sm text-gray-400 mt-1">
              No hay etiquetas activas disponibles
            </p>
          </div>

          <div class="flex justify-end gap-3 mt-6">
            <button type="button" @click="modalVisible = false" class="px-5 py-2.5 text-gray-600 hover:text-gray-800 rounded-xl hover:bg-gray-100 transition">
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
import { ref, computed, watch, onMounted } from 'vue'
import axios from 'axios'
import { useAuthStore } from '../stores/auth'
import SelectorEtiquetas from '../components/stock/SelectorEtiquetas.vue'

const authStore = useAuthStore()
const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'

// Paleta de colores suaves para etiquetas
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

// DATOS
const productos = ref([])
const etiquetas = ref([])
const busqueda = ref('')
const etiquetasFiltro = ref([]) // ids de etiquetas elegidas para filtrar el listado
const cargando = ref(false)

// COMPUTED: Filtra la lista de etiquetas traídas del backend para mostrar solo las activas
const etiquetasActivas = computed(() => {
  return etiquetas.value.filter(e => e.activo === true || e.activo === 1)
})

// ============================================================
// PAGINACIÓN
// ============================================================
const paginaActual = ref(1)
const totalPaginas = ref(1)
const totalProductos = ref(0)
const porPagina = 10

const productosFiltrados = computed(() => {
  if (!busqueda.value) return productos.value
  const q = busqueda.value.toLowerCase()
  return productos.value.filter(p =>
    p.nombre_producto.toLowerCase().includes(q) ||
    p.codigo_barras?.includes(q)
  )
})

const irAPaginaAnterior = () => {
  if (paginaActual.value > 1) {
    paginaActual.value--
    cargarProductos()
  }
}

const irAPaginaSiguiente = () => {
  if (paginaActual.value < totalPaginas.value) {
    paginaActual.value++
    cargarProductos()
  }
}

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

// MODAL ETIQUETAS
const modalEtiquetasVisible = ref(false)
const productoEtiquetas = ref(null)

// FUNCIONES
const cargarProductos = async () => {
  cargando.value = true
  try {
    const response = await axios.get(`${baseUrl}/api/productos`, {
      headers: { 'Authorization': `Bearer ${authStore.token}` },
      params: {
        page: paginaActual.value,
        limit: porPagina,
        etiquetas: etiquetasFiltro.value.length > 0 ? etiquetasFiltro.value.join(',') : undefined
      }
    })
    productos.value = response.data.productos
    totalPaginas.value = response.data.totalPages
    totalProductos.value = response.data.total
  } catch (error) {
    console.error('Error cargando productos:', error)
  } finally {
    cargando.value = false
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
    
    // Al editar, se conservan las etiquetas activas asociadas al producto. 
    // Si alguna etiqueta previa fue desactivada, quedará desmarcada de las disponibles para asignación activa.
    const idsEtiquetasActivas = etiquetasActivas.value.map(e => e.id_etiqueta)
    const etiquetasAsignadas = producto.productos_etiquetas
      ?.map(rel => rel.id_etiqueta)
      .filter(id => idsEtiquetasActivas.includes(id)) || []

    form.value = {
      id_producto: producto.id_producto,
      codigo_barras: producto.codigo_barras || '',
      nombre_producto: producto.nombre_producto,
      precio_unitario: producto.precio_unitario,
      costo_unitario: producto.costo_unitario || '',
      stock_actual: producto.stock_actual,
      stock_minimo: producto.stock_minimo || '',
      etiquetas: etiquetasAsignadas
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
  if (!confirm('¿Eliminar este producto?')) return
  try {
    await axios.delete(`${baseUrl}/api/productos/${id}`, {
      headers: { 'Authorization': `Bearer ${authStore.token}` }
    })
    if (productos.value.length === 1 && paginaActual.value > 1) {
      paginaActual.value--
    }
    cargarProductos()
  } catch (error) {
    alert(error.response?.data?.error || 'Error al eliminar')
  }
}

onMounted(() => {
  cargarProductos()
  cargarEtiquetas()
})

// Cuando cambia el filtro de etiquetas, volvemos a la página 1 (si no,
// podríamos quedar en una página que ya no existe para el filtro nuevo)
watch(etiquetasFiltro, () => {
  paginaActual.value = 1
  cargarProductos()
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