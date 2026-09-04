<!-- frontend/src/components/caja/BuscadorProducto.vue -->
<template>
  <div class="mb-4">
    <div class="flex gap-2">
      <input
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

    <!-- Resultados -->
    <div v-if="resultados.length > 0" class="mt-2 rounded-lg shadow border border-gray-300 max-h-60 overflow-y-auto">
      <div
        v-for="producto in resultados"
        :key="producto.id_producto"
        class="flex justify-between items-center px-4 py-2 hover:bg-gray-200 cursor-pointer border-b border-gray-100 last:border-0"
        @click="agregar(producto)"
      >
        <div>
          <span class="font-medium">{{ producto.nombre_producto }}</span>
          <span class="text-sm">(Stock: {{ producto.stock_actual }})</span>
        </div>
        <span class="font-bold text-blue-600">${{ producto.precio_unitario }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useAuthStore } from '../../stores/auth'

const authStore = useAuthStore()
const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const busqueda = ref('')
const resultados = ref([])

const emit = defineEmits(['agregar'])

const buscarProducto = async () => {
  if (!busqueda.value.trim()) return

  try {
    const response = await axios.get(`${baseUrl}/api/productos/buscar`, {
      params: { q: busqueda.value },
      headers: { 'Authorization': `Bearer ${authStore.token}` }
    })

    // Si es un solo producto, lo ponemos en un array
    resultados.value = Array.isArray(response.data) ? response.data : [response.data]
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
}
</script>