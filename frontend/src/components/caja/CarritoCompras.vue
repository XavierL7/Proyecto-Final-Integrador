<!-- frontend/src/components/caja/CarritoCompras.vue -->
<template>
  <div class="rounded-lg shadow">
    <div class="p-4 border-b border-gray-200">
      <h2 class="font-bold">🛒 Carrito</h2>
    </div>

    <div v-if="items.length === 0" class="p-8 text-center text-gray-400">
      <p>El carrito está vacío</p>
    </div>

    <div v-else class="divide-y divide-gray-100">
      <div
        v-for="(item, index) in items"
        :key="index"
        class="flex items-center gap-3 px-4 py-3"
      >
        <div class="flex-1">
          <p class="font-medium">{{ item.nombre_producto }}</p>
          <p class="text-sm">${{ item.precio_unitario }} c/u</p>
        </div>

        <div class="flex items-center gap-2">
          <button
            @click="actualizarCantidad(index, item.cantidad - 1)"
            class="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-300 transition"
          >
            -
          </button>
          <span class="w-8 text-center font-medium">{{ item.cantidad }}</span>
          <button
            @click="actualizarCantidad(index, item.cantidad + 1)"
            class="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-300 transition"
            :disabled="item.cantidad >= item.stock"
          >
            +
          </button>
        </div>

        <div class="text-right min-w-[80px]">
          <p class="font-bold text-blue-600">${{ (item.cantidad * item.precio_unitario).toFixed(2) }}</p>
        </div>

        <button
          @click="eliminar(index)"
          class="text-red-500 hover:text-red-700 transition"
        >
          ✕
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  items: {
    type: Array,
    required: true
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