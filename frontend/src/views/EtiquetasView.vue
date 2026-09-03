<!-- frontend/src/views/EtiquetasView.vue -->
<template>
  <div class="p-6 max-w-4xl mx-auto">
    <h1 class="text-2xl font-bold mb-6">Etiquetas</h1>

    <!-- Barra de búsqueda y botón -->
    <div class="flex  flex-wrap gap-3 mb-6">
      <div class="flex-1 min-w-[200px] relative">
        <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
        </span>
        <input
          v-model="busqueda"
          type="text"
          placeholder="Buscar etiqueta..."
          class="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
        />
      </div>
      <button
        @click="abrirModal()"
        class="bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600 transition shadow-sm hover:shadow"
      >
        + Nueva Etiqueta
      </button>
    </div>

    <!-- Grilla de etiquetas -->
    <div class="flex flex-wrap gap-2">
      <div
        v-for="etiqueta in etiquetasFiltradas"
        :key="etiqueta.id_etiqueta"
        class="etiqueta-item group relative inline-flex items-center gap-1 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200"
        :style="{
          backgroundColor: colores[etiqueta.id_etiqueta % colores.length].bg,
          color: colores[etiqueta.id_etiqueta % colores.length].text,
          borderColor: colores[etiqueta.id_etiqueta % colores.length].border
        }"
        style="border: 1px solid transparent;"
      >
        <!-- Nombre de la etiqueta -->
        <span>{{ etiqueta.nombre_etiqueta }}</span>

        <!-- Tooltip con descripcion SOLO AL HOVER -->
        <div
          v-if="etiqueta.descripcion"
          class="etiqueta-tooltip absolute -top-10 left-1/2 -translate-x-1/2 pointer-events-none z-10"
        >
          <div class="bg-gray-800 text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap shadow-lg">
            {{ etiqueta.descripcion }}
            <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45"></div>
          </div>
        </div>

        <!-- Acciones (aparecen al hacer hover sobre la etiqueta) -->
        <div class="etiqueta-acciones flex items-center gap-0.5">
          <button
            @click="abrirModal(etiqueta)"
            class="hover:scale-110 transition-transform p-0.5 rounded hover:bg-black/5"
            title="Editar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            @click="eliminarEtiqueta(etiqueta.id_etiqueta)"
            class="hover:scale-110 transition-transform p-0.5 rounded hover:bg-black/5 hover:text-red-600"
            title="Eliminar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Mensaje sin resultados -->
      <div v-if="etiquetasFiltradas.length === 0 && etiquetas.length > 0" class="w-full text-center py-12">
        <p class="text-gray-500">No hay etiquetas que coincidan con <span class="font-medium">"{{ busqueda }}"</span></p>
      </div>

      <div v-if="etiquetas.length === 0" class="w-full text-center py-12">
        <p class="text-gray-400">No hay etiquetas. Crea la primera.</p>
      </div>
    </div>

    <!-- ======================================================== -->
    <!-- MODAL: CREAR/EDITAR ETIQUETA                             -->
    <!-- ======================================================== -->
    <div
      v-if="modalVisible"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm"
      @click.self="modalVisible = false"
    >
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-bold text-gray-800">
            {{ editando ? 'Editar Etiqueta' : 'Nueva Etiqueta' }}
          </h2>
          <button
            @click="modalVisible = false"
            class="text-gray-400 hover:text-gray-600 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form @submit.prevent="guardarEtiqueta">
          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-medium mb-1.5">
              Nombre <span class="text-xs text-gray-400">(max. 20 caracteres)</span>
            </label>
            <input
              v-model="form.nombre_etiqueta"
              type="text"
              maxlength="20"
              class="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="Ej: Ropa Verano"
              required
            />
            <div class="flex justify-end mt-1">
              <span class="text-xs text-gray-400" :class="form.nombre_etiqueta?.length >= 18 ? 'text-orange-500' : ''">
                {{ form.nombre_etiqueta?.length || 0 }} / 20
              </span>
            </div>
          </div>

          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-medium mb-1.5">Descripcion</label>
            <input
              v-model="form.descripcion"
              type="text"
              class="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="Ej: Ropa ligera para temporada de calor"
            />
          </div>

          <div class="flex justify-end gap-3 mt-6">
            <button
              type="button"
              @click="modalVisible = false"
              class="px-5 py-2.5 text-gray-600 hover:text-gray-800 transition rounded-xl hover:bg-gray-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              class="px-5 py-2.5 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition shadow-sm hover:shadow"
            >
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

