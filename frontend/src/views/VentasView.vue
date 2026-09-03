<!-- frontend/src/views/CajaView.vue -->
<template>
  <div class="p-6 max-w-6xl mx-auto">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Caja Registradora</h1>
      <button
        @click="cerrarCaja"
        class="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
      >
        Cerrar Caja
      </button>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Columna izquierda: Buscador y carrito -->
      <div class="lg:col-span-2">
        <!-- Buscador -->
        <BuscadorProducto @agregar="agregarAlCarrito" />

        <!-- Carrito -->
        <CarritoCompras
          :items="carrito"
          :promociones-aplicables="promocionesAplicables"
          :calcular-descuento="calcularDescuentoItem"
          @actualizar-cantidad="actualizarCantidad"
          @eliminar="eliminarDelCarrito"
          @aplicar-descuento="aplicarDescuento"
        />
      </div>

      <!-- Columna derecha: Resumen y pago -->
      <div class="lg:col-span-1">
        <!-- Cliente -->
        <SelectorCliente
          :clientes="clientes"
          v-model="clienteSeleccionado"
        />

        <!-- Resumen -->
        <ResumenVenta
          :subtotal="subtotal"
          :descuento="descuento"
          :total="total"
        />

        <!-- Métodos de pago -->
        <MetodosPago
          :metodos="metodosPago"
          @seleccionar="seleccionarMetodoPago"
        />

        <!-- Formulario según método -->
        <div v-if="metodoSeleccionado" class="mt-4">
          <PagoEfectivo
            v-if="metodoSeleccionado === 'Efectivo'"
            :total="total"
            @confirmar="finalizarVenta"
          />
          <PagoTarjeta
            v-else-if="metodoSeleccionado === 'Tarjeta Débito' || metodoSeleccionado === 'Tarjeta Crédito'"
            :tipo="metodoSeleccionado"
            :total="total"
            @confirmar="finalizarVenta"
          />
          <PagoTransferencia
            v-else-if="metodoSeleccionado === 'Transferencia' || metodoSeleccionado === 'Mercado Pago'"
            :tipo="metodoSeleccionado"
            :total="total"
            @confirmar="finalizarVenta"
          />
          <PagoCheque
            v-else-if="metodoSeleccionado === 'Cheque'"
            :total="total"
            @confirmar="finalizarVenta"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { useAuthStore } from '../stores/auth'
import BuscadorProducto from '../components/caja/BuscadorProducto.vue'
import CarritoCompras from '../components/caja/CarritoCompras.vue'
import ResumenVenta from '../components/caja/ResumenVenta.vue'
import MetodosPago from '../components/caja/MetodosPago.vue'
import PagoEfectivo from '../components/caja/PagoEfectivo.vue'
import PagoTransferencia from '../components/caja/PagoTransferencia.vue'
import PagoCheque from '../components/caja/PagoCheque.vue'
import PagoTarjeta from '../components/caja/PagoTarjeta.vue'
import SelectorCliente from '../components/caja/SelectorCliente.vue'

const authStore = useAuthStore()
const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'

// ============================================================
// STATE
// ============================================================
const carrito = ref([])
const metodosPago = ref([])
const metodoSeleccionado = ref(null)
const clientes = ref([])
// null = "Cliente General". Si no, es el id_cliente elegido en el selector.
const clienteSeleccionado = ref(null)
// Promociones activas y vigentes ahora mismo (se ofrecen en el carrito)
const promocionesVigentes = ref([])

// ============================================================
// COMPUTED
// ============================================================
const subtotal = computed(() => {
  return carrito.value.reduce((sum, item) => {
    return sum + (item.cantidad * item.precio_unitario)
  }, 0)
})

const descuento = computed(() => {
  return carrito.value.reduce((sum, item) => sum + calcularDescuentoItem(item), 0)
})

const total = computed(() => subtotal.value - descuento.value)

// ============================================================
// MÉTODOS
// ============================================================
const agregarAlCarrito = (producto) => {
  const existente = carrito.value.find(item => item.id_producto === producto.id_producto)

  if (existente) {
    existente.cantidad += 1
  } else {
    carrito.value.push({
      id_producto: producto.id_producto,
      nombre_producto: producto.nombre_producto,
      precio_unitario: producto.precio_unitario,
      cantidad: 1,
      stock: producto.stock_actual,
      id_promocion: null // sin descuento hasta que el cajero elija uno
    })
  }
}

