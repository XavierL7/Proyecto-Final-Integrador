<!-- frontend/src/components/caja/DetalleCajaModal.vue -->
<template>
  <div
    v-if="visible"
    class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm p-4"
    @click.self="cerrar"
  >
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto animate-fadeIn">

      <!-- Encabezado -->
      <div class="flex items-start justify-between p-6 pb-4 border-b border-gray-100">
        <div>
          <h2 class="text-lg font-bold text-gray-800">
            Caja #{{ idCaja }}
            <span
              class="ml-2 text-xs font-semibold px-2 py-1 rounded align-middle"
              :class="detalle?.caja.estado === 'abierta' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'"
            >
              {{ detalle?.caja.estado }}
            </span>
            <span
              v-if="detalle"
              class="ml-2 text-xs font-semibold px-2 py-1 rounded align-middle"
              :class="detalle.caja.modo_autenticacion === 'por_venta' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'"
            >
              {{ detalle.caja.modo_autenticacion === 'por_venta' ? 'Compartida' : 'Individual' }}
            </span>
          </h2>
          <p v-if="detalle" class="text-xs text-gray-500 mt-1">
            Abierta el {{ formatearFecha(detalle.caja.fecha_hora_apertura) }} por
            <strong>{{ detalle.caja.trabajador_apertura?.nombre }} {{ detalle.caja.trabajador_apertura?.apellido }}</strong>
            <template v-if="detalle.caja.fecha_hora_cierre">
              · Cerrada el {{ formatearFecha(detalle.caja.fecha_hora_cierre) }} por
              <strong>{{ detalle.caja.trabajador_cierre?.nombre }} {{ detalle.caja.trabajador_cierre?.apellido }}</strong>
            </template>
          </p>
        </div>
        <button @click="cerrar" class="text-gray-400 hover:text-gray-600 transition shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Pestañas -->
      <div class="flex gap-1 px-6 pt-4">
        <button
          @click="tab = 'resumen'"
          class="px-4 py-2 text-sm font-semibold rounded-t-lg border-b-2 transition"
          :class="tab === 'resumen' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-400 hover:text-gray-600'"
        >
          Resumen
        </button>
        <button
          @click="tab = 'ventas'"
          class="px-4 py-2 text-sm font-semibold rounded-t-lg border-b-2 transition"
          :class="tab === 'ventas' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-400 hover:text-gray-600'"
        >
          Ventas
          <span v-if="detalle" class="ml-1 text-xs text-gray-400">({{ detalle.resumen.cantidadVentas }})</span>
        </button>
      </div>

      <div class="p-6 pt-4">
        <!-- Cargando -->
        <div v-if="cargando" class="text-center text-gray-400 text-sm py-10">Cargando detalle...</div>

        <template v-else-if="detalle">
          <!-- ============================================ -->
          <!-- TAB: RESUMEN -->
          <!-- ============================================ -->
          <div v-if="tab === 'resumen'">
            <div class="grid grid-cols-2 gap-x-6 gap-y-3 mb-6">
              <div class="text-sm text-gray-500">Monto inicial</div>
              <div class="text-sm text-gray-800 text-right font-medium">${{ formatMonto(detalle.caja.monto_inicial) }}</div>

              <div v-for="(monto, metodo) in detalle.resumen.ingresosPorMetodo" :key="metodo" class="contents">
                <div class="text-sm text-gray-500">{{ metodo }}</div>
                <div class="text-sm text-gray-800 text-right font-medium">${{ formatMonto(monto) }}</div>
              </div>
              <p v-if="Object.keys(detalle.resumen.ingresosPorMetodo).length === 0" class="col-span-2 text-sm text-gray-400">
                Todavía no hay ventas registradas en esta caja.
              </p>

              <div class="col-span-2 border-t border-gray-100 pt-3 flex justify-between items-center">
                <span class="text-sm font-semibold text-gray-700">Total de ingresos en caja</span>
                <span class="text-sm font-bold px-3 py-1.5 rounded bg-blue-50 text-blue-700">
                  ${{ formatMonto(detalle.resumen.totalIngresos) }}
                </span>
              </div>

              <div class="col-span-2 flex justify-between items-center">
                <span class="text-sm font-semibold text-gray-700">Total egresos de caja</span>
                <span class="text-sm font-bold px-3 py-1.5 rounded bg-pink-50 text-pink-700">
                  ${{ formatMonto(detalle.resumen.totalEgresos) }}
                </span>
              </div>

              <div class="col-span-2 flex justify-between items-center">
                <span class="text-sm font-semibold text-gray-700">Saldo (todos los métodos)</span>
                <span class="text-sm font-bold px-3 py-1.5 rounded bg-green-50 text-green-700">
                  ${{ formatMonto(detalle.resumen.saldoTotalEsperado) }}
                </span>
              </div>

              <div class="col-span-2 flex justify-between items-center">
                <span class="text-sm font-semibold text-gray-700">Saldo efectivo esperado</span>
                <span class="text-sm font-bold px-3 py-1.5 rounded bg-green-50 text-green-700">
                  ${{ formatMonto(detalle.resumen.saldoEfectivoEsperado) }}
                </span>
              </div>
            </div>

            <!-- Cierre / arqueo -->
            <div v-if="detalle.caja.estado === 'cerrada'" class="border-t border-gray-100 pt-4">
              <h3 class="text-sm font-bold text-gray-700 mb-2">Cierre de caja</h3>
              <div class="grid grid-cols-2 gap-x-6 gap-y-2">
                <div class="text-sm text-gray-500">Efectivo contado al cerrar</div>
                <div class="text-sm text-gray-800 text-right font-medium">
                  {{ detalle.resumen.montoContado !== null ? `$${formatMonto(detalle.resumen.montoContado)}` : 'No se registró conteo' }}
                </div>

                <template v-if="detalle.resumen.diferencia !== null">
                  <div class="text-sm text-gray-500">Diferencia</div>
                  <div
                    class="text-sm text-right font-bold"
                    :class="detalle.resumen.diferencia === 0 ? 'text-gray-700' : (detalle.resumen.diferencia > 0 ? 'text-green-600' : 'text-red-600')"
                  >
                    {{ detalle.resumen.diferencia === 0 ? 'Coincide exactamente' : `${detalle.resumen.diferencia > 0 ? '+' : ''}$${formatMonto(detalle.resumen.diferencia)}` }}
                  </div>
                </template>
              </div>
              <p v-if="detalle.caja.observaciones" class="text-xs text-gray-500 mt-3 italic">
                "{{ detalle.caja.observaciones }}"
              </p>
            </div>

            <!-- Egresos manuales -->
            <div v-if="detalle.egresos.length > 0" class="border-t border-gray-100 pt-4 mt-4">
              <h3 class="text-sm font-bold text-gray-700 mb-2">Egresos manuales</h3>
              <div v-for="egreso in detalle.egresos" :key="egreso.id_movimiento" class="flex justify-between text-sm py-1">
                <span class="text-gray-600">
                  {{ formatearFecha(egreso.fecha_hora) }} — {{ egreso.descripcion || 'Sin descripción' }}
                  <span class="text-gray-400 text-xs">({{ egreso.trabajador?.nombre }} {{ egreso.trabajador?.apellido }})</span>
                </span>
                <span class="text-red-500 font-medium">-${{ formatMonto(egreso.monto) }}</span>
              </div>
            </div>
          </div>

          <!-- ============================================ -->
          <!-- TAB: VENTAS -->
          <!-- ============================================ -->
          <div v-else>
            <div v-if="detalle.ventas.length === 0" class="text-center text-gray-400 text-sm py-10">
              Todavía no hay ventas registradas en esta caja.
            </div>
            <div v-else class="space-y-3">
              <div
                v-for="venta in detalle.ventas"
                :key="venta.id_venta"
                class="border border-gray-100 rounded-lg p-3"
              >
                <div class="flex justify-between items-start mb-2">
                  <div>
                    <span class="text-sm font-semibold text-gray-800">Venta #{{ venta.id_venta }}</span>
                    <span class="text-xs text-gray-400 ml-2">{{ formatearFecha(venta.fecha_hora) }}</span>
                    <p class="text-xs text-gray-500 mt-0.5">
                      {{ venta.trabajador?.nombre }} {{ venta.trabajador?.apellido }}
                      ·
                      {{ venta.cliente ? `${venta.cliente.nombre} ${venta.cliente.apellido}` : 'Cliente General' }}
                    </p>
                  </div>
                  <div class="text-right shrink-0">
                    <div class="text-sm font-bold text-gray-800">${{ formatMonto(venta.total_neto) }}</div>
                    <div class="text-xs text-gray-400">
                      {{ venta.metodos_pago.map(m => m.nombre).join(', ') }}
                    </div>
                  </div>
                </div>
                <ul class="text-xs text-gray-500 pl-3 border-l-2 border-gray-100">
                  <li v-for="(item, idx) in venta.productos" :key="idx">
                    {{ item.cantidad }}× {{ item.nombre_producto }}
                    <span v-if="item.monto_descuento_total > 0" class="text-green-600">
                      (-${{ formatMonto(item.monto_descuento_total) }} desc.)
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </template>

        <div v-else class="text-center text-red-400 text-sm py-10">
          No se pudo cargar el detalle de esta caja.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import axios from 'axios'
import { useAuthStore } from '../../stores/auth'

const props = defineProps({
  visible: { type: Boolean, default: false },
  idCaja: { type: [Number, String], default: null }
})

const emit = defineEmits(['close'])

const authStore = useAuthStore()
const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const tab = ref('resumen')
const detalle = ref(null)
const cargando = ref(false)

const cargarDetalle = async () => {
  if (!props.idCaja) return
  cargando.value = true
  detalle.value = null
  try {
    const response = await axios.get(`${baseUrl}/api/cajas/${props.idCaja}/detalle`, {
      headers: { 'Authorization': `Bearer ${authStore.token}` }
    })
    detalle.value = response.data
  } catch (error) {
    console.error('Error cargando detalle de caja:', error)
  } finally {
    cargando.value = false
  }
}

watch(() => [props.visible, props.idCaja], ([esVisible]) => {
  if (esVisible) {
    tab.value = 'resumen'
    cargarDetalle()
  }
})

const cerrar = () => emit('close')

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
