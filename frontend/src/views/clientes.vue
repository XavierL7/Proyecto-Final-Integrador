<template>
  <div class="p-6 max-w-6xl mx-auto">
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-2xl font-bold">Gestión de Clientes</h1>
        <p class="text-sm text-gray-500">Registrá y gestioná la información de tus clientes</p>
      </div>
      <button
        v-if="authStore.tienePermiso('Agregar_Clientes')"
        @click="abrirModal()"
        class="bg-blue-500 px-5 py-2 text-white rounded-lg hover:bg-blue-600 transition shadow-sm hover:shadow"
      >
        + Nuevo Cliente
      </button>
    </div>

    <!-- Búsqueda y filtros (los resuelve el backend sobre todos los clientes) -->
    <div class="flex flex-wrap items-center gap-2 mb-3">
      <input
        v-model="filtros.q"
        type="text"
        placeholder="Buscar por nombre, apellido, DNI o teléfono..."
        class="h-8 px-2.5 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 flex-1 min-w-[220px]"
      />
      <select
        v-model="filtros.estado"
        class="h-8 px-2.5 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
      >
        <option value="">Todos los estados</option>
        <option value="activo">Activos</option>
        <option value="inactivo">Deshabilitados</option>
      </select>
      <button
        v-if="hayFiltros"
        @click="limpiarFiltros"
        class="h-8 px-2.5 text-xs text-gray-500 hover:text-red-600 border border-gray-300 rounded-md hover:bg-gray-50 transition"
      >
        ✕ Limpiar
      </button>
    </div>

    <!-- Tabla / Lista de Clientes -->
    <div class="rounded-lg shadow overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-gray-200 text-xs font-semibold uppercase">
              <th class="px-4 py-3">DNI</th>
              <th class="px-4 py-3">Nombre Completo</th>
              <th class="px-4 py-3">Teléfono</th>
              <th class="px-4 py-3">Última Compra</th>
              <th class="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 text-sm">
            <tr v-if="clientes.length === 0">
              <td colspan="5" class="px-4 py-6 text-center text-gray-500">
                {{ hayFiltros ? 'No se encontraron clientes con esos filtros.' : 'No hay clientes registrados aún.' }}
              </td>
            </tr>
            <tr v-for="cliente in clientes" :key="cliente.id_cliente" class="hover:bg-gray-50" :class="{ 'opacity-50': cliente.activo === false }">
              <td class="px-4 py-3 font-medium">{{ cliente.dni }}</td>
              <td class="px-4 py-3 font-medium">
                {{ cliente.nombre }} {{ cliente.apellido }}
                <span v-if="cliente.activo === false" class="ml-2 text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">Deshabilitado</span>
              </td>
              <td class="px-4 py-3">{{ cliente.telefono || '-' }}</td>
              <td class="px-4 py-3">
                {{ cliente.fecha_ultima_compra ? new Date(cliente.fecha_ultima_compra).toLocaleDateString('es-AR', { timeZone: 'UTC' }) : '-' }}
              </td>

              <td class="px-4 py-3 text-right whitespace-nowrap">
                <div class="flex items-center justify-end gap-2">
                  <button
                    v-if="authStore.tienePermiso('Editar_Clientes')"
                    @click="abrirModal(cliente)"
                    class="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-600 transition-colors"
                    title="Editar"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M12 20h9"/>
                      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
                    </svg>
                  </button>
                  <button
                    v-if="authStore.tienePermiso('Deshabilitar_Clientes')"
                    @click="toggleActivaCliente(cliente)"
                    class="flex items-center justify-center w-8 h-8 rounded-lg bg-orange-50 hover:bg-orange-100 text-orange-500 transition-colors"
                    :title="cliente.activo === false ? 'Habilitar' : 'Deshabilitar'"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <rect x="6" y="4" width="4" height="16" rx="1"/>
                      <rect x="14" y="4" width="4" height="16" rx="1"/>
                    </svg>
                  </button>
                  <button
                    v-if="authStore.tienePermiso('Deshabilitar_Clientes')"
                    @click="eliminarCliente(cliente.id_cliente)"
                    class="flex items-center justify-center w-8 h-8 rounded-lg bg-orange-50 hover:bg-orange-100 text-orange-500 transition-colors"
                    title="Eliminar"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M3 6h18"/>
                      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                      <line x1="10" x2="10" y1="11" y2="17"/>
                      <line x1="14" x2="14" y1="11" y2="17"/>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Controles de paginación -->
    <div class="flex justify-between items-center mt-4">
      <span class="text-sm text-gray-500">
        Página {{ paginaActual }} de {{ totalPaginas }} ({{ totalClientes }} clientes)
      </span>
      <div class="flex gap-2">
        <button
          @click="irAPaginaAnterior"
          :disabled="paginaActual === 1"
          class="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-white text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          ← Anterior
        </button>
        <button
          @click="irAPaginaSiguiente"
          :disabled="paginaActual === totalPaginas"
          class="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-white text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          Siguiente →
        </button>
      </div>
    </div>

    <!-- ======================================================== -->
    <!-- MODAL: CLIENTE (CREAR / EDITAR)                          -->
    <!-- ======================================================== -->
    <div
      v-if="modalVisible"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm"
      @click.self="modalVisible = false"
    >
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto text-gray-800">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-bold">
            {{ editando ? 'Editar Cliente' : 'Nuevo Cliente' }}
          </h2>
          <button @click="modalVisible = false" class="text-gray-400 hover:text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form @submit.prevent="guardarCliente" class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1">Nombre</label>
            <input
              v-model="nuevoCliente.nombre"
              type="text"
              required
              placeholder="Ej. Juan"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">Apellido</label>
            <input
              v-model="nuevoCliente.apellido"
              type="text"
              required
              placeholder="Ej. Pérez"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">DNI</label>
            <input
              v-model="nuevoCliente.dni"
              type="number"
              required
              placeholder="Sin puntos"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">Teléfono</label>
            <input
              v-model="nuevoCliente.telefono"
              type="text"
              placeholder="Ej. 11 1234-5678"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">Fecha de última compra</label>
            <input
              v-model="nuevoCliente.fecha_ultima_compra"
              type="date"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div class="flex justify-end gap-3 mt-6">
            <button type="button" @click="modalVisible = false" class="px-5 py-2.5 text-gray-600 hover:text-gray-800 dark:hover:bg-slate-700 rounded-xl hover:bg-gray-100 transition">
              Cancelar
            </button>
            <button
              type="submit"
              :disabled="cargando"
              class="px-5 py-2.5 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition disabled:opacity-50"
            >
              {{ cargando ? 'Guardando...' : (editando ? 'Actualizar' : 'Guardar') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import axios from 'axios'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'

// ============================================================
// DATOS Y ESTADOS
// ============================================================
const clientes = ref([])
const cargando = ref(false)
const editando = ref(false)
const modalVisible = ref(false)

const nuevoCliente = ref({
  id_cliente: null,
  nombre: '',
  apellido: '',
  dni: '',
  telefono: '',
  fecha_ultima_compra: ''
})

// ============================================================
// PAGINACIÓN Y FILTROS (los resuelve el backend)
// ============================================================
const paginaActual = ref(1)
const totalPaginas = ref(1)
const totalClientes = ref(0)
const porPagina = 10

const filtrosVacios = () => ({ q: '', estado: '' })
const filtros = ref(filtrosVacios())
const hayFiltros = computed(() => Object.values(filtros.value).some(v => v !== ''))

const irAPaginaAnterior = () => {
  if (paginaActual.value > 1) {
    paginaActual.value--
    obtenerClientes()
  }
}

const irAPaginaSiguiente = () => {
  if (paginaActual.value < totalPaginas.value) {
    paginaActual.value++
    obtenerClientes()
  }
}

// Cada cambio de búsqueda o filtro vuelve a la página 1 (el resultado
// cambia el total de páginas). Esperamos 300 ms para no pedirle al
// servidor en cada tecla.
const aplicarFiltros = () => {
  paginaActual.value = 1
  obtenerClientes()
}

let temporizadorFiltros = null
watch(filtros, () => {
  clearTimeout(temporizadorFiltros)
  temporizadorFiltros = setTimeout(aplicarFiltros, 300)
}, { deep: true })

const limpiarFiltros = () => {
  filtros.value = filtrosVacios()
}

// Si el usuario escribe rápido pueden llegar respuestas fuera de orden:
// nos quedamos solo con la de la última petición.
let ultimaPeticion = 0

// ============================================================
// FUNCIONES API (NODE.JS)
// ============================================================

// Cargar listado de clientes (página actual + filtros)
const obtenerClientes = async () => {
  const numeroPeticion = ++ultimaPeticion
  try {
    const response = await axios.get(`${baseUrl}/api/clientes`, {
      headers: { 'Authorization': `Bearer ${authStore.token}` },
      params: {
        page: paginaActual.value,
        limit: porPagina,
        q: filtros.value.q.trim() || undefined,
        estado: filtros.value.estado || undefined
      }
    })
    if (numeroPeticion !== ultimaPeticion) return

    // Si la página quedó vacía (ej: se eliminó o deshabilitó el último
    // cliente de la última página), volvemos a la última que exista.
    if (response.data.clientes.length === 0 && paginaActual.value > 1) {
      paginaActual.value = Math.max(1, response.data.totalPages)
      return obtenerClientes()
    }

    clientes.value = response.data.clientes
    totalPaginas.value = response.data.totalPages
    totalClientes.value = response.data.total
  } catch (error) {
    console.error('Error cargando clientes:', error)
  }
}

// Abre el modal: sin argumento = alta nueva, con un cliente = edición
const abrirModal = (cliente = null) => {
  if (cliente) {
    editando.value = true
    nuevoCliente.value = {
      id_cliente: cliente.id_cliente,
      nombre: cliente.nombre || '',
      apellido: cliente.apellido || '',
      dni: cliente.dni || '',
      telefono: cliente.telefono || '',
      fecha_ultima_compra: cliente.fecha_ultima_compra
        ? new Date(cliente.fecha_ultima_compra).toISOString().split('T')[0]
        : ''
    }
  } else {
    resetearFormulario()
  }
  modalVisible.value = true
}

// Resetear el formulario al estado inicial
const resetearFormulario = () => {
  editando.value = false
  nuevoCliente.value = {
    id_cliente: null,
    nombre: '',
    apellido: '',
    dni: '',
    telefono: '',
    fecha_ultima_compra: ''
  }
}

// Guardar (POST) o Actualizar (PUT)
const guardarCliente = async () => {
  cargando.value = true

  try {
    const url = editando.value
      ? `${baseUrl}/api/clientes/${nuevoCliente.value.id_cliente}`
      : `${baseUrl}/api/clientes`
    const method = editando.value ? 'put' : 'post'

    const payload = {
      nombre: nuevoCliente.value.nombre.trim(),
      apellido: nuevoCliente.value.apellido.trim(),
      dni: parseInt(nuevoCliente.value.dni),
      telefono: nuevoCliente.value.telefono ? nuevoCliente.value.telefono.trim() : null,
      fecha_ultima_compra: nuevoCliente.value.fecha_ultima_compra || null
    }

    await axios[method](url, payload, {
      headers: { 'Authorization': `Bearer ${authStore.token}` }
    })

    modalVisible.value = false
    resetearFormulario()
    await obtenerClientes()
  } catch (error) {
    console.error('Error al guardar cliente:', error)
    alert(error.response?.data?.error || 'Error al guardar el cliente')
  } finally {
    cargando.value = false
  }
}

// Habilitar/deshabilitar un cliente sin borrarlo
const toggleActivaCliente = async (cliente) => {
  try {
    await axios.put(`${baseUrl}/api/clientes/${cliente.id_cliente}/activa`,
      { activo: cliente.activo === false }, // si estaba deshabilitado, lo habilita; si no, lo deshabilita
      { headers: { 'Authorization': `Bearer ${authStore.token}` } }
    )
    obtenerClientes()
  } catch (error) {
    console.error('Error cambiando estado del cliente:', error)
    alert(error.response?.data?.error || 'Error al cambiar el estado del cliente')
  }
}

// Eliminar un cliente
const eliminarCliente = async (id) => {
  if (!confirm('¿Seguro que querés eliminar este cliente?')) return
  try {
    await axios.delete(`${baseUrl}/api/clientes/${id}`, {
      headers: { 'Authorization': `Bearer ${authStore.token}` }
    })
    obtenerClientes()
  } catch (error) {
    console.error('Error al eliminar cliente:', error)
    alert(error.response?.data?.error || 'Error al eliminar cliente')
  }
}

// ============================================================
// LIFECYCLE
// ============================================================
onMounted(() => {
  obtenerClientes()
})
</script>