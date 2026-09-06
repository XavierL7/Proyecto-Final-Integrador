<!-- frontend/src/components/caja/CarritoCompras.vue -->
<template>
  <div class="bg-white rounded-lg shadow">
    <div class="p-4 border-b border-gray-200">
      <h2 class="font-bold text-gray-700">🛒 Carrito</h2>
    </div>

    <div v-if="items.length === 0" class="p-8 text-center text-gray-400">
      <p>El carrito está vacío</p>
    </div>

    <div v-else class="divide-y divide-gray-100">
      <div
        v-for="(item, index) in items"
        :key="index"
        class="flex flex-col gap-1 px-4 py-3"
      >
        <div class="flex items-center gap-3">
          <div class="flex-1">
            <p class="font-medium text-gray-800">{{ item.nombre_producto }}</p>
            <p class="text-sm text-gray-500">${{ item.precio_unitario }} c/u</p>
          </div>

          <div class="flex items-center gap-2">
            <button
              @click="actualizarCantidad(index, item.cantidad - 1)"
              class="w-7 h-7 flex items-center justify-center bg-gray-200 rounded hover:bg-gray-300 transition"
            >
              -
            </button>
            <span class="w-8 text-center font-medium">{{ item.cantidad }}</span>
            <button
              @click="actualizarCantidad(index, item.cantidad + 1)"
              class="w-7 h-7 flex items-center justify-center bg-gray-200 rounded hover:bg-gray-300 transition"
              :disabled="item.cantidad >= item.stock"
            >
              +
            </button>
          </div>

          <div class="text-right min-w-[80px]">
            <p v-if="calcularDescuento(item) > 0" class="text-xs text-gray-400 line-through">
              ${{ (item.cantidad * item.precio_unitario).toFixed(2) }}
            </p>
            <p class="font-bold text-blue-600">
              ${{ ((item.cantidad * item.precio_unitario) - calcularDescuento(item)).toFixed(2) }}
            </p>
          </div>

          <button
            @click="eliminar(index)"
            class="text-red-500 hover:text-red-700 transition"
          >
            ✕
          </button>
        </div>

        <!-- El descuento se aplica solo; esto es solo informativo -->
        <p v-if="promoAplicada(item)" class="text-xs text-green-600 pl-1">
          🎉 {{ promoAplicada(item).nombre_promo }} aplicado
          (-${{ calcularDescuento(item).toFixed(2) }})
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  items: {
    type: Array,
    required: true
  },
  // Función que recibe un item y devuelve el monto de descuento que le
  // corresponde (0 si ninguna promoción vigente le aplica). La calcula
  // VentasView.vue automáticamente, sin que el cajero elija nada.
  calcularDescuento: {
    type: Function,
    default: () => 0
  },
  // Función que recibe un item y devuelve la promoción que se le aplicó
  // (o null), solo para mostrar el cartelito informativo.
  promoAplicada: {
    type: Function,
    default: () => null
  }
})

const emit = defineEmits(['actualizar-cantidad', 'eliminar'])

const actualizarCantidad = (index, cantidad) => {
  emit('actualizar-cantidad', index, cantidad)
}

const eliminar = (index) => {
  emit('eliminar', index)
}
</script>