// Paleta de colores para las etiquetas
const colores = [
  { bg: '#E3F2FD', text: '#1565C0', border: '#90CAF9' },
  { bg: '#E8F5E9', text: '#2E7D32', border: '#A5D6A7' },
  { bg: '#FFF3E0', text: '#E65100', border: '#FFCC80' },
  { bg: '#FCE4EC', text: '#C62828', border: '#F48FB1' },
  { bg: '#F3E5F5', text: '#6A1B9A', border: '#CE93D8' },
  { bg: '#E0F7FA', text: '#00695C', border: '#80DEEA' },
  { bg: '#FFFDE7', text: '#F57F17', border: '#FFD54F' },
  { bg: '#EFEBE9', text: '#4E342E', border: '#BCAAA4' },
  { bg: '#E8EAF6', text: '#283593', border: '#9FA8DA' },
  { bg: '#FBE9E7', text: '#BF360C', border: '#FFAB91' },
]

// ============================================================
// DATOS
// ============================================================
const etiquetas = ref([])
const busqueda = ref('')

const etiquetasFiltradas = computed(() => {
  if (!busqueda.value) return etiquetas.value
  const q = busqueda.value.toLowerCase()
  return etiquetas.value.filter(e =>
    e.nombre_etiqueta.toLowerCase().includes(q)
  )
})

// ============================================================
// MODAL
// ============================================================
const modalVisible = ref(false)
const editando = ref(false)
const form = ref({
  id_etiqueta: null,
  nombre_etiqueta: '',
  descripcion: ''
})

// ============================================================
// FUNCIONES - CRUD
// ============================================================
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

const abrirModal = (etiqueta = null) => {
  if (etiqueta) {
    editando.value = true
    form.value = {
      id_etiqueta: etiqueta.id_etiqueta,
      nombre_etiqueta: etiqueta.nombre_etiqueta,
      descripcion: etiqueta.descripcion || ''
    }
  } else {
    editando.value = false
    form.value = {
      id_etiqueta: null,
      nombre_etiqueta: '',
      descripcion: ''
    }
  }
  modalVisible.value = true
}

const guardarEtiqueta = async () => {
  try {
    const url = editando.value
      ? `${baseUrl}/api/etiquetas/${form.value.id_etiqueta}`
      : `${baseUrl}/api/etiquetas`
    const method = editando.value ? 'put' : 'post'

    await axios[method](url, {
      nombre_etiqueta: form.value.nombre_etiqueta.trim(),
      descripcion: form.value.descripcion?.trim() || null
    }, {
      headers: { 'Authorization': `Bearer ${authStore.token}` }
    })

    modalVisible.value = false
    cargarEtiquetas()
  } catch (error) {
    console.error('Error guardando etiqueta:', error)
    alert(error.response?.data?.error || 'Error al guardar')
  }
}

const eliminarEtiqueta = async (id) => {
  if (!confirm('Eliminar esta etiqueta?')) return
  try {
    await axios.delete(`${baseUrl}/api/etiquetas/${id}`, {
      headers: { 'Authorization': `Bearer ${authStore.token}` }
    })
    cargarEtiquetas()
  } catch (error) {
    alert(error.response?.data?.error || 'Error al eliminar')
  }
}

// ============================================================
// LIFECYCLE
// ============================================================
onMounted(cargarEtiquetas)
</script>

<style scoped>
/* ============================================================
   ESTILOS PARA EL HOVER DE ETIQUETAS
   ============================================================ */

/* Tooltip: oculto por defecto, visible al hacer hover */
.etiqueta-item .etiqueta-tooltip {
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.2s ease, visibility 0.2s ease;
}

.etiqueta-item:hover .etiqueta-tooltip {
  opacity: 1;
  visibility: visible;
}

/* Acciones: ocultas por defecto, visibles al hacer hover */
.etiqueta-item .etiqueta-acciones {
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.2s ease, visibility 0.2s ease;
}

.etiqueta-item:hover .etiqueta-acciones {
  opacity: 1;
  visibility: visible;
}
</style>