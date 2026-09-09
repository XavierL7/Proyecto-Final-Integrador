<!-- frontend/src/components/ventas/MetodosPago.vue -->
<template>
  <div class=" rounded-lg shadow p-4 mt-4">
    <h3 class="font-bold mb-3">💳 Métodos de pago</h3>

    <div class="grid grid-cols-2 gap-2">
      <button
        v-for="metodo in metodosPermitidos"
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

    <p v-if="metodosPermitidos.length === 0" class="text-xs text-gray-400 mt-1">
      No tenés permiso para cobrar con ningún método de pago. Consultá con un administrador.
    </p>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '../../stores/auth'

const authStore = useAuthStore()

const props = defineProps({
  metodos: { type: Array, required: true }
})

// Qué funcionalidad habilita a cobrar con cada método. Si el nombre del
// método no está acá, se muestra igual (para no romper métodos nuevos
// que todavía no tengan un permiso dedicado) — se avisa por consola para
// que se note en desarrollo.
const PERMISO_POR_METODO = {
  'Efectivo': 'Pago_Efectivo',
  'Cheque': 'Pago_Cheque',
  'Tarjeta Débito': 'Pago_Debito',
  'Tarjeta Crédito': 'Pago_Credito',
  // No hay un permiso "Pago_Transferencia" propio en la lista: se agrupa
  // junto con Mercado Pago bajo Pago_MercadoPago. Si más adelante se
  // separan, hay que sumar Pago_Transferencia acá y en Funcionalidades.
  'Transferencia': 'Pago_MercadoPago',
  'Mercado Pago': 'Pago_MercadoPago'
}

const metodosPermitidos = computed(() => {
  return props.metodos.filter(metodo => {
    const permisoNecesario = PERMISO_POR_METODO[metodo.nombre]
    if (!permisoNecesario) {
      console.warn(`MetodosPago: "${metodo.nombre}" no tiene un permiso Pago_X mapeado, se muestra igual.`)
      return true
    }
    return authStore.tienePermiso(permisoNecesario)
  })
})

const seleccionado = ref(null)

const emit = defineEmits(['seleccionar'])

const seleccionar = (nombre) => {
  seleccionado.value = nombre
  emit('seleccionar', nombre)
}
</script>
