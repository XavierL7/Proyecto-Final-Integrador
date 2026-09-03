<!-- frontend/src/components/ventas/MetodosPago.vue -->
<template>
  <div class=" rounded-lg shadow p-4 mt-4">
    <h3 class="font-bold mb-3">💳 Métodos de pago</h3>

    <div class="grid grid-cols-2 gap-2">
      <button
        v-for="metodo in metodos"
        :key="metodo.id_metodo_pago"
        @click="seleccionar(metodo.nombre)"
        class="px-3 py-2 rounded-lg border transition text-sm font-medium"
        :class="[
          seleccionado === metodo.nombre
            ? 'border-blue-500 bg-blue-50 text-blue-600'
            : 'border-gray-200 hover:border-blue-300'
        ]"
      >
        {{ metodo.nombre }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'  // 👈 ESTO ES LO QUE FALTABA

defineProps({
  metodos: { type: Array, required: true }
})

const seleccionado = ref(null)

const emit = defineEmits(['seleccionar'])

const seleccionar = (nombre) => {
  seleccionado.value = nombre
  emit('seleccionar', nombre)
}
</script>