<!-- frontend/src/views/DescuentosView.vue -->
<template>
  <div class="p-6 max-w-6xl mx-auto">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Descuentos</h1>
      <button
        @click="abrirModal()"
        class="bg-teal-500 px-4 py-2 rounded-lg hover:bg-teal-600 transition text-sm font-semibold text-white"
      >
        + Nueva Promoción
      </button>
    </div>

    <div class="rounded-lg shadow overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-gray-200 text-xs font-semibold uppercase">
              <th class="px-4 py-3">Nombre</th>
              <th class="px-4 py-3">Tipo</th>
              <th class="px-4 py-3 text-right">Descuento</th>
              <th class="px-4 py-3">Condición</th>
              <th class="px-4 py-3">Vigencia</th>
              <th class="px-4 py-3">Alcance</th>
              <th class="px-4 py-3">Estado</th>
              <th class="px-4 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 text-sm">
            <tr v-if="cargando">
              <td colspan="8" class="px-4 py-6 text-center">Cargando...</td>
            </tr>
            <tr v-else-if="promociones.length === 0">
              <td colspan="8" class="px-4 py-6 text-center">Todavía no creaste ninguna promoción.</td>
            </tr>
            <tr v-for="promo in promociones" :key="promo.id_promocion" class="hover:bg-gray-50">

              <td class="px-4 py-3 font-medium">{{ promo.nombre_promo }}</td>
              <td class="px-4 py-3">{{ etiquetaTipo(promo.tipo_promo) }}</td>
              <td class="px-4 py-3 text-right font-semibold">{{ promo.porcentaje_descuento }}%</td>
              <td class="px-4 py-3 text-xs">{{ condicion(promo) }}</td>
              <td class="px-4 py-3 text-xs whitespace-nowrap">
                {{ formatearFecha(promo.fecha_inicio) }} → {{ formatearFecha(promo.fecha_fin) }}
              </td>
              <td class="px-4 py-3 text-xs">
                {{ promo.productos_promociones.length === 0
                  ? 'Todos'
                  : promo.productos_promociones.map(pp => pp.producto.nombre_producto).join(', ') }}
              </td>
              <td class="px-4 py-3">
                <div class="flex flex-col gap-1">
                  <span
                    class="text-xs font-semibold px-2 py-1 rounded w-fit"
                    :class="promo.activa ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'"
                  >
                    {{ promo.activa ? 'Activa' : 'Inactiva' }}
                  </span>
                  <span v-if="promo.activa && !estaVigente(promo)" class="text-xs text-amber-600">
                    Fuera de fecha
                  </span>
                </div>
              </td>
              <td class="px-4 py-3 whitespace-nowrap">
                <div class="flex items-center gap-2">
                  <!-- Botón Editar -->
                  <button
                    @click="abrirModal(promo)"
                    class="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-600 transition-colors"
                    title="Editar"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M12 20h9"/>
                      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
                    </svg>
                  </button>

                  <!-- Botón Desactivar / Activar -->
                  <button
                    @click="toggleActiva(promo)"
                    class="flex items-center justify-center w-8 h-8 rounded-lg bg-orange-50 hover:bg-orange-100 text-orange-500 transition-colors"
                    :title="promo.activa ? 'Desactivar' : 'Activar'"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <rect x="6" y="4" width="4" height="16" rx="1"/>
                      <rect x="14" y="4" width="4" height="16" rx="1"/>
                    </svg>
                  </button>

                  <!-- Botón Borrar -->
                  <button
                    @click="eliminarPromocion(promo)"
                    class="flex items-center justify-center w-8 h-8 rounded-lg bg-orange-50 hover:bg-orange-100 text-orange-500 transition-colors"
                    title="Borrar"
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

    <!-- MODAL: crear/editar promoción -->
    <!-- ============================================================ -->
    <div
      v-if="modalAbierto"
      class="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
      @click.self="modalAbierto = false"
    >
      <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <h2 class="text-lg font-bold mb-4">
          {{ promocionEditando ? 'Editar Promoción' : 'Nueva Promoción' }}
        </h2>

        <div class="mb-3">
          <label class="block text-sm font-medium mb-1">Nombre</label>
          <input
            v-model="form.nombre_promo"
            type="text"
            placeholder="Ej: 2x1 en gaseosas"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div class="mb-3">
          <label class="block text-sm font-medium mb-1">Tipo de promoción</label>
          <select
            v-model="form.tipo_promo"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="descuento_directo">Descuento directo (% sobre el precio)</option>
            <option value="por_volumen">Por volumen (comprando N unidades o más)</option>
            <option value="por_metodo_pago">Por método de pago</option>
            <option value="combo_nxm">Combo NxM (ej. 2x1, 3x2)</option>
          </select>
        </div>


        <div class="mb-3">
          <label class="block text-sm font-medium mb-1">Porcentaje de descuento</label>
          <input
            v-model="form.porcentaje_descuento"
            type="number"
            min="1"
            max="100"
            step="1"
            placeholder="Ej: 15"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div class="mb-3" v-if="form.tipo_promo === 'combo_nxm'">
          <label class="block text-gray-700 text-sm font-medium mb-1">Combo</label>
          <div class="flex items-center gap-2">
            <input
              v-model="form.cantidad_minima"
              type="number"
              min="2"
              placeholder="N (lleva)"
              class="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <span class="text-gray-500 font-medium">x</span>
            <input
              v-model="form.cantidad_paga"
              type="number"
              min="1"
              placeholder="M (paga)"
              class="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <p class="text-xs text-gray-400 mt-1">
            Ej: 2x1 → lleva 2 (N), paga 1 (M). Solo se descuentan grupos completos de N: si compran 3 con un 2x1, se aplica a 2 y la tercera queda a precio normal.
          </p>
        </div>

        <div class="mb-3" v-if="form.tipo_promo === 'por_volumen'">
          <label class="block text-sm font-medium mb-1">Cantidad mínima de unidades</label>
          <input
            v-model="form.cantidad_minima"
            type="number"
            min="2"
            placeholder="Ej: 3"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        <div class="mb-3" v-if="form.tipo_promo === 'por_metodo_pago'">
          <label class="block text-sm font-medium mb-1">Método de pago que la activa</label>
          <select
            v-model="form.metodo_pago_requerido"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="">Seleccionar...</option>
            <option v-for="mp in metodosPago" :key="mp.id_metodo_pago" :value="mp.nombre">
              {{ mp.nombre }}
            </option>
          </select>
        </div>

        <div class="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label class="block text-sm font-medium mb-1">Desde</label>
            <input
              v-model="form.fecha_inicio"
              type="date"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Hasta</label>
            <input
              v-model="form.fecha_fin"
              type="date"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>

        <div class="mb-3">
          <label class="flex items-center gap-2 text-sm">
            <input type="checkbox" v-model="form.activa" class="w-4 h-4 text-teal-500" />
            Activa
          </label>
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium mb-1">
            Productos a los que aplica
          </label>
          <p class="text-xs text-gray-400 mb-2">
            Si no marcás ninguno, la promoción aplica a cualquier producto.
          </p>
          <input
            v-model="filtroProductos"
            type="text"
            placeholder="Buscar producto..."
            class="w-full px-3 py-1.5 border border-gray-300 rounded-lg text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <div class="border border-gray-200 rounded-lg max-h-40 overflow-y-auto divide-y divide-gray-100">
            <label
              v-for="producto in productosFiltrados"
              :key="producto.id_producto"

              class="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-slate-700 dark:hover:text-white cursor-pointer"
            >
              <input
                type="checkbox"
                :checked="form.id_productos.includes(producto.id_producto)"
                @change="toggleProducto(producto.id_producto)"
                class="w-4 h-4 text-teal-500"
              />
              {{ producto.nombre_producto }}
            </label>
            <p v-if="productosFiltrados.length === 0" class="px-3 py-2 text-xs text-gray-400">
              No se encontraron productos.
            </p>
          </div>
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium mb-1">
            Etiquetas a las que aplica
          </label>
          <p class="text-xs text-gray-400 mb-2">
            Marcá una etiqueta para que la promo aplique a TODOS los productos
            que la tengan (ej. etiquetá "Coca" en tus 3 variedades de Coca y
            hacé un solo 2x1 para las tres). Se combina con los productos
            puntuales de arriba, no los reemplaza.
          </p>
          <div class="border border-gray-200 rounded-lg max-h-32 overflow-y-auto divide-y divide-gray-100">
            <label
              v-for="etiqueta in etiquetas"
              :key="etiqueta.id_etiqueta"
              class="flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-slate-700 dark:hover:text-white cursor-pointer"
            >
              <input
                type="checkbox"
                :checked="form.id_etiquetas.includes(etiqueta.id_etiqueta)"
                @change="toggleEtiqueta(etiqueta.id_etiqueta)"
                class="w-4 h-4 text-teal-500"
              />
              {{ etiqueta.nombre_etiqueta }}
            </label>
            <p v-if="etiquetas.length === 0" class="px-3 py-2 text-xs">
              No tenés etiquetas creadas todavía.
            </p>
          </div>
        </div>

        <div class="flex justify-end gap-3">
          <button
            @click="modalAbierto = false"
            class="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 text-sm"
          >
            Cancelar
          </button>
          <button
            @click="guardarPromocion"
            :disabled="guardando"
            class="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition text-sm font-semibold disabled:opacity-50"
          >
            {{ guardando ? 'Guardando...' : 'Guardar' }}
          </button>
        </div>
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
const headers = () => ({ headers: { 'Authorization': `Bearer ${authStore.token}` } })

