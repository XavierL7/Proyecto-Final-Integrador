<!-- frontend/src/components/caja/PagoEfectivo.vue -->
<template>
  <div class="rounded-lg shadow p-4 mt-4">
    <h4 class="font-bold mb-3">Efectivo</h4>

    <div class="space-y-3">
      <div>
        <label class="block text-sm mb-1">Monto con que paga</label>
        <input
          v-model="montoRecibido"
          type="number"
          step="0.01"
          min="0"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div v-if="montoRecibido > 0" class="flex justify-between text-sm">
        <span class="">Cambio</span>
        <span class="font-bold text-green-600">${{ cambio.toFixed(2) }}</span>
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
          :disabled="!montoRecibido || montoRecibido < total"
          class="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition disabled:opacity-50"
        >
          Confirmar pago
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  total: { type: Number, required: true }
})

const emit = defineEmits(['confirmar', 'cancelar'])

const montoRecibido = ref('')

const cambio = computed(() => {
  const monto = parseFloat(montoRecibido.value) || 0
  return Math.max(0, monto - props.total)
})

const confirmar = () => {
  const monto = parseFloat(montoRecibido.value)
  if (monto >= props.total) {
    emit('confirmar', {
      monto_recibido: monto,
      cambio: cambio.value
    })
  }
}
</script>