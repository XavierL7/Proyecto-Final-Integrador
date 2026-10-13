<template>
  <div class="min-h-screen font-montserrat">

    <main class="max-w-7xl mx-auto px-4 pt-24 pb-12">
      <!-- Título de la sección -->
      <div class="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 class="text-3xl font-extrabold">Gestión de Clientes</h1>
          <p class="text-sm text-slate-500">Registrá y gestioná la información de tus clientes</p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <!-- Formulario de Registro -->
        <div
          v-if="authStore.tienePermiso('Agregar_Clientes') || authStore.tienePermiso('Editar_Clientes')"
          class="p-6 rounded-2xl shadow-md border border-slate-200/80 h-fit"
        >
          <h2 class="text-xl font-bold mb-4">
            {{ editando ? 'Editar Cliente' : 'Nuevo Cliente' }}
          </h2>
          
          <form @submit.prevent="guardarCliente" class="space-y-4">
            <div>
              <label class="block text-xs font-semibold mb-1">Nombre</label>
              <input 
                v-model="nuevoCliente.nombre" 
                type="text" 
                required 
                placeholder="Ej. Juan"
                class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label class="block text-xs font-semibold mb-1">Apellido</label>
              <input 
                v-model="nuevoCliente.apellido" 
                type="text" 
                required 
                placeholder="Ej. Pérez"
                class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label class="block text-xs font-semibold mb-1">DNI</label>
              <input 
                v-model="nuevoCliente.dni" 
                type="number" 
                required 
                placeholder="Sin puntos"
                class="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label class="block text-xs font-semibold mb-1">Teléfono</label>
              <input 
                v-model="nuevoCliente.telefono" 
                type="text" 
                placeholder="Ej. 11 1234-5678"
                class="w-full  border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label class="block text-xs font-semibold mb-1">Fecha de última compra</label>
              <input 
                v-model="nuevoCliente.fecha_ultima_compra" 
                type="date" 
                class="w-full  border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div class="flex gap-2">
              <button 
                type="submit" 
                :disabled="cargando"
                class="w-full text-white font-bold py-2.5 rounded-lg transition-all shadow-md text-sm disabled:opacity-50"
                style="background: linear-gradient(135deg, #14b8a6, #34e5eb);"
              >
                {{ cargando ? 'Guardando...' : (editando ? 'Actualizar Cliente' : 'Guardar Cliente') }}
              </button>

              <button 
                v-if="editando"
                type="button" 
                @click="resetearFormulario"
                class="px-3 py-2.5 bg-slate-200 text-slate-700 font-semibold rounded-lg text-sm hover:bg-slate-300 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>

        <!-- Tabla / Lista de Clientes -->
        <div class="lg:col-span-2 p-6 rounded-2xl shadow-md border border-slate-200/80 overflow-hidden">
          <h2 class="text-xl font-bold mb-3">Listado de Clientes</h2>

          <!-- Búsqueda y filtros (los resuelve el backend sobre todos los clientes) -->
          <div class="flex flex-wrap items-center gap-2 mb-3">
            <input
              v-model="filtros.q"
              type="text"
              placeholder="Buscar por nombre, apellido, DNI o teléfono..."
              class="h-8 px-2.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500 flex-1 min-w-[200px]"
            />
            <select v-model="filtros.estado" class="h-8 px-2.5 text-xs border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-teal-500">
              <option value="">Todos los estados</option>
              <option value="activo">Activos</option>
              <option value="inactivo">Deshabilitados</option>
            </select>
            <button
              v-if="hayFiltros"
              @click="limpiarFiltros"
              class="h-8 px-2.5 text-xs text-slate-500 hover:text-red-600 border border-slate-300 rounded-md hover:bg-slate-50 transition"
            >
              ✕ Limpiar
            </button>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="border-b border-slate-200 text-xs font-semibold uppercase">
                  <th class="p-3">DNI</th>
                  <th class="p-3">Nombre Completo</th>
                  <th class="p-3">Teléfono</th>
                  <th class="p-3">Última Compra</th>
                  <th class="p-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 text-sm">
                <tr v-if="clientes.length === 0">
                  <td colspan="5" class="p-4 text-center">
                    {{ hayFiltros ? 'No se encontraron clientes con esos filtros.' : 'No hay clientes registrados aún.' }}
                  </td>
                </tr>
                <tr v-for="cliente in clientes" :key="cliente.id_cliente" class="hover:bg-slate-50/80 transition-colors" :class="{ 'opacity-50': cliente.activo === false }">
                  <td class="p-3 font-medium">{{ cliente.dni }}</td>
                  <td class="p-3 font-semibold">
                    {{ cliente.nombre }} {{ cliente.apellido }}
                    <span v-if="cliente.activo === false" class="ml-2 text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">Deshabilitado</span>
                  </td>
                  <td class="p-3">{{ cliente.telefono || '-' }}</td>
                  <td class="p-3">
                    {{ cliente.fecha_ultima_compra ? new Date(cliente.fecha_ultima_compra).toLocaleDateString('es-AR', { timeZone: 'UTC' }) : '-' }}
                  </td>

                  <td class="p-3">
                    <div class="flex items-center justify-end gap-2">
                    <button
                      v-if="authStore.tienePermiso('Editar_Clientes')"
                        @click="seleccionarParaEditar(cliente)"
                        class="flex items-center justify-center w-8 h-8 rounded-lg  bg-emerald-50 hover:bg-emerald-100 text-emerald-600  transition-colors"
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

          <!-- Controles de paginación -->
          <div class="flex justify-between items-center mt-4">
            <span class="text-sm text-slate-500">
              Página {{ paginaActual }} de {{ totalPaginas }} ({{ totalClientes }} clientes)
            </span>
            <div class="flex gap-2">
              <button
                @click="irAPaginaAnterior"
                :disabled="paginaActual === 1"
                class="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 hover:text-slate-900 text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                ← Anterior
              </button>
              <button
                @click="irAPaginaSiguiente"
                :disabled="paginaActual === totalPaginas"
                class="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 hover:text-slate-900 text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                Siguiente →
              </button>
            </div>
          </div>
        </div>

      </div>
    </main>
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

const nuevoCliente = ref({
  id_cliente: null,
  nombre: '',
  apellido: '',
  dni: '',
  telefono: '',
  fecha_ultima_compra: ''
})

// ============================================================
// FUNCIONES API (NODE.JS)
// ============================================================

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

// Cargar datos en el formulario para editar
const seleccionarParaEditar = (cliente) => {
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