<!-- frontend/src/views/CajasView.vue -->
<template>
  <div class="p-6 max-w-5xl mx-auto">
    <h1 class="text-2xl font-bold text-gray-800 mb-6">Cajas</h1>

    <!-- Aviso si vino redirigido desde /ventas por no tener caja abierta -->
    <div
      v-if="mensajeRedireccion"
      class="mb-6 p-4 bg-amber-50 border border-amber-300 rounded-lg text-sm text-amber-800"
    >
      {{ mensajeRedireccion }}
    </div>

    <!-- ============================================================ -->
    <!-- ESTADO ACTUAL: hay caja abierta o no -->
    <!-- ============================================================ -->
    <div class="bg-white rounded-lg shadow p-6 mb-6">
      <div v-if="cargandoActiva" class="text-gray-400 text-sm">Cargando estado de caja...</div>

      <!-- Hay una caja abierta -->
      <div v-else-if="cajaActiva">
        <div class="flex items-start justify-between">
          <div>
            <span class="inline-block text-xs font-semibold bg-green-100 text-green-700 px-2 py-1 rounded mb-2">
              Caja #{{ cajaActiva.id_caja }} abierta
            </span>
            <p class="text-sm text-gray-600">
              Abierta por
              <strong>{{ cajaActiva.trabajador_apertura?.nombre }} {{ cajaActiva.trabajador_apertura?.apellido }}</strong>
              el {{ formatearFecha(cajaActiva.fecha_hora_apertura) }}
            </p>
            <p class="text-sm text-gray-600 mt-1">
              Monto inicial: <strong>${{ Number(cajaActiva.monto_inicial).toFixed(2) }}</strong>
            </p>
          </div>

          <button
            v-if="!mostrarFormCierre"
            @click="mostrarFormCierre = true"
            class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm font-semibold"
          >
            Cerrar Caja
          </button>
        </div>

        <!-- Formulario de cierre -->
        <div v-if="mostrarFormCierre" class="mt-5 pt-5 border-t border-gray-200">
          <label class="block text-sm text-gray-600 mb-1">
            Monto real contado en el cajón (opcional)
          </label>
          <input
            v-model="montoFinalReal"
            type="number"
            step="0.01"
            placeholder="Ej: 15000"
            class="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 mb-3"
          />
          <p class="text-xs text-gray-400 mb-4">
            Si no lo completás, la caja igual se cierra y podés cargar el conteo después.
          </p>

          <label class="block text-sm text-gray-600 mb-1">Observaciones (opcional)</label>
          <textarea
            v-model="observacionesCierre"
            rows="2"
            placeholder="Ej: faltaron $200, se usaron para comprar hielo"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 mb-4 text-sm"
          ></textarea>

          <div class="flex gap-3">
            <button
              @click="mostrarFormCierre = false"
              class="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 text-sm"
            >
              Cancelar
            </button>
            <button
              @click="confirmarCierreCaja"
              :disabled="cerrando"
              class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm font-semibold disabled:opacity-50"
            >
              {{ cerrando ? 'Cerrando...' : 'Confirmar cierre y salir' }}
            </button>
          </div>
          <p class="text-xs text-gray-500 mt-2">
            Al confirmar, se cierra tu sesión y volvés a la página principal.
          </p>
        </div>
      </div>

      <!-- No hay caja abierta: formulario de apertura -->
      <div v-else>
        <p class="text-sm text-gray-600 mb-4">
          No hay ninguna caja abierta. Abrí una para poder registrar ventas.
        </p>
        <label class="block text-sm text-gray-600 mb-1">Monto inicial en caja</label>
        <input
          v-model="montoInicial"
          type="number"
          step="0.01"
          placeholder="Ej: 5000"
          class="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 mb-1"
        />
        <p v-if="montoSugerido !== null" class="text-xs text-gray-400 mb-4">
          La última caja cerró con ${{ montoSugerido.toFixed(2) }} contados.
          <button @click="montoInicial = montoSugerido" type="button" class="text-teal-600 hover:underline">
            Usar ese monto
          </button>
        </p>
        <div v-else class="mb-4"></div>
        <div>
          <button
            @click="abrirCaja"
            :disabled="abriendo"
            class="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition text-sm font-semibold disabled:opacity-50"
          >
            {{ abriendo ? 'Abriendo...' : 'Abrir Caja' }}
          </button>
        </div>
      </div>
    </div>

    <!-- ============================================================ -->
    <!-- HISTORIAL DE CAJAS -->
    <!-- ============================================================ -->
    <h2 class="text-lg font-bold text-gray-800 mb-3">Historial</h2>
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase">
              <th class="px-4 py-3">#</th>
              <th class="px-4 py-3">Apertura</th>
              <th class="px-4 py-3">Cierre</th>
              <th class="px-4 py-3">Abrió</th>
              <th class="px-4 py-3">Cerró</th>
              <th class="px-4 py-3 text-right">Inicial</th>
              <th class="px-4 py-3 text-right">Esperado</th>
              <th class="px-4 py-3 text-right">Real</th>
              <th class="px-4 py-3">Estado</th>
              <th class="px-4 py-3">Observaciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 text-sm">
            <tr v-if="cargandoHistorial">
              <td colspan="10" class="px-4 py-6 text-center text-gray-400">Cargando...</td>
            </tr>
            <tr v-else-if="cajas.length === 0">
              <td colspan="10" class="px-4 py-6 text-center text-gray-400">Todavía no hay cajas registradas.</td>
            </tr>
            <tr v-for="caja in cajas" :key="caja.id_caja" class="hover:bg-gray-50">
              <td class="px-4 py-3 text-gray-700">#{{ caja.id_caja }}</td>
              <td class="px-4 py-3 text-gray-700 whitespace-nowrap">{{ formatearFecha(caja.fecha_hora_apertura) }}</td>
              <td class="px-4 py-3 text-gray-700 whitespace-nowrap">
                {{ caja.fecha_hora_cierre ? formatearFecha(caja.fecha_hora_cierre) : '-' }}
              </td>
              <td class="px-4 py-3 text-gray-700 whitespace-nowrap">
                {{ caja.trabajador_apertura?.nombre }} {{ caja.trabajador_apertura?.apellido }}
              </td>
              <td class="px-4 py-3 text-gray-700 whitespace-nowrap">
                {{ caja.trabajador_cierre ? `${caja.trabajador_cierre.nombre} ${caja.trabajador_cierre.apellido}` : '-' }}
              </td>
              <td class="px-4 py-3 text-right text-gray-700">${{ Number(caja.monto_inicial).toFixed(2) }}</td>
              <td class="px-4 py-3 text-right text-gray-700">
                {{ caja.monto_final_esperado !== null ? `$${Number(caja.monto_final_esperado).toFixed(2)}` : '-' }}
              </td>
              <td class="px-4 py-3 text-right text-gray-700">
                {{ caja.monto_final_real !== null ? `$${Number(caja.monto_final_real).toFixed(2)}` : '-' }}
              </td>
              <td class="px-4 py-3">
                <span
                  class="text-xs font-semibold px-2 py-1 rounded"
                  :class="caja.estado === 'abierta' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'"
                >
                  {{ caja.estado }}
                </span>
              </td>
              <td class="px-4 py-3 text-gray-500 text-xs max-w-xs">
                {{ caja.arqueos_caja?.[0]?.observaciones || '-' }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()
const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const mensajeRedireccion = computed(() => {
  if (route.query.motivo === 'necesita-caja') {
    return 'Necesitás abrir una caja antes de poder registrar ventas.'
  }
  if (route.query.motivo === 'error-verificacion') {
    return 'No pudimos verificar si tenías una caja abierta. Revisá tu conexión e intentá de nuevo.'
  }
  return null
})

const headers = () => ({ headers: { 'Authorization': `Bearer ${authStore.token}` } })

// ============================================================
// CAJA ACTIVA
// ============================================================
const cajaActiva = ref(null)
const cargandoActiva = ref(true)

const cargarCajaActiva = async () => {
  cargandoActiva.value = true
  try {
    const response = await axios.get(`${baseUrl}/api/cajas/activa`, headers())
    cajaActiva.value = response.data
  } catch (error) {
    console.error('Error cargando caja activa:', error)
  } finally {
    cargandoActiva.value = false
  }
}

// ============================================================
// ABRIR CAJA
// ============================================================
const montoInicial = ref('')
const abriendo = ref(false)

// Sugerencia: lo que quedó contado (monto_final_real) en la última caja
// que se cerró. No lo forzamos -> el admin puede ajustarlo si hace falta
// (por ejemplo, si se retiró plata para otra cosa antes de abrir la
// nueva caja).
const montoSugerido = computed(() => {
  const ultimaCerrada = cajas.value.find(c => c.estado === 'cerrada' && c.monto_final_real !== null)
  return ultimaCerrada ? Number(ultimaCerrada.monto_final_real) : null
})

const abrirCaja = async () => {
  if (montoInicial.value === '' || Number(montoInicial.value) < 0) {
    alert('Ingresá un monto inicial válido.')
    return
  }
  abriendo.value = true
  try {
    await axios.post(`${baseUrl}/api/cajas`, { monto_inicial: montoInicial.value }, headers())
    montoInicial.value = ''
    await cargarCajaActiva()
    await cargarHistorial()
  } catch (error) {
    alert(error.response?.data?.error || 'Error al abrir la caja')
  } finally {
    abriendo.value = false
  }
}

// ============================================================
// CERRAR CAJA (desloguea y vuelve a la landing page)
// ============================================================
const mostrarFormCierre = ref(false)
const montoFinalReal = ref('')
const observacionesCierre = ref('')
const cerrando = ref(false)

const confirmarCierreCaja = async () => {
  if (!cajaActiva.value) return
  cerrando.value = true
  try {
    const response = await axios.put(
      `${baseUrl}/api/cajas/${cajaActiva.value.id_caja}/cerrar`,
      {
        monto_final_real: montoFinalReal.value !== '' ? montoFinalReal.value : null,
        observaciones: observacionesCierre.value.trim() || null
      },
      headers()
    )

    if (response.data.diferencia !== null && response.data.diferencia !== undefined) {
      const dif = response.data.diferencia
      if (dif !== 0) {
        alert(dif > 0
          ? `Caja cerrada. Sobraron $${dif.toFixed(2)} respecto de lo esperado.`
          : `Caja cerrada. Faltaron $${Math.abs(dif).toFixed(2)} respecto de lo esperado.`)
      } else {
        alert('Caja cerrada. El conteo coincide exactamente con lo esperado.')
      }
    } else {
      alert('Caja cerrada correctamente.')
    }

    // Cerrar caja = terminar el turno: deslogueamos y volvemos al inicio.
    authStore.logout()
    router.push('/pagina')
  } catch (error) {
    alert(error.response?.data?.error || 'Error al cerrar la caja')
  } finally {
    cerrando.value = false
  }
}

// ============================================================
// HISTORIAL
// ============================================================
const cajas = ref([])
const cargandoHistorial = ref(true)

const cargarHistorial = async () => {
  cargandoHistorial.value = true
  try {
    const response = await axios.get(`${baseUrl}/api/cajas`, headers())
    cajas.value = response.data
  } catch (error) {
    console.error('Error cargando historial de cajas:', error)
  } finally {
    cargandoHistorial.value = false
  }
}

const formatearFecha = (fecha) => {
  return new Date(fecha).toLocaleString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(() => {
  cargarCajaActiva()
  cargarHistorial()
})
</script>
