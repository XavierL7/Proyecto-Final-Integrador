<!-- frontend/src/views/AdminView.vue -->
<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold text-gray-800 mb-6">Administración</h1>

    <!-- Tabs -->
    <div class="flex gap-2 border-b border-gray-200 mb-6">
      <button
        @click="tabActivo = 'roles'"
        class="px-4 py-2 font-medium transition-colors"
        :class="tabActivo === 'roles' 
          ? 'border-b-2 border-blue-500 text-blue-600' 
          : 'text-gray-500 hover:text-gray-700'"
      >
        Roles
      </button>
      <button
        @click="tabActivo = 'trabajadores'"
        class="px-4 py-2 font-medium transition-colors"
        :class="tabActivo === 'trabajadores' 
          ? 'border-b-2 border-blue-500 text-blue-600' 
          : 'text-gray-500 hover:text-gray-700'"
      >
        Trabajadores
      </button>
    </div>

    <!-- ======================================================== -->
    <!-- TAB 1: ROLES                                             -->
    <!-- ======================================================== -->
    <div v-if="tabActivo === 'roles'">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-semibold text-gray-700">Roles del sistema</h2>
        <button
          @click="abrirModalRol()"
          class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
        >
          + Nuevo Rol
        </button>
      </div>

      <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="rol in roles"
          :key="rol.id_rol"
          class="bg-white p-4 rounded-lg shadow border border-gray-200"
        >
          <div class="flex justify-between items-start">
            <div>
              <h3 class="font-semibold text-gray-800">{{ rol.nombre_rol }}</h3>
              <p class="text-sm text-gray-500">
                {{ rol.roles_funcionalidades?.length || 0 }} permisos
              </p>
              <div class="flex flex-wrap gap-1 mt-2">
                <span
                  v-for="rf in rol.roles_funcionalidades"
                  :key="rf.id_func"
                  class="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded"
                >
                  {{ rf.funcionalidad?.nombre_func || 'Sin nombre' }}
                </span>
              </div>
            </div>
            <div class="flex gap-1">
              <button
                @click="abrirModalRol(rol)"
                class="text-blue-500 hover:text-blue-700"
              >
                Editar
              </button>
              <button
                @click="eliminarRol(rol.id_rol)"
                class="text-red-500 hover:text-red-700"
                v-if="rol.id_rol !== 1"
              >
                Borrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ======================================================== -->
    <!-- TAB 2: TRABAJADORES                                      -->
    <!-- ======================================================== -->
    <div v-if="tabActivo === 'trabajadores'">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-semibold text-gray-700">Trabajadores</h2>
        <button
          @click="abrirModalTrabajador()"
          class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
        >
          + Nuevo Trabajador
        </button>
      </div>

      <div class="overflow-x-auto bg-white rounded-lg shadow">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Apellido</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">DNI</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rol</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Huella</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="trabajador in trabajadores" :key="trabajador.id_trabajador">
              <td class="px-6 py-4 text-sm text-gray-900">{{ trabajador.nombre }}</td>
              <td class="px-6 py-4 text-sm text-gray-900">{{ trabajador.apellido }}</td>
              <td class="px-6 py-4 text-sm text-gray-900">{{ trabajador.dni }}</td>
              <td class="px-6 py-4 text-sm text-gray-900">
                {{ trabajador.rol?.nombre_rol || 'Sin rol' }}
              </td>
              <td class="px-6 py-4 text-sm">
                <span
                  v-if="!trabajador.hash_huella"
                  class="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded"
                >
                  Sin huella
                </span>
                <span
                  v-else-if="trabajador.huella_pendiente"
                  class="text-xs text-amber-700 bg-amber-100 px-2 py-1 rounded"
                >
                  Pendiente (#{{ trabajador.hash_huella }})
                </span>
                <span
                  v-else
                  class="text-xs text-green-700 bg-green-100 px-2 py-1 rounded"
                >
                  Registrada (#{{ trabajador.hash_huella }})
                </span>

                <button
                  v-if="!trabajador.hash_huella"
                  @click="solicitarHuella(trabajador)"
                  class="block text-blue-500 hover:text-blue-700 text-xs mt-1"
                >
                  Registrar huella
                </button>
                <button
                  v-else-if="trabajador.huella_pendiente"
                  @click="cancelarHuella(trabajador)"
                  class="block text-red-500 hover:text-red-700 text-xs mt-1"
                >
                  Cancelar
                </button>
              </td>
              <td class="px-6 py-4 text-sm">
                <button
                  @click="abrirModalTrabajador(trabajador)"
                  class="text-blue-500 hover:text-blue-700 mr-2"
                >
                  Editar
                </button>
                <button
                  @click="eliminarTrabajador(trabajador.id_trabajador)"
                  class="text-red-500 hover:text-red-700"
                  v-if="trabajador.id_trabajador !== 1"
                >
                  Borrar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ======================================================== -->
    <!-- MODAL: ROL                                               -->
    <!-- ======================================================== -->
    <div
      v-if="modalRol"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      @click.self="modalRol = false"
    >
      <div class="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <h2 class="text-xl font-bold text-gray-800 mb-4">
          {{ rolEditando ? 'Editar Rol' : 'Nuevo Rol' }}
        </h2>
        <form @submit.prevent="guardarRol">
          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-medium mb-1">Nombre del rol</label>
            <input
              v-model="rolForm.nombre_rol"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div class="mb-4">
            <label class="block text-gray-700 text-sm font-medium mb-1">Permisos</label>
            <div class="max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-2">
              <div
                v-for="func in funcionalidades"
                :key="func.id_func"
                class="flex items-center gap-2 py-1"
              >
                <input
                  type="checkbox"
                  :value="func.id_func"
                  v-model="rolForm.funcionalidades"
                  class="w-4 h-4 text-blue-500"
                />
                <label class="text-sm text-gray-700">{{ func.nombre_func }}</label>
              </div>
              <p v-if="funcionalidades.length === 0" class="text-sm text-gray-500 py-2">
                No hay funcionalidades disponibles. Crea una en la base de datos.
              </p>
            </div>
          </div>
          <div class="flex justify-end gap-3">
            <button
              type="button"
              @click="modalRol = false"
              class="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancelar
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              {{ rolEditando ? 'Actualizar' : 'Crear' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- ======================================================== -->
    <!-- MODAL: TRABAJADOR                                        -->
    <!-- ======================================================== -->
    <div
      v-if="modalTrabajador"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      @click.self="modalTrabajador = false"
    >
      <div class="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <h2 class="text-xl font-bold text-gray-800 mb-4">
          {{ trabajadorEditando ? 'Editar Trabajador' : 'Nuevo Trabajador' }}
        </h2>
        <form @submit.prevent="guardarTrabajador">
          <div class="mb-3">
            <label class="block text-gray-700 text-sm font-medium mb-1">Nombre</label>
            <input
              v-model="trabajadorForm.nombre"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div class="mb-3">
            <label class="block text-gray-700 text-sm font-medium mb-1">Apellido</label>
            <input
              v-model="trabajadorForm.apellido"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div class="mb-3">
            <label class="block text-gray-700 text-sm font-medium mb-1">DNI</label>
            <input
              v-model="trabajadorForm.dni"
              type="number"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div class="mb-3">
            <label class="block text-gray-700 text-sm font-medium mb-1">Rol</label>
            <select
              v-model="trabajadorForm.id_rol"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Selecciona un rol</option>
              <option
                v-for="rol in roles"
                :key="rol.id_rol"
                :value="rol.id_rol"
              >
                {{ rol.nombre_rol }}
              </option>
            </select>
          </div>
          <div class="mb-3" v-if="!trabajadorEditando">
            <label class="block text-gray-700 text-sm font-medium mb-1">Contraseña</label>
            <input
              v-model="trabajadorForm.password"
              type="password"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              minlength="6"
            />
          </div>
          <div class="mb-3" v-if="!trabajadorEditando">
            <label class="flex items-center gap-2 text-sm text-gray-700">
              <input
                type="checkbox"
                v-model="trabajadorForm.registrarHuella"
                class="w-4 h-4 text-blue-500"
              />
              Registrar también su huella dactilar
            </label>
          </div>

          <div
            v-if="huellaRecienAsignada"
            class="mb-3 p-3 bg-amber-50 border border-amber-300 rounded-lg text-sm text-amber-800"
          >
            <strong>Huella #{{ huellaRecienAsignada }} reservada.</strong>
            Llevá al empleado hasta el lector: en unos segundos el dispositivo
            le va a pedir el dedo dos veces solo. Cuando termine, la huella
            queda confirmada automáticamente (podés cerrar esta ventana).
          </div>

          <div class="flex justify-end gap-3">
            <button
              type="button"
              @click="modalTrabajador = false"
              class="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancelar
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              {{ trabajadorEditando ? 'Actualizar' : 'Crear' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
const tabActivo = ref('roles')

// ============================================================
// DATOS
// ============================================================
const roles = ref([])
const trabajadores = ref([])
const funcionalidades = ref([])

// ============================================================
// MODALES - ROL
// ============================================================
const modalRol = ref(false)
const rolEditando = ref(null)
const rolForm = ref({ nombre_rol: '', funcionalidades: [] })

// ============================================================
// MODALES - TRABAJADOR
// ============================================================
const modalTrabajador = ref(false)
const trabajadorEditando = ref(null)
const trabajadorForm = ref({
  nombre: '',
  apellido: '',
  dni: '',
  id_rol: '',
  password: '',
  registrarHuella: false
})
// Cuando el backend asigna un ID de huella al crear un trabajador, lo
// mostramos acá para avisarle al admin que lleve al empleado al lector.
const huellaRecienAsignada = ref(null)

// ============================================================
// FUNCIONES - CARGAR DATOS
// ============================================================
const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const cargarRoles = async () => {
  try {
    const response = await axios.get(`${baseUrl}/api/admin/roles`, {
      headers: { 'Authorization': `Bearer ${authStore.token}` }
    })
    roles.value = response.data
  } catch (error) {
    console.error('Error cargando roles:', error)
  }
}

const cargarTrabajadores = async () => {
  try {
    const response = await axios.get(`${baseUrl}/api/admin/trabajadores`, {
      headers: { 'Authorization': `Bearer ${authStore.token}` }
    })
    trabajadores.value = response.data
  } catch (error) {
    console.error('Error cargando trabajadores:', error)
  }
}

const cargarFuncionalidades = async () => {
  try {
    const response = await axios.get(`${baseUrl}/api/admin/funcionalidades`, {
      headers: { 'Authorization': `Bearer ${authStore.token}` }
    })
    funcionalidades.value = response.data
  } catch (error) {
    console.error('Error cargando funcionalidades:', error)
  }
}

const cargarTodo = () => {
  cargarRoles()
  cargarTrabajadores()
  cargarFuncionalidades()
}

onMounted(cargarTodo)

// ============================================================
// FUNCIONES - ROL
// ============================================================
const abrirModalRol = (rol = null) => {
  rolEditando.value = rol
  if (rol) {
    rolForm.value = {
      nombre_rol: rol.nombre_rol,
      funcionalidades: rol.roles_funcionalidades?.map(rf => rf.id_func) || []
    }
  } else {
    rolForm.value = { nombre_rol: '', funcionalidades: [] }
  }
  modalRol.value = true
}

const guardarRol = async () => {
  try {
    const url = rolEditando.value 
      ? `${baseUrl}/api/admin/roles/${rolEditando.value.id_rol}`
      : `${baseUrl}/api/admin/roles`
    const method = rolEditando.value ? 'put' : 'post'

    await axios[method](url, rolForm.value, {
      headers: { 'Authorization': `Bearer ${authStore.token}` }
    })

    modalRol.value = false
    cargarTodo()
  } catch (error) {
    console.error('Error:', error)
    alert(error.response?.data?.error || 'Error al guardar')
  }
}

const eliminarRol = async (id) => {
  if (!confirm('¿Eliminar este rol?')) return
  try {
    await axios.delete(`${baseUrl}/api/admin/roles/${id}`, {
      headers: { 'Authorization': `Bearer ${authStore.token}` }
    })
    cargarTodo()
  } catch (error) {
    alert('No se puede eliminar un rol en uso')
  }
}

// ============================================================
// FUNCIONES - TRABAJADOR
// ============================================================
const abrirModalTrabajador = (trabajador = null) => {
  trabajadorEditando.value = trabajador
  huellaRecienAsignada.value = null
  if (trabajador) {
    trabajadorForm.value = {
      nombre: trabajador.nombre,
      apellido: trabajador.apellido,
      dni: trabajador.dni,
      id_rol: trabajador.id_rol,
      password: '',
      registrarHuella: false
    }
  } else {
    trabajadorForm.value = {
      nombre: '',
      apellido: '',
      dni: '',
      id_rol: '',
      password: '',
      registrarHuella: false
    }
  }
  modalTrabajador.value = true
}

const guardarTrabajador = async () => {
  try {
    const url = trabajadorEditando.value 
      ? `${baseUrl}/api/admin/trabajadores/${trabajadorEditando.value.id_trabajador}`
      : `${baseUrl}/api/admin/trabajadores`
    const method = trabajadorEditando.value ? 'put' : 'post'

    const data = {
      nombre: trabajadorForm.value.nombre,
      apellido: trabajadorForm.value.apellido,
      dni: trabajadorForm.value.dni,
      id_rol: trabajadorForm.value.id_rol
    }

    if (!trabajadorEditando.value) {
      data.password = trabajadorForm.value.password
      data.registrarHuella = trabajadorForm.value.registrarHuella
    }

    const response = await axios[method](url, data, {
      headers: { 'Authorization': `Bearer ${authStore.token}` }
    })

    cargarTodo()

    if (!trabajadorEditando.value && response.data?.huellaAsignada) {
      // No cerramos el modal todavía: le mostramos al admin el ID
      // asignado para que lleve al empleado al lector.
      huellaRecienAsignada.value = response.data.huellaAsignada
    } else {
      modalTrabajador.value = false
    }
  } catch (error) {
    console.error('Error:', error)
    alert(error.response?.data?.error || 'Error al guardar')
  }
}

// ============================================================
// FUNCIONES - HUELLA
// ============================================================
const solicitarHuella = async (trabajador) => {
  try {
    const response = await axios.put(
      `${baseUrl}/api/admin/trabajadores/${trabajador.id_trabajador}/huella`,
      {},
      { headers: { 'Authorization': `Bearer ${authStore.token}` } }
    )
    alert(response.data.message || 'Huella reservada')
    cargarTodo()
  } catch (error) {
    alert(error.response?.data?.error || 'Error al solicitar la huella')
  }
}

const cancelarHuella = async (trabajador) => {
  if (!confirm('¿Cancelar el registro de huella pendiente?')) return
  try {
    const response = await axios.put(
      `${baseUrl}/api/admin/trabajadores/${trabajador.id_trabajador}/huella/cancelar`,
      {},
      { headers: { 'Authorization': `Bearer ${authStore.token}` } }
    )
    alert(response.data.message || 'Registro de huella cancelado')
    cargarTodo()
  } catch (error) {
    alert(error.response?.data?.error || 'Error al cancelar la huella')
  }
}

const eliminarTrabajador = async (id) => {
  if (!confirm('¿Eliminar este trabajador?')) return
  try {
    await axios.delete(`${baseUrl}/api/admin/trabajadores/${id}`, {
      headers: { 'Authorization': `Bearer ${authStore.token}` }
    })
    cargarTodo()
  } catch (error) {
    alert('Error al eliminar')
  }
}
</script>