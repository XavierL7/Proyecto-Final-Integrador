<!-- frontend/src/components/caja/DetalleVentaModal.vue -->
<template>
  <div
    v-if="visible && venta"
    class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm p-4"
    @click.self="cerrar"
  >
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-fadeIn">

      <!-- Encabezado -->
      <div class="flex items-start justify-between p-6 pb-4 border-b border-gray-100">
        <div>
          <h2 class="text-lg font-bold text-gray-800">Venta #{{ venta.id_venta }}</h2>
          <p class="text-xs text-gray-500 mt-1">
            {{ formatearFecha(venta.fecha_hora) }} · Caja #{{ venta.id_caja }}
          </p>
          <p class="text-xs text-gray-500">
            Vendió <strong>{{ venta.trabajador?.nombre }} {{ venta.trabajador?.apellido }}</strong>
            · {{ nombreCliente }}
          </p>
        </div>
        <button @click="cerrar" class="text-gray-400 hover:text-gray-600 transition shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="p-6 pt-4">
        <!-- Productos -->
        <h3 class="text-sm font-bold text-gray-700 mb-2">Productos</h3>
        <div class="space-y-2 mb-5">
          <div
            v-for="item in venta.detalle_ventas"
            :key="item.id_detalle_venta"
            class="flex justify-between items-start text-sm border-b border-gray-50 pb-2"
          >
            <div>
              <p class="text-gray-800 font-medium">{{ item.cantidad }}× {{ item.producto?.nombre_producto }}</p>
              <p class="text-xs text-gray-400">${{ formatMonto(item.precio_unitario_momento) }} c/u</p>
              <p v-if="Number(item.monto_descuento_total) > 0" class="text-xs text-green-600">
                Descuento: -${{ formatMonto(item.monto_descuento_total) }}
              </p>
            </div>
            <div class="text-right font-medium text-gray-800 shrink-0">
              ${{ formatMonto(item.cantidad * item.precio_unitario_momento - item.monto_descuento_total) }}
            </div>
          </div>
        </div>

        <!-- Pagos -->
        <h3 class="text-sm font-bold text-gray-700 mb-2">Pago</h3>
        <div class="space-y-1.5 mb-5">
          <div
            v-for="pago in venta.detalle_pago_venta"
            :key="pago.id_detalle_pago"
            class="flex justify-between text-sm"
          >
            <span class="text-gray-600">
              {{ pago.metodo_pago?.nombre }}
              <span v-if="pago.identificador" class="text-xs text-gray-400">({{ pago.identificador }})</span>
            </span>
            <span class="font-medium text-gray-800">${{ formatMonto(pago.monto) }}</span>
          </div>
          <div v-if="cambio > 0" class="flex justify-between text-sm text-amber-600">
            <span>Cambio entregado</span>
            <span class="font-medium">${{ formatMonto(cambio) }}</span>
          </div>
        </div>

        <!-- Total -->
        <div class="border-t border-gray-100 pt-3 flex justify-between items-center">
          <span class="text-sm font-semibold text-gray-700">Total</span>
          <span class="text-base font-bold px-3 py-1.5 rounded bg-blue-50 text-blue-700">
            ${{ formatMonto(venta.total_neto) }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  visible: { type: Boolean, default: false },
  venta: { type: Object, default: null }
})

const emit = defineEmits(['close'])

const cerrar = () => emit('close')

const nombreCliente = computed(() => {
  if (!props.venta?.cliente) return 'Cliente General'
  return `${props.venta.cliente.nombre} ${props.venta.cliente.apellido}`
})

// Igual criterio que en HistorialVentasView: el cambio puede venir en el
// detalle de pago o, si no está, en el total de la venta.
const cambio = computed(() => {
  if (!props.venta) return 0
  const detalle = props.venta.detalle_pago_venta?.[0]
  return Number(detalle?.cambio_devuelto || props.venta.cambio_total || 0)
})

const formatMonto = (monto) => Number(monto).toFixed(2)

const formatearFecha = (fecha) => {
  return new Date(fecha).toLocaleString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.95) translateY(10px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}
.animate-fadeIn {
  animation: fadeIn 0.2s ease-out;
}
</style>
