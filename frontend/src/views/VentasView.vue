<!-- frontend/src/views/CajaView.vue -->
<template>
  <div class="p-6 max-w-6xl mx-auto">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Caja Registradora</h1>
      <div class="flex items-center gap-3">
        <span
          v-if="cajaActiva?.modo_autenticacion === 'por_venta'"
          class="text-xs font-semibold bg-purple-100 text-purple-700 px-2 py-1 rounded"
        >
          Caja compartida
        </span>
        <a
          class="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
          href="/cajas"
        >
          Cerrar Caja
        </a>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Columna izquierda: Buscador y carrito -->
      <div class="lg:col-span-2">
        <!-- Buscador -->
        <BuscadorProducto @agregar="agregarAlCarrito" />

        <!-- Carrito -->
        <CarritoCompras
          :items="carrito"
          :calcular-descuento="calcularDescuentoItem"
          :promo-aplicada="promoAplicadaItem"
          @actualizar-cantidad="actualizarCantidad"
          @eliminar="eliminarDelCarrito"
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

        <!-- ============================================================ -->
        <!-- CAJA COMPARTIDA: esperando que alguien confirme con huella -->
        <!-- ============================================================ -->
        <div
          v-if="esperandoHuella"
          class="mt-4 bg-purple-50 border border-purple-300 rounded-lg p-4 text-center"
        >
          <p class="font-semibold text-purple-800 mb-1">Esperando confirmación...</p>
          <p class="text-sm text-purple-700 mb-3">
            Que la persona que hizo la venta ponga el dedo en el lector de huella.
          </p>
          <button
            @click="cancelarEsperaHuella"
            class="text-sm text-purple-600 hover:underline"
          >
            Cancelar
          </button>
        </div>

        <!-- Métodos de pago y formularios: ocultos mientras se espera huella -->
        <template v-else>
          <MetodosPago
            :metodos="metodosPago"
            @seleccionar="seleccionarMetodoPago"
          />

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
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
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
const headers = () => ({ headers: { 'Authorization': `Bearer ${authStore.token}` } })

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
// La caja de este trabajador: acá miramos modo_autenticacion para decidir
// si la venta se registra directo o queda esperando huella.
const cajaActiva = ref(null)

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
      stock: producto.stock_actual
    })
  }
}

const actualizarCantidad = (index, cantidad) => {
  if (cantidad <= 0) {
    carrito.value.splice(index, 1)
    return
  }
  carrito.value[index].cantidad = cantidad
  // El descuento se recalcula solo (es reactivo): si al bajar/subir la
  // cantidad deja de alcanzar un combo o una promo por volumen, se
  // recalcula automáticamente a 0 sin que haya que hacer nada acá.
}

const eliminarDelCarrito = (index) => {
  carrito.value.splice(index, 1)
}

const seleccionarMetodoPago = (metodo) => {
  metodoSeleccionado.value = metodo
}

// ============================================================
// DESCUENTOS / PROMOCIONES (automático: se elige solo el mejor)
// ============================================================

// Cuánto descuento le daría ESTA promo puntual a este item, si aplica.
// Espeja exactamente la lógica del backend (construirVenta.js) para que
// lo que se ve en el carrito coincida con lo que después se cobra.
const montoSiAplica = (item, promo) => {
  const productosPermitidos = promo.productos_promociones.map(pp => pp.id_producto)
  const aplicaAlProducto = productosPermitidos.length === 0 || productosPermitidos.includes(item.id_producto)
  if (!aplicaAlProducto) return 0

  if (promo.tipo_promo === 'por_metodo_pago') {
    if (!metodoSeleccionado.value || promo.metodo_pago_requerido !== metodoSeleccionado.value) return 0
    return Number((item.cantidad * item.precio_unitario * (Number(promo.porcentaje_descuento) / 100)).toFixed(2))
  }

  if (promo.tipo_promo === 'por_volumen') {
    if (item.cantidad < promo.cantidad_minima) return 0
    return Number((item.cantidad * item.precio_unitario * (Number(promo.porcentaje_descuento) / 100)).toFixed(2))
  }

  if (promo.tipo_promo === 'combo_nxm') {
    const n = promo.cantidad_minima // cuántas se llevan (ej. 2 en un 2x1)
    const m = promo.cantidad_paga   // cuántas se pagan (ej. 1 en un 2x1)
    if (!n || m === null || m === undefined) return 0
    const gruposCompletos = Math.floor(item.cantidad / n)
    if (gruposCompletos === 0) return 0
    // Solo los grupos completos entran en el combo; lo que sobra
    // (item.cantidad % n) queda a precio normal.
    return Number((item.precio_unitario * gruposCompletos * (n - m)).toFixed(2))
  }

  // descuento_directo
  return Number((item.cantidad * item.precio_unitario * (Number(promo.porcentaje_descuento) / 100)).toFixed(2))
}

// De todas las promociones vigentes, la que le conviene más al cliente
// para este item (mayor descuento). Si ninguna aplica, no hay promo.
const mejorPromoParaItem = (item) => {
  let mejor = { promo: null, monto: 0 }
  for (const promo of promocionesVigentes.value) {
    const monto = montoSiAplica(item, promo)
    if (monto > mejor.monto) mejor = { promo, monto }
  }
  return mejor
}

const calcularDescuentoItem = (item) => mejorPromoParaItem(item).monto
const promoAplicadaItem = (item) => mejorPromoParaItem(item).promo

const cargarPromociones = async () => {
  try {
    const response = await axios.get(`${baseUrl}/api/promociones/vigentes`, headers())
    promocionesVigentes.value = response.data
  } catch (error) {
    console.error('Error cargando promociones:', error)
  }
}

// ============================================================
// CAJA ACTIVA (para saber si es individual o compartida)
// ============================================================
const cargarCajaActiva = async () => {
  try {
    const response = await axios.get(`${baseUrl}/api/cajas/activa`, headers())
    cajaActiva.value = response.data
  } catch (error) {
    console.error('Error cargando caja activa:', error)
  }
}

// ============================================================
// FINALIZAR VENTA
// ============================================================
const limpiarCarrito = () => {
  carrito.value = []
  metodoSeleccionado.value = null
  clienteSeleccionado.value = null
}

const finalizarVenta = async (datosPago) => {
  const venta = {
    items: carrito.value,
    total: total.value,
    metodo_pago: metodoSeleccionado.value,
    datos_pago: datosPago,
    id_cliente: clienteSeleccionado.value // null si es "Cliente General"
  }

  // Caja compartida: no se registra directo, queda esperando huella.
  if (cajaActiva.value?.modo_autenticacion === 'por_venta') {
    try {
      await axios.post(`${baseUrl}/api/ventas/pendiente`, venta, headers())
      iniciarEsperaHuella()
    } catch (error) {
      console.error('Error iniciando venta pendiente:', error)
      alert(error.response?.data?.error || 'Error al iniciar la confirmación por huella')
    }
    return
  }

  // Caja individual: como siempre, directo.
  try {
    await axios.post(`${baseUrl}/api/ventas`, venta, headers())
    alert('Venta realizada con éxito')
    limpiarCarrito()
  } catch (error) {
    console.error('Error finalizando venta:', error)
    alert(error.response?.data?.error || 'Error al procesar la venta')
  }
}

// ============================================================
// ESPERA DE HUELLA (caja compartida)
// ============================================================
const esperandoHuella = ref(false)
let intervaloHuella = null
let timeoutHuella = null

const INTERVALO_MS = 2000
const TIMEOUT_MS = 32000 // un poco más que el TTL de 30s del backend

const detenerEsperaHuella = () => {
  clearInterval(intervaloHuella)
  clearTimeout(timeoutHuella)
  intervaloHuella = null
  timeoutHuella = null
  esperandoHuella.value = false
}

const iniciarEsperaHuella = () => {
  esperandoHuella.value = true

  intervaloHuella = setInterval(async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/ventas/pendiente/resultado`, headers())

      if (response.status === 200 && response.data) {
        detenerEsperaHuella()
        if (response.data.success) {
          const t = response.data.trabajador
          alert(t ? `Venta confirmada por ${t.nombre} ${t.apellido}.` : 'Venta confirmada.')
          limpiarCarrito()
        } else {
          alert(response.data.error || 'No se pudo confirmar la venta.')
          // No limpiamos el carrito: el cajero puede reintentar el pago.
        }
      }
    } catch (error) {
      // Error de red puntual: seguimos intentando hasta el timeout.
    }
  }, INTERVALO_MS)

  timeoutHuella = setTimeout(() => {
    detenerEsperaHuella()
    alert('No se confirmó la venta a tiempo. Podés intentar de nuevo.')
  }, TIMEOUT_MS)
}

const cancelarEsperaHuella = () => {
  detenerEsperaHuella()
  // El pedido en el backend expira solo a los 30s si nadie confirma;
  // acá solo dejamos de esperar del lado del cajero.
}

onUnmounted(() => {
  detenerEsperaHuella()
})

// ============================================================
// CARGAR MÉTODOS DE PAGO
// ============================================================
const cargarMetodosPago = async () => {
  try {
    const response = await axios.get(`${baseUrl}/api/metodos-pago`, headers())
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
    const response = await axios.get(`${baseUrl}/api/clientes`, headers())
    clientes.value = response.data
  } catch (error) {
    console.error('Error cargando clientes:', error)
  }
}

onMounted(() => {
  cargarMetodosPago()
  cargarClientes()
  cargarPromociones()
  cargarCajaActiva()
})
</script>
