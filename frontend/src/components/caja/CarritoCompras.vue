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
        class="flex flex-col gap-2 px-4 py-3"
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
            <p v-if="descuentoDe(item) > 0" class="text-xs text-gray-400 line-through">
              ${{ (item.cantidad * item.precio_unitario).toFixed(2) }}
            </p>
            <p class="font-bold text-blue-600">
              ${{ ((item.cantidad * item.precio_unitario) - descuentoDe(item)).toFixed(2) }}
            </p>
          </div>


          <button

            @click="eliminar(index)"
            class="text-red-500 hover:text-red-700 transition"
          >
            ✕
          </button>
        </div>

        <!-- Selector de descuento, solo si hay alguna promoción aplicable a este item -->
        <div v-if="promocionesDe(item).length > 0" class="pl-1">
          <select
            :value="item.id_promocion || ''"
            @change="(e) => aplicarDescuento(index, e.target.value ? Number(e.target.value) : null)"
            class="text-xs border border-gray-200 rounded px-2 py-1 bg-gray-50 focus:outline-none focus:ring-1 focus:ring-teal-500"
          >
            <option value="">Sin descuento</option>
            <option
              v-for="promo in promocionesDe(item)"
              :key="promo.id_promocion"
              :value="promo.id_promocion"
            >
              {{ promo.nombre_promo }} (-{{ promo.porcentaje_descuento }}%)
              {{ promo.tipo_promo === 'por_metodo_pago' ? `· requiere ${promo.metodo_pago_requerido}` : '' }}
            </option>
          </select>
        </div>
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
  // Función que recibe un item del carrito y devuelve el array de
  // promociones vigentes que podría aplicarle (la calcula VentasView.vue,
  // que es quien tiene la lista completa de promociones vigentes).
  promocionesAplicables: {
    type: Function,
    default: () => []
  },
  // Función que recibe un item y devuelve el monto de descuento actual
  // (0 si no tiene ninguna promoción elegida).
  calcularDescuento: {
    type: Function,
    default: () => 0
  }
})

const emit = defineEmits(['actualizar-cantidad', 'eliminar', 'aplicar-descuento'])

const actualizarCantidad = (index, cantidad) => {
  emit('actualizar-cantidad', index, cantidad)
}

const eliminar = (index) => {
  emit('eliminar', index)
}

const aplicarDescuento = (index, idPromocion) => {
  emit('aplicar-descuento', index, idPromocion)
}

const promocionesDe = (item) => props.promocionesAplicables(item)
const descuentoDe = (item) => props.calcularDescuento(item)
</script>
