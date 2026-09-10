<!-- frontend/src/components/caja/BuscadorProducto.vue -->
<template>
  <div class="mb-4">
    <div class="flex gap-2">
      <input
        ref="inputRef"
        v-model="busqueda"
        type="text"
        placeholder="Buscar por código de barras o nombre..."
        class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        @keyup.enter="buscarProducto"
      />
      <button
        @click="buscarProducto"
        class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
      >
        Buscar
      </button>
    </div>


    <!-- Resultados desplegables -->
    <div
      v-if="resultados.length > 0"
      class="mt-2 rounded-lg shadow-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 max-h-60 overflow-y-auto divide-y divide-gray-100 dark:divide-slate-700"
    >
      <div
        v-for="producto in resultados"
        :key="producto.id_producto"
        class="flex justify-between items-center px-4 py-2.5 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
        @click="agregar(producto)"
      >
        <div class="text-slate-800 dark:text-slate-100">
          <span class="font-medium">{{ producto.nombre_producto }}</span>
          <span class="text-sm text-gray-500 dark:text-gray-400 ml-1">
            (Stock: {{ producto.stock_actual }})
          </span>
        </div>
        <span class="font-bold text-blue-600 dark:text-blue-400">
          ${{ producto.precio_unitario }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import axios from 'axios'
import { useAuthStore } from '../../stores/auth'

const authStore = useAuthStore()
const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const busqueda = ref('')
const resultados = ref([])
const inputRef = ref(null)

const emit = defineEmits(['agregar'])

const enfocarBusqueda = () => {
  inputRef.value?.focus()
}

const buscarProducto = async () => {
  if (!busqueda.value.trim()) return

  const termino = busqueda.value.trim()

  try {
    const response = await axios.get(`${baseUrl}/api/productos/buscar`, {
      params: { q: termino },
      headers: { 'Authorization': `Bearer ${authStore.token}` }
    })

    const datos = Array.isArray(response.data) ? response.data : [response.data]

    // Si el lector de código de barras escaneó un código que matchea
    // exacto con un producto, lo agregamos directo sin mostrar el
    // desplegable (el lector ya manda el Enter por su cuenta).
    const coincidenciaExacta = datos.find(p => p.codigo_barras === termino)
    if (coincidenciaExacta) {
      agregar(coincidenciaExacta)
      return
    }

    resultados.value = datos
  } catch (error) {
    if (error.response?.status === 404) {
      resultados.value = []
      alert('Producto no encontrado')
    } else {
      console.error('Error buscando producto:', error)
    }
  }
}

const agregar = (producto) => {
  emit('agregar', producto)
  resultados.value = []
  busqueda.value = ''
  enfocarBusqueda()
}

// Devuelve el foco a la barra de búsqueda apenas nada más quede
// seleccionado en la página (click en un área vacía, cierre de un
// desplegable, etc.), para no tener que clickear el input cada vez
// que se escanea o se tipea un código.
let timeoutRefoco = null

const manejarFocusOut = () => {
  clearTimeout(timeoutRefoco)
  timeoutRefoco = setTimeout(() => {
    if (document.activeElement === document.body) {
      enfocarBusqueda()
    }
  }, 50)
}

defineExpose({ focus: enfocarBusqueda })

onMounted(() => {
  enfocarBusqueda()
  document.addEventListener('focusout', manejarFocusOut)
})

onUnmounted(() => {
  document.removeEventListener('focusout', manejarFocusOut)
  clearTimeout(timeoutRefoco)
})
</script>