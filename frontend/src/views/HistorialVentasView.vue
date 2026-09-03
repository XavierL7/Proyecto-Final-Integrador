<!-- frontend/src/views/HistorialVentasView.vue -->
<template>
  <div class="p-6 max-w-7xl mx-auto">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Historial de Ventas</h1>
      <button
        @click="cargarVentas"
        class="text-sm text-blue-500 hover:text-blue-700"
      >
        Actualizar
      </button>
    </div>

    <div class="rounded-lg shadow overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class=" border-b border-gray-200 text-xs font-semibold uppercase">
              <th class="px-4 py-3">Fecha y hora</th>
              <th class="px-4 py-3">Trabajador</th>
              <th class="px-4 py-3">Caja</th>
              <th class="px-4 py-3">Cliente</th>
              <th class="px-4 py-3">Método de pago</th>
              <th class="px-4 py-3 text-right">Total</th>
              <th class="px-4 py-3 text-right">Pagó con</th>
              <th class="px-4 py-3 text-right">Cambio</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 text-sm">
            <tr v-if="cargando">
              <td colspan="8" class="px-4 py-6 text-center">Cargando ventas...</td>
            </tr>
            <tr v-else-if="ventas.length === 0">
              <td colspan="8" class="px-4 py-6 text-center">No hay ventas registradas todavía.</td>
            </tr>
            <tr v-for="venta in ventas" :key="venta.id_venta" class="hover:bg-gray-300">
              <td class="px-4 py-3 whitespace-nowrap">
                {{ formatearFechaHora(venta.fecha_hora) }}
              </td>
              <td class="px-4 py-3 font-medium whitespace-nowrap">
                {{ venta.trabajador?.nombre }} {{ venta.trabajador?.apellido }}
              </td>
              <td class="px-4 py-3">
                #{{ venta.id_caja }}
              </td>
              <td class="px-4 py-3 whitespace-nowrap">
                {{ nombreCliente(venta) }}
              </td>
              <td class="px-4 py-3 whitespace-nowrap">
                {{ metodoPago(venta) }}
              </td>
              <td class="px-4 py-3 text-right font-semibold whitespace-nowrap">
                ${{ Number(venta.total_neto).toFixed(2) }}
              </td>
              <td class="px-4 py-3 text-right whitespace-nowrap">
                ${{ montoPagado(venta).toFixed(2) }}
              </td>
              <td class="px-4 py-3 text-right whitespace-nowrap">
                <span v-if="cambio(venta) > 0" class="text-green-600 font-medium">
                  ${{ cambio(venta).toFixed(2) }}
                </span>
                <span v-else class="">-</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const ventas = ref([])
const cargando = ref(false)

// Cada venta trae "detalle_pago_venta" (array). Hoy el front de caja solo
// permite un método de pago por venta, así que usamos el primero.
// Si el día de mañana se soportan pagos combinados, esto es lo primero
// que hay que revisar.
const detallePago = (venta) => venta.detalle_pago_venta?.[0] || null

const nombreCliente = (venta) => {
  if (!venta.cliente) return 'Cliente General'
  return `${venta.cliente.nombre} ${venta.cliente.apellido}`
}

const metodoPago = (venta) => {
  return detallePago(venta)?.metodo_pago?.nombre || '-'
}

// "Cuánto pagó": lo que entregó el cliente. Para efectivo es monto + cambio
// (porque "monto" guardado es lo que quedó cubriendo la venta, no lo que
// entregó de más). Para el resto de los métodos no hay cambio, así que da
// igual al monto.
const montoPagado = (venta) => {
  const detalle = detallePago(venta)
  if (!detalle) return Number(venta.total_neto)
  return Number(detalle.monto) + Number(detalle.cambio_devuelto || 0)
}

const cambio = (venta) => {
  const detalle = detallePago(venta)
  return Number(detalle?.cambio_devuelto || venta.cambio_total || 0)
}

const formatearFechaHora = (fecha) => {
  return new Date(fecha).toLocaleString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const cargarVentas = async () => {
  cargando.value = true
  try {
    const response = await axios.get(`${baseUrl}/api/ventas`, {
      headers: { 'Authorization': `Bearer ${authStore.token}` }
    })
    ventas.value = response.data
  } catch (error) {
    console.error('Error cargando historial de ventas:', error)
  } finally {
    cargando.value = false
  }
}

onMounted(() => {
  cargarVentas()
})
</script>
