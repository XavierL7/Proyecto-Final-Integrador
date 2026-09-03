<!-- frontend/src/components/caja/PagoTransferencia.vue -->
<template>
  <div class="rounded-lg shadow p-4 mt-4">
    <h4 class="font-bold mb-3">
      📱 {{ tipo }}
    </h4>

    <div class="space-y-3">
      <div>
        <label class="block text-sm mb-1">CBU o alias</label>
        <input
          v-model="form.cbu"
          type="text"
          placeholder="CBU o alias"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label class="block text-sm mb-1">CUIL/CUIT</label>
        <input
          v-model="form.cuil"
          type="text"
          placeholder="CUIL o CUIT"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label class="block text-sm mb-1">Nombre del titular</label>
        <input
          v-model="form.titular"
          type="text"
          placeholder="Nombre completo"
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
  tipo: { type: String, required: true },
  total: { type: Number, required: true }
})

const emit = defineEmits(['confirmar', 'cancelar'])

// CUIL y titular quedan para completar en pantalla (simulación), pero
// solo el alias/CBU viaja al backend como "identificador".
const form = ref({
  cbu: '',
  cuil: '',
  titular: ''
})

const confirmar = () => {
  emit('confirmar', {
    tipo: props.tipo,
    identificador: form.value.cbu
  })
}
</script>
