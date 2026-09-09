<!-- frontend/src/views/AsistenciasView.vue -->
<template>
  <div class="p-6 max-w-7xl mx-auto">
    <!-- TITULO DE PAGINA -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-2xl font-bold">Historial de Asistencias</h1>
        <p class="text-sm text-gray-500">Control de entradas, salidas y rendimiento por turno de empleados</p>
      </div>
      <button 
        @click="obtenerHistorial" 
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
        :disabled="cargando"
      >
        <span v-if="cargando" class="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
        <span>{{ cargando ? 'Cargando...' : 'Actualizar' }}</span>
      </button>
    </div>

    <!-- PANEL DE FILTROS -->
    <div class="bg-white rounded-lg shadow p-4 mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label class="block text-xs font-semibold text-gray-600 uppercase mb-1">Desde</label>
        <input 
          v-model="filtros.desde" 
          type="date" 
          class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
          @change="obtenerHistorial"
        />
      </div>

      <div>
        <label class="block text-xs font-semibold text-gray-600 uppercase mb-1">Hasta</label>
        <input 
          v-model="filtros.hasta" 
          type="date" 
          class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
          @change="obtenerHistorial"
        />
      </div>

      <div>
        <label class="block text-xs font-semibold text-gray-600 uppercase mb-1">Trabajador</label>
        <select 
          v-model="filtros.id_trabajador" 
          class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
          @change="obtenerHistorial"
        >
          <option value="">Todos los trabajadores</option>
          <option v-for="t in listaTrabajadores" :key="t.id_trabajador" :value="t.id_trabajador">
            {{ t.nombre }} {{ t.apellido }}
          </option>
        </select>
      </div>
    </div>

    <!-- TARJETAS CON METRICAS CLAVE -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <div class="bg-white p-5 rounded-lg shadow border-l-4 border-blue-500">
        <span class="text-xs font-bold text-gray-600 uppercase">Registros Totales</span>
        <div class="text-2xl font-bold text-gray-800 mt-1">{{ historial.length }}</div>
      </div>

      <div class="bg-white p-5 rounded-lg shadow border-l-4 border-indigo-500">
        <span class="text-xs font-bold text-gray-600 uppercase">Total Horas Acumuladas</span>
        <div class="text-2xl font-bold text-gray-800 mt-1">{{ totalHorasAcumuladas }} hs</div>
      </div>

      <div class="bg-white p-5 rounded-lg shadow border-l-4 border-green-500">
        <span class="text-xs font-bold text-gray-600 uppercase">Facturado en Turnos</span>
        <div class="text-2xl font-bold text-green-600 mt-1">${{ totalFacturadoFormat }}</div>
      </div>
    </div>

    <!-- TABLA DE HISTORIAL -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-gray-50 border-b text-xs font-semibold text-gray-600 uppercase">
              <th class="p-4">Trabajador</th>
              <th class="p-4">Entrada</th>
              <th class="p-4">Salida</th>
              <th class="p-4">Estado / Autenticación</th>
              <th class="p-4 text-center">Horas</th>
              <th class="p-4 text-right">Ventas del Turno</th>
            </tr>
          </thead>
          <tbody class="divide-y text-sm">
            <tr v-if="cargando">
              <td colspan="6" class="p-8 text-center text-gray-500">
                Cargando historial de asistencias...
              </td>
            </tr>

            <tr v-else-if="historial.length === 0">
              <td colspan="6" class="p-8 text-center text-gray-500">
                No se encontraron registros de asistencia para los filtros seleccionados.
              </td>
            </tr>

            <tr v-for="item in historial" :key="item.id_asistencia" class="hover:bg-gray-50 transition">
              <!-- Trabajador -->
              <td class="p-4">
                <div class="font-semibold">{{ item.trabajador.nombre_completo }}</div>
                <div class="text-xs">DNI: {{ item.trabajador.dni }} | {{ item.trabajador.rol }}</div>
              </td>

              <!-- Entrada -->
              <td class="p-4">
                <div class="font-medium">{{ formatearFecha(item.fecha_hora_entrada) }}</div>
                <div class="text-xs">{{ formatearHora(item.fecha_hora_entrada) }}</div>
              </td>

              <!-- Salida -->
              <td class="p-4">
                <template v-if="item.fecha_hora_salida">
                  <div class="font-medium">{{ formatearFecha(item.fecha_hora_salida) }}</div>
                  <div class="text-xs text-gray-600">{{ formatearHora(item.fecha_hora_salida) }}</div>
                </template>
                <span v-else class="text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-1 rounded">
                  En curso
                </span>
              </td>

              <!-- Estado y Autenticación -->
              <td class="p-4">
                <div class="flex items-center gap-2">
                  <span 
                    class="px-2 py-1 rounded text-xs font-semibold"
                    :class="item.turno_activo ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'"
                  >
                    {{ item.turno_activo ? 'Turno Activo' : 'Finalizado' }}
                  </span>
                  <span class="text-xs  capitalize">
                    ({{ item.tipo_autenticacion || 'Huella' }})
                  </span>
                </div>
              </td>

              <!-- Horas Trabajadas -->
              <td class="p-4 text-center font-bold">
                {{ item.horas_trabajadas }} hs
              </td>

              <!-- Métricas del Turno -->
              <td class="p-4 text-right">
                <div class="font-bold text-green-600">
                  ${{ item.metricas_turno.total_facturado.toLocaleString('es-AR', { minimumFractionDigits: 2 }) }}
                </div>
                <div class="text-xs">
                  {{ item.metricas_turno.cantidad_ventas }} venta(s)
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'
const getHeaders = () => ({ headers: { Authorization: `Bearer ${authStore.token}` } })

// ESTADOS
const historial = ref([])
const listaTrabajadores = ref([])
const cargando = ref(false)

const hoy = new Date().toISOString().split('T')[0]
const filtros = ref({
  desde: hoy,
  hasta: hoy,
  id_trabajador: ''
})

// COMPUTED
const totalHorasAcumuladas = computed(() => {
  const total = historial.value.reduce((sum, item) => sum + (item.horas_trabajadas || 0), 0)
  return total.toFixed(1)
})

const totalFacturadoFormat = computed(() => {
  const total = historial.value.reduce((sum, item) => sum + (item.metricas_turno?.total_facturado || 0), 0)
  return total.toLocaleString('es-AR', { minimumFractionDigits: 2 })
})

// MÉTODOS Y FORMATO
const formatearFecha = (strFecha) => {
  if (!strFecha) return '-'
  return new Date(strFecha).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

const formatearHora = (strFecha) => {
  if (!strFecha) return '-'
  return new Date(strFecha).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })
}

const obtenerHistorial = async () => {
  cargando.value = true
  try {
    const params = new URLSearchParams()
    if (filtros.value.desde) params.append('desde', filtros.value.desde)
    if (filtros.value.hasta) params.append('hasta', filtros.value.hasta)
    if (filtros.value.id_trabajador) params.append('id_trabajador', filtros.value.id_trabajador)

    const response = await axios.get(`${baseUrl}/api/asistencias/historial?${params.toString()}`, getHeaders())
    historial.value = response.data
  } catch (error) {
    console.error('Error al obtener el historial de asistencias:', error)
  } finally {
    cargando.value = false
  }
}

const cargarTrabajadores = async () => {
  try {
    const response = await axios.get(`${baseUrl}/api/admin/trabajadores`, getHeaders())
    listaTrabajadores.value = response.data
  } catch (error) {
    console.error('Error cargando lista de trabajadores:', error)
  }
}

onMounted(() => {
  cargarTrabajadores()
  obtenerHistorial()
})
</script>