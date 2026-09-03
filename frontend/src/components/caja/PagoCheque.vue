<!-- frontend/src/components/caja/PagoCheque.vue -->
<template>
  <div class="rounded-lg shadow p-4 mt-4">
    <h4 class="font-bold mb-3">Cheque</h4>

    <div class="space-y-3">
      <div>
        <label class="block text-sm mb-1">Número de cheque</label>
        <input
          v-model="form.numero"
          type="text"
          placeholder="Número de cheque"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label class="block text-sm mb-1">Banco emisor</label>
        <input
          v-model="form.banco"
          type="text"
          placeholder="Banco"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label class="block text-sm mb-1">Fecha de emisión</label>
        <input
          v-model="form.fecha"
          type="date"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label class="block text-sm mb-1">Titular</label>
        <input
          v-model="form.titular"
          type="text"
          placeholder="Nombre del titular"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div class="flex gap-3">
        <button
          @click="$emit('cancelar')"
          class="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-red-600 transition"
        >
          Cancelar
        </button>
        <button
          @click="confirmar"
          class="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
        >
          Confirmar pago
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  total: { type: Number, required: true }
})

const emit = defineEmits(['confirmar', 'cancelar'])

const form = ref({
  numero: '',
  banco: '',
  fecha: '',
  titular: ''
})

const confirmar = () => {
  emit('confirmar', form.value)
}
</script>