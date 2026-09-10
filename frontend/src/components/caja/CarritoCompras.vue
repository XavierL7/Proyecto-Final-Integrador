<!-- frontend/src/components/caja/CarritoCompras.vue -->
<template>
  <div class="bg-white rounded-lg shadow">
    <div class="p-4 border-b border-gray-200">
      <h2 class="font-bold">Carrito</h2>
    </div>

    <div v-if="items.length === 0" class="p-8 text-center">
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
            <p class="font-medium">{{ item.nombre_producto }}</p>
            <p class="text-sm">${{ item.precio_unitario }} c/u</p>
          </div>

          <!-- Edición manual de cantidad sin límite de stock -->
          <div class="flex items-center gap-2">
            <input
              type="number"
              min="1"
              :value="item.cantidad || 1"
              @input="onInputCantidad(index, $event.target.value)"
              @blur="onBlurCantidad(index, $event.target.value)"
              class="w-16 border rounded px-2 py-1 text-center font-medium text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div class="text-right min-w-[80px]">
            <p v-if="calcularDescuento(item) > 0" class="text-xs line-through">
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
  // corresponde (0 si ninguna promoción vigente le aplica).
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

const onInputCantidad = (index, valor) => {
  let val = parseInt(valor, 10)
  
  if (isNaN(val) || val < 1) {
    val = 1
  }

  emit('actualizar-cantidad', index, val)
}

const onBlurCantidad = (index, valor) => {
  let val = parseInt(valor, 10)
  
  if (isNaN(val) || val < 1) {
    val = 1
  }

  emit('actualizar-cantidad', index, val)
}

const eliminar = (index) => {
  emit('eliminar', index)
}
</script>