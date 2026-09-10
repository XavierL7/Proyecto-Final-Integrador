<!-- frontend/src/components/caja/PagoTransferencia.vue -->
<template>
  <div class="rounded-lg shadow p-4 mt-4">
    <h4 class="font-bold mb-3">
      📱 {{ tipo }}
    </h4>

    <div class="space-y-3">


      <div class="flex gap-3">
        <button
          @click="$emit('cancelar')"
          class="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-red-600 transition"
        >
          Cancelar
        </button>
        <button
          @click="confirmar"
          :disabled="cargando"
          class="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <span v-if="cargando" class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
          <span>{{ cargando ? 'Procesando...' : 'Confirmar pago' }}</span>
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


const confirmar = () => {
  emit('confirmar', {
    tipo: props.tipo,
  })
}
</script>
