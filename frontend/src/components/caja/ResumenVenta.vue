<!-- frontend/src/components/caja/ResumenVenta.vue -->
<template>
  <div class="rounded-lg shadow p-4">
    <h3 class="font-bold mb-3">📋 Resumen</h3>

    <div class="space-y-2">
      <div class="flex justify-between">
        <span>Subtotal</span>
        <span>${{ subtotal.toFixed(2) }}</span>
      </div>

      <div class="flex justify-between text-green-600">
        <span>Descuento</span>
        <span>-${{ descuento.toFixed(2) }}</span>
      </div>

      <div class="border-t border-gray-200 pt-2 mt-2">
        <div class="flex justify-between font-bold text-lg">
          <span>Total</span>
          <span class="text-blue-600">${{ total.toFixed(2) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  subtotal: { type: Number, required: true },
  descuento: { type: Number, required: true },
  total: { type: Number, required: true }
})
</script>