<template>
  <div class="min-h-screen bg-[#f1f5f9] font-montserrat">

    <main class="max-w-7xl mx-auto px-4 pt-24 pb-12">
      <!-- Título de la sección -->
      <div class="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 class="text-3xl font-extrabold text-[#131b2e]">Gestión de Clientes</h1>
          <p class="text-sm text-slate-500">Registrá y gestioná la información de tus clientes</p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <!-- Formulario de Registro -->
        <div class="bg-white p-6 rounded-2xl shadow-md border border-slate-200/80 h-fit">
          <h2 class="text-xl font-bold text-[#131b2e] mb-4">
            {{ editando ? 'Editar Cliente' : 'Nuevo Cliente' }}
          </h2>
          
          <form @submit.prevent="guardarCliente" class="space-y-4">
            <!-- El ID se omitió porque es autoincremental -->
            
            <div>
              <label class="block text-xs font-semibold text-slate-600 mb-1">Nombre</label>
              <input 
                v-model="nuevoCliente.nombre" 
                type="text" 
                required 
                placeholder="Ej. Juan"
                class="w-full bg-slate-100 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-600 mb-1">Apellido</label>
              <input 
                v-model="nuevoCliente.apellido" 
                type="text" 
                required 
                placeholder="Ej. Pérez"
                class="w-full bg-slate-100 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-600 mb-1">DNI</label>
              <input 
                v-model="nuevoCliente.dni" 
                type="number" 
                required 
                placeholder="Sin puntos"
                class="w-full bg-slate-100 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-600 mb-1">Teléfono</label>
              <input 
                v-model="nuevoCliente.telefono" 
                type="text" 
                placeholder="Ej. 11 1234-5678"
                class="w-full bg-slate-100 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label class="block text-xs font-semibold text-slate-600 mb-1">Fecha de última compra</label>
              <input 
                v-model="nuevoCliente.fecha_ultima_compra" 
                type="date" 
                class="w-full bg-slate-100 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
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
        <div class="lg:col-span-2 bg-white p-6 rounded-2xl shadow-md border border-slate-200/80 overflow-hidden">
          <h2 class="text-xl font-bold text-[#131b2e] mb-4">Listado de Clientes</h2>

          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase bg-slate-50">
                  <th class="p-3">DNI</th>
                  <th class="p-3">Nombre Completo</th>
                  <th class="p-3">Teléfono</th>
                  <th class="p-3">Última Compra</th>
                  <th class="p-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 text-sm">
                <tr v-if="clientes.length === 0">
                  <td colspan="5" class="p-4 text-center text-slate-400">No hay clientes registrados aún.</td>
                </tr>
                <tr v-for="cliente in clientes" :key="cliente.id_cliente" class="hover:bg-slate-50/80 transition-colors">
                  <td class="p-3 font-medium text-slate-700">{{ cliente.dni }}</td>
                  <td class="p-3 text-slate-900 font-semibold">{{ cliente.nombre }} {{ cliente.apellido }}</td>
                  <td class="p-3 text-slate-600">{{ cliente.telefono || '-' }}</td>
                  <td class="p-3 text-slate-600">
                    {{ cliente.fecha_ultima_compra ? new Date(cliente.fecha_ultima_compra).toLocaleDateString('es-AR', { timeZone: 'UTC' }) : '-' }}
                  </td>
                  <td class="p-3 text-right space-x-2">
                    <button 
                      @click="seleccionarParaEditar(cliente)" 
                      class="text-teal-600 font-semibold hover:underline text-xs"
                    >
                      Editar
                    </button>
                    <button 
                      @click="eliminarCliente(cliente.id_cliente)" 
                      class="text-rose-500 font-semibold hover:underline text-xs"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
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

// Cargar listado de clientes
const obtenerClientes = async () => {
  try {
    const response = await axios.get(`${baseUrl}/api/clientes`, {
      headers: { 'Authorization': `Bearer ${authStore.token}` }
    })
    clientes.value = response.data
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