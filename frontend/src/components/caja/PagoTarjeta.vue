<!-- frontend/src/components/caja/PagoTarjeta.vue -->
<template>
  <div class="bg-white rounded-lg shadow p-4 mt-4">
    <h4 class="font-bold text-gray-700 mb-3">
      💳 {{ tipo }}
    </h4>

    <div class="space-y-3">
      <div>
        <label class="block text-sm text-gray-600 mb-1">Número de tarjeta</label>
        <input
          v-model="form.numero"
          type="text"
          placeholder="**** **** **** ****"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div>
          <label class="block text-sm text-gray-600 mb-1">Fecha vencimiento</label>
          <input
            v-model="form.fecha"
            type="text"
            placeholder="MM/AA"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label class="block text-sm text-gray-600 mb-1">Código seguridad</label>
          <input
            v-model="form.codigo"
            type="text"
            placeholder="***"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label class="block text-sm text-gray-600 mb-1">Nombre del titular</label>
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
          class="flex-1 px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg"
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

// Los 4 campos quedan para completar en pantalla (simulación), pero solo
// el número de tarjeta viaja al backend como "identificador". Fecha,
// código de seguridad y titular se quedan acá y no se envían.
const form = ref({
  numero: '',
  fecha: '',
  codigo: '',
  titular: ''
})

const confirmar = () => {
  emit('confirmar', {
    tipo: props.tipo,
    identificador: form.value.numero.replace(/\s/g, '') // solo el número completo, sin espacios
  })
}
</script>