// ============================================================
// LISTADO
// ============================================================
const promociones = ref([])
const cargando = ref(true)
const productos = ref([])
const etiquetas = ref([])
const metodosPago = ref([])

const cargarPromociones = async () => {
  cargando.value = true
  try {
    const response = await axios.get(`${baseUrl}/api/promociones`, headers())
    promociones.value = response.data
  } catch (error) {
    console.error('Error cargando promociones:', error)
  } finally {
    cargando.value = false
  }
}

const cargarProductos = async () => {
  try {
    // /api/productos devuelve resultados paginados:
    // { productos: [...], total, page, totalPages }
    // Para el picker de la promoción necesitamos TODOS los productos, así
    // que recorremos las páginas hasta juntarlas todas.
    let todos = []
    let page = 1
    let totalPages = 1

    do {
      const response = await axios.get(`${baseUrl}/api/productos?page=${page}`, headers())
      todos = todos.concat(response.data.productos || [])
      totalPages = response.data.totalPages || 1
      page++
    } while (page <= totalPages)

    productos.value = todos
  } catch (error) {
    console.error('Error cargando productos:', error)
  }
}

const cargarEtiquetas = async () => {
  try {
    const response = await axios.get(`${baseUrl}/api/etiquetas`, headers())
    etiquetas.value = Array.isArray(response.data) ? response.data : (response.data.etiquetas || [])
  } catch (error) {
    console.error('Error cargando etiquetas:', error)
  }
}

const cargarMetodosPago = async () => {
  try {
    const response = await axios.get(`${baseUrl}/api/metodos-pago`, headers())
    metodosPago.value = response.data
  } catch (error) {
    console.error('Error cargando métodos de pago:', error)
  }
}

const etiquetaTipo = (tipo) => ({
  descuento_directo: 'Descuento directo',
  por_volumen: 'Por volumen',
  por_metodo_pago: 'Por método de pago',
  combo_nxm: 'Combo NxM'
}[tipo] || tipo)

const etiquetaDescuento = (promo) => {
  if (promo.tipo_promo === 'combo_nxm') {
    return `${promo.cantidad_minima}x${promo.cantidad_paga}`
  }
  return `${promo.porcentaje_descuento}%`
}

const condicion = (promo) => {
  if (promo.tipo_promo === 'por_volumen') return `Mín. ${promo.cantidad_minima} unidades`
  if (promo.tipo_promo === 'por_metodo_pago') return `Pagando con ${promo.metodo_pago_requerido}`
  if (promo.tipo_promo === 'combo_nxm') return `Cada ${promo.cantidad_minima}, paga ${promo.cantidad_paga}`
  return '-'
}

const alcance = (promo) => {
  const nombresProductos = promo.productos_promociones.map(pp => pp.producto.nombre_producto)
  const nombresEtiquetas = promo.promociones_etiquetas?.map(pe => `#${pe.etiqueta.nombre_etiqueta}`) || []
  const partes = [...nombresProductos, ...nombresEtiquetas]
  return partes.length === 0 ? 'Todos' : partes.join(', ')
}

const estaVigente = (promo) => {
  const ahora = new Date()
  return ahora >= new Date(promo.fecha_inicio) && ahora <= new Date(promo.fecha_fin)
}

const formatearFecha = (fecha) => {
  return new Date(fecha).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

// ============================================================
// MODAL
// ============================================================
const modalAbierto = ref(false)
const promocionEditando = ref(null)
const guardando = ref(false)
const filtroProductos = ref('')

const form = ref({
  nombre_promo: '',
  tipo_promo: 'descuento_directo',
  porcentaje_descuento: '',
  cantidad_minima: '',
  cantidad_paga: '',
  metodo_pago_requerido: '',
  fecha_inicio: '',
  fecha_fin: '',
  activa: true,
  id_productos: [],
  id_etiquetas: []
})

const productosFiltrados = computed(() => {
  const q = filtroProductos.value.trim().toLowerCase()
  if (!q) return productos.value
  return productos.value.filter(p => p.nombre_producto.toLowerCase().includes(q))
})

const toggleProducto = (idProducto) => {
  const idx = form.value.id_productos.indexOf(idProducto)
  if (idx >= 0) {
    form.value.id_productos.splice(idx, 1)
  } else {
    form.value.id_productos.push(idProducto)
  }
}

const toggleEtiqueta = (idEtiqueta) => {
  const idx = form.value.id_etiquetas.indexOf(idEtiqueta)
  if (idx >= 0) {
    form.value.id_etiquetas.splice(idx, 1)
  } else {
    form.value.id_etiquetas.push(idEtiqueta)
  }
}

// Convierte un ISO datetime a "yyyy-mm-dd" para el <input type="date">
const aFechaInput = (iso) => new Date(iso).toISOString().split('T')[0]

const abrirModal = (promo = null) => {
  promocionEditando.value = promo
  filtroProductos.value = ''

  if (promo) {
    form.value = {
      nombre_promo: promo.nombre_promo,
      tipo_promo: promo.tipo_promo,
      porcentaje_descuento: promo.porcentaje_descuento || '',
      cantidad_minima: promo.cantidad_minima || '',
      cantidad_paga: promo.cantidad_paga || '',
      metodo_pago_requerido: promo.metodo_pago_requerido || '',
      fecha_inicio: aFechaInput(promo.fecha_inicio),
      fecha_fin: aFechaInput(promo.fecha_fin),
      activa: promo.activa,
      id_productos: promo.productos_promociones.map(pp => pp.producto.id_producto),
      id_etiquetas: (promo.promociones_etiquetas || []).map(pe => pe.etiqueta.id_etiqueta)
    }
  } else {
    form.value = {
      nombre_promo: '',
      tipo_promo: 'descuento_directo',
      porcentaje_descuento: '',
      cantidad_minima: '',
      cantidad_paga: '',
      metodo_pago_requerido: '',
      fecha_inicio: '',
      fecha_fin: '',
      activa: true,
      id_productos: [],
      id_etiquetas: []
    }
  }

  modalAbierto.value = true
}

const guardarPromocion = async () => {
  if (!form.value.nombre_promo || !form.value.fecha_inicio || !form.value.fecha_fin) {
    alert('Completá nombre y las fechas de vigencia.')
    return
  }

  if (form.value.tipo_promo === 'combo_nxm') {
    if (!form.value.cantidad_minima || !form.value.cantidad_paga) {
      alert('Completá cuántas unidades se llevan (N) y cuántas se pagan (M).')
      return
    }
  } else if (!form.value.porcentaje_descuento) {
    alert('Completá el porcentaje de descuento.')
    return
  }

  guardando.value = true
  try {
    const url = promocionEditando.value
      ? `${baseUrl}/api/promociones/${promocionEditando.value.id_promocion}`
      : `${baseUrl}/api/promociones`
    const method = promocionEditando.value ? 'put' : 'post'

    await axios[method](url, form.value, headers())

    modalAbierto.value = false
    cargarPromociones()
  } catch (error) {
    alert(error.response?.data?.error || 'Error al guardar la promoción')
  } finally {
    guardando.value = false
  }
}

const toggleActiva = async (promo) => {
  try {
    await axios.put(`${baseUrl}/api/promociones/${promo.id_promocion}/activa`, { activa: !promo.activa }, headers())
    cargarPromociones()
  } catch (error) {
    alert(error.response?.data?.error || 'Error al cambiar el estado')
  }
}

const eliminarPromocion = async (promo) => {
  if (!confirm(`¿Eliminar la promoción "${promo.nombre_promo}"?`)) return
  try {
    await axios.delete(`${baseUrl}/api/promociones/${promo.id_promocion}`, headers())
    cargarPromociones()
  } catch (error) {
    alert(error.response?.data?.error || 'Error al eliminar la promoción')
  }
}

onMounted(() => {
  cargarPromociones()
  cargarProductos()
  cargarEtiquetas()
  cargarMetodosPago()
})
</script>