const actualizarCantidad = (index, cantidad) => {
  if (cantidad <= 0) {
    carrito.value.splice(index, 1)
    return
  }
  carrito.value[index].cantidad = cantidad

  // Si la promo elegida era "por volumen" y ahora la cantidad no alcanza,
  // se la sacamos: si no, quedaría un descuento inválido en pantalla que
  // el backend igual va a rechazar al confirmar la venta.
  const item = carrito.value[index]
  if (item.id_promocion) {
    const sigueSiendoValida = promocionesAplicables(item).some(p => p.id_promocion === item.id_promocion)
    if (!sigueSiendoValida) {
      item.id_promocion = null
    }
  }
}

const eliminarDelCarrito = (index) => {
  carrito.value.splice(index, 1)
}

const seleccionarMetodoPago = (metodo) => {
  metodoSeleccionado.value = metodo
}

// ============================================================
// DESCUENTOS / PROMOCIONES
// ============================================================

// Qué promociones vigentes podrían aplicarse a este item del carrito.
// La validación definitiva (incluida la de "por_metodo_pago", que acá
// solo se etiqueta) la hace siempre el backend al confirmar la venta.
const promocionesAplicables = (item) => {
  return promocionesVigentes.value.filter(promo => {
    const productosPermitidos = promo.productos_promociones.map(pp => pp.id_producto)
    const aplicaAlProducto = productosPermitidos.length === 0 || productosPermitidos.includes(item.id_producto)
    if (!aplicaAlProducto) return false

    if (promo.tipo_promo === 'por_volumen' && item.cantidad < promo.cantidad_minima) {
      return false
    }

    return true
  })
}

const calcularDescuentoItem = (item) => {
  if (!item.id_promocion) return 0
  const promo = promocionesVigentes.value.find(p => p.id_promocion === item.id_promocion)
  if (!promo) return 0
  return Number((item.cantidad * item.precio_unitario * (Number(promo.porcentaje_descuento) / 100)).toFixed(2))
}

const aplicarDescuento = (index, idPromocion) => {
  carrito.value[index].id_promocion = idPromocion
}

const cargarPromociones = async () => {
  try {
    const response = await axios.get(`${baseUrl}/api/promociones/vigentes`, {
      headers: { 'Authorization': `Bearer ${authStore.token}` }
    })
    promocionesVigentes.value = response.data
  } catch (error) {
    console.error('Error cargando promociones:', error)
  }
}

const finalizarVenta = async (datosPago) => {
  try {
    const venta = {
      items: carrito.value,
      total: total.value,
      metodo_pago: metodoSeleccionado.value,
      datos_pago: datosPago,
      // null si es "Cliente General"
      id_cliente: clienteSeleccionado.value
    }

    const response = await axios.post(`${baseUrl}/api/ventas`, venta, {
      headers: { 'Authorization': `Bearer ${authStore.token}` }
    })

    alert('Venta realizada con éxito')
    carrito.value = []
    metodoSeleccionado.value = null
    clienteSeleccionado.value = null
  } catch (error) {
    console.error('Error finalizando venta:', error)
    alert('Error al procesar la venta')
  }
}

const cerrarCaja = () => {
  if (carrito.value.length > 0) {
    if (!confirm('Hay productos en el carrito. ¿Seguro que quieres cerrar la caja?')) return
  }
  // TODO: Lógica de cierre de caja
  alert('Caja cerrada')
}

// ============================================================
// CARGAR MÉTODOS DE PAGO
// ============================================================
const cargarMetodosPago = async () => {
  try {
    const response = await axios.get(`${baseUrl}/api/metodos-pago`, {
      headers: { 'Authorization': `Bearer ${authStore.token}` }
    })
    metodosPago.value = response.data
  } catch (error) {
    console.error('Error cargando métodos de pago:', error)
  }
}

// ============================================================
// CARGAR CLIENTES
// ============================================================
const cargarClientes = async () => {
  try {
    const response = await axios.get(`${baseUrl}/api/clientes`, {
      headers: { 'Authorization': `Bearer ${authStore.token}` }
    })
    clientes.value = response.data
  } catch (error) {
    console.error('Error cargando clientes:', error)
  }
}

onMounted(() => {
  cargarMetodosPago()
  cargarClientes()
  cargarPromociones()
})
</script>