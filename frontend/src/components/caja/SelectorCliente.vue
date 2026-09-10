<!-- frontend/src/components/caja/SelectorCliente.vue -->
<template>
  <div class="rounded-lg shadow p-4 mb-4 relative" ref="contenedor">
    <label class="block text-sm font-semibold mb-2">Cliente</label>

    <!-- Campo de búsqueda -->
    <div class="relative">
      <input
        type="text"
        v-model="busqueda"
        @focus="desplegado = true"
        placeholder="Buscar por nombre, apellido o DNI..."
        class="w-full border rounded-lg px-3 py-2 text-sm text-gray-900 bg-white dark:bg-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-500 pr-8"
      />

      <!-- Botón para limpiar / volver a Cliente General -->
      <button
        v-if="modelValue !== null || busqueda !== ''"
        @click="seleccionarCliente(null)"
        type="button"
        class="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xs font-bold p-1"
        title="Quitar cliente"
      >
        ✕
      </button>
    </div>

    <!-- Dropdown de resultados -->
    <div
      v-if="desplegado"
      class="absolute left-0 right-0 mt-1 mx-4 max-h-56 overflow-y-auto bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-20 divide-y divide-gray-100 dark:divide-gray-700"
    >
      <!-- Opción por defecto: Cliente General -->
      <button
        type="button"
        @click="seleccionarCliente(null)"
        class="w-full text-left px-3 py-2 text-sm text-gray-900 dark:text-gray-100 hover:bg-teal-50 dark:hover:bg-gray-700 transition-colors"
      >
        <span class="font-medium">Cliente General</span>
      </button>

      <!-- Lista filtrada -->
      <button
        v-for="cliente in clientesFiltrados"
        :key="cliente.id_cliente"
        type="button"
        @click="seleccionarCliente(cliente)"
        class="w-full text-left px-3 py-2 text-sm text-gray-900 dark:text-gray-100 hover:bg-teal-50 dark:hover:bg-gray-700 transition-colors flex justify-between items-center"
      >
        <span>{{ cliente.nombre }} {{ cliente.apellido }}</span>
        <span class="text-xs text-gray-500 dark:text-gray-400">DNI: {{ cliente.dni }}</span>
      </button>

      <!-- Sin resultados -->
      <div
        v-if="clientesFiltrados.length === 0 && busqueda.trim() !== ''"
        class="px-3 py-2 text-xs text-gray-400 dark:text-gray-500 text-center"
      >
        No se encontraron clientes
      </div>
    </div>

    <!-- Detalle del cliente seleccionado -->
    <p v-if="clienteActual" class="text-xs mt-1 text-gray-500 dark:text-gray-400">
      {{ clienteActual.telefono ? `Tel: ${clienteActual.telefono}` : 'Sin teléfono cargado' }}
    </p>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  clientes: { type: Array, default: () => [] },
  modelValue: { type: [Number, String, null], default: null }
})

const emit = defineEmits(['update:modelValue'])

const busqueda = ref('')
const desplegado = ref(false)
const contenedor = ref(null)

const clientesActivos = computed(() =>
  props.clientes.filter(c => c.activo === true)
)

const clienteActual = computed(() =>
  clientesActivos.value.find(c => c.id_cliente === props.modelValue) || null
)

// Filtra clientes por nombre, apellido o DNI
const clientesFiltrados = computed(() => {
  const q = busqueda.value.trim().toLowerCase()
  if (!q) return clientesActivos.value
  return clientesActivos.value.filter(c =>
    `${c.nombre} ${c.apellido}`.toLowerCase().includes(q) ||
    String(c.dni || '').includes(q)
  )
})

// Mantiene el texto del input sincronizado si cambia el modelValue externamente
watch(
  () => props.modelValue,
  () => {
    if (clienteActual.value) {
      busqueda.value = `${clienteActual.value.nombre} ${clienteActual.value.apellido}`
    } else {
      busqueda.value = ''
    }
  },
  { immediate: true }
)

const seleccionarCliente = (cliente) => {
  if (cliente) {
    emit('update:modelValue', cliente.id_cliente)
    busqueda.value = `${cliente.nombre} ${cliente.apellido}`
  } else {
    emit('update:modelValue', null)
    busqueda.value = ''
  }
  desplegado.value = false
}

// Cierra el menú desplegable al hacer clic fuera del componente
const handleClickOutside = (e) => {
  if (contenedor.value && !contenedor.value.contains(e.target)) {
    desplegado.value = false
    // Si la búsqueda no coincide con el cliente seleccionado, restaura el texto
    if (clienteActual.value) {
      busqueda.value = `${clienteActual.value.nombre} ${clienteActual.value.apellido}`
    } else {
      busqueda.value = ''
    }
  }
}

onMounted(() => document.addEventListener('click', handleClickOutside))
onUnmounted(() => document.removeEventListener('click', handleClickOutside))
</script>