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
          @actualizar-cantidad="actualizarCantidad"
          @eliminar="eliminarDelCarrito"
        />
      </div>

      <!-- Columna derecha: Resumen y pago -->
      <div class="lg:col-span-1">
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

const authStore = useAuthStore()
const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'

// ============================================================
// STATE
// ============================================================
const carrito = ref([])
const metodosPago = ref([])
const metodoSeleccionado = ref(null)

// ============================================================
// COMPUTED
// ============================================================
const subtotal = computed(() => {
  return carrito.value.reduce((sum, item) => {
    return sum + (item.cantidad * item.precio_unitario)
  }, 0)
})

const descuento = computed(() => 0) // TODO: Implementar descuentos

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
      stock: producto.stock_actual
    })
  }
}

const actualizarCantidad = (index, cantidad) => {
  if (cantidad <= 0) {
    carrito.value.splice(index, 1)
  } else {
    carrito.value[index].cantidad = cantidad
  }
}

const eliminarDelCarrito = (index) => {
  carrito.value.splice(index, 1)
}

const seleccionarMetodoPago = (metodo) => {
  metodoSeleccionado.value = metodo
}

const finalizarVenta = async (datosPago) => {
  try {
    const venta = {
      items: carrito.value,
      total: total.value,
      metodo_pago: metodoSeleccionado.value,
      datos_pago: datosPago
    }

    const response = await axios.post(`${baseUrl}/api/ventas`, venta, {
      headers: { 'Authorization': `Bearer ${authStore.token}` }
    })

    alert('Venta realizada con éxito')
    carrito.value = []
    metodoSeleccionado.value = null
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

onMounted(() => {
  cargarMetodosPago()
})
</script>