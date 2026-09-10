<!-- frontend/src/views/VentasView.vue -->
<!-- frontend/src/views/VentasView.vue -->
<template>
  <div class="p-6 max-w-6xl mx-auto relative">
    
    <!-- Banner de notificación visual -->
    <transition name="fade">
      <div 
        v-if="notificacion.visible"
        class="banner-notificacion"
        :class="notificacion.tipo === 'exito' ? 'banner-exito' : 'banner-error'"
      >
        <div class="icono-contenedor">
          <span>{{ notificacion.tipo === 'exito' ? '✓' : '✕' }}</span>
        </div>
        <p class="mensaje-texto">
          {{ notificacion.mensaje }}
        </p>
      </div>
    </transition>

    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Caja Registradora</h1>
      <div class="flex items-center gap-3">
        <span
          v-if="cajaActiva?.modo_autenticacion === 'por_venta'"
          class="text-xs font-semibold bg-purple-100 text-purple-700 px-2 py-1 rounded"
        >
          Caja compartida
        </span>
        <button
          @click="mostrarModalDinero = true"
          type="button"
          class="bg-blue-500 hover:bg-blue-600  text-white px-4 py-2 rounded-lg transition "
        >
          Dinero en Caja
        </button>
        <a
          class="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
          href="/cajas"
        >
          Cerrar Caja
        </a>

        <!-- Modales de la Vista -->
        <ResumenDineroCajaModal 
          v-if="mostrarModalDinero" 
          @cerrar="mostrarModalDinero = false" 
        />
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Columna izquierda: Buscador y carrito -->
      <div class="lg:col-span-2">
        <BuscadorProducto @agregar="agregarAlCarrito" />

        <CarritoCompras
          :items="carrito"
          :calcular-descuento="calcularDescuentoItem"
          :promo-aplicada="promoAplicadaItem"
          @actualizar-cantidad="actualizarCantidad"
          @eliminar="eliminarDelCarrito"
        />
      </div>

      <!-- Columna derecha: Resumen y selección de pago -->
      <div class="lg:col-span-1">
        <SelectorCliente
          :clientes="clientes"
          v-model="clienteSeleccionado"
        />

        <ResumenVenta
          :subtotal="subtotal"
          :descuento="descuento"
          :total="total"
        />

        <!-- Esperando confirmación por huella -->
        <div
          v-if="esperandoHuella"
          class="mt-4 bg-purple-50 border border-purple-300 rounded-lg p-4 text-center"
        >
          <div class="flex justify-center mb-2">
            <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-800"></div>
          </div>
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

        <!-- Métodos de pago -->
        <template v-else>
          <MetodosPago
            :metodos="metodosPago"
            :disabled="procesandoVenta || carrito.length === 0"
            @seleccionar="seleccionarMetodoPago"
          />
        </template>
      </div>
    </div>

    <!-- VENTANA EMERGENTE (MODAL DE PAGO) -->
    <div 
      v-if="metodoSeleccionado" 
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4"
    >
      <div class="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 relative animate-fadeIn">
        
        <!-- Botón para cerrar -->
        <button 
          @click="cerrarModalPago"
          class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 font-bold text-xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition"
        >
          ✕
        </button>

        <!-- Formularios de Pago -->
        <PagoEfectivo
          v-if="metodoSeleccionado === 'Efectivo'"
          :total="total"
          :cargando="procesandoVenta"
          @confirmar="finalizarVenta"
          @cancelar="cerrarModalPago"
        />
        <PagoTarjeta
          v-else-if="metodoSeleccionado === 'Tarjeta Débito' || metodoSeleccionado === 'Tarjeta Crédito'"
          :tipo="metodoSeleccionado"
          :total="total"
          :cargando="procesandoVenta"
          @confirmar="finalizarVenta"
          @cancelar="cerrarModalPago"
        />
        <PagoTransferencia
          v-else-if="metodoSeleccionado === 'Transferencia' || metodoSeleccionado === 'Mercado Pago'"
          :tipo="metodoSeleccionado"
          :total="total"
          :cargando="procesandoVenta"
          @confirmar="finalizarVenta"
          @cancelar="cerrarModalPago"
        />
        <PagoCheque
          v-else-if="metodoSeleccionado === 'Cheque'"
          :total="total"
          :cargando="procesandoVenta"
          @confirmar="finalizarVenta"
          @cancelar="cerrarModalPago"
        />
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
import ResumenDineroCajaModal from '../components/caja/ResumenDineroCajaModal.vue'

const authStore = useAuthStore()
const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'
const headers = () => ({ headers: { 'Authorization': `Bearer ${authStore.token}` } })

// STATE
const carrito = ref([])
const metodosPago = ref([])
const metodoSeleccionado = ref(null)
const clientes = ref([])
const clienteSeleccionado = ref(null)
const promocionesVigentes = ref([])
const cajaActiva = ref(null)
const mostrarModalDinero = ref(false)

// NUEVOS ESTADOS DE CONTROL DE PROCESO Y NOTIFICACIÓN
const procesandoVenta = ref(false)
const notificacion = ref({ visible: false, mensaje: '', tipo: 'exito' })

const mostrarNotificacion = (mensaje, tipo = 'exito') => {
  notificacion.value = { visible: true, mensaje, tipo }
  setTimeout(() => {
    notificacion.value.visible = false
  }, 4000)
}

// COMPUTED
const subtotal = computed(() => {
  return carrito.value.reduce((sum, item) => sum + (item.cantidad * item.precio_unitario), 0)
})

const descuento = computed(() => {
  return carrito.value.reduce((sum, item) => sum + calcularDescuentoItem(item), 0)
})

const total = computed(() => subtotal.value - descuento.value)

// MÉTODOS CARRITO
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
}

const eliminarDelCarrito = (index) => {
  carrito.value.splice(index, 1)
}

const seleccionarMetodoPago = (metodo) => {
  metodoSeleccionado.value = metodo
}

// cerrar ventanas emergentes de pago
const cerrarModalPago = () => {
  metodoSeleccionado.value = null
}

// PROMOCIONES
const montoSiAplica = (item, promo) => {
  const aplicaAlProducto = promo.sin_restriccion || promo.productos_aplicables.includes(item.id_producto)
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
    const n = promo.cantidad_minima
    const m = promo.cantidad_paga
    if (!n || m === null || m === undefined) return 0
    const gruposCompletos = Math.floor(item.cantidad / n)
    if (gruposCompletos === 0) return 0
    return Number((item.precio_unitario * gruposCompletos * (n - m)).toFixed(2))
  }

  return Number((item.cantidad * item.precio_unitario * (Number(promo.porcentaje_descuento) / 100)).toFixed(2))
}

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

const cargarCajaActiva = async () => {
  try {
    const response = await axios.get(`${baseUrl}/api/cajas/activa`, headers())
    cajaActiva.value = response.data
  } catch (error) {
    console.error('Error cargando caja activa:', error)
  }
}

// FINALIZAR VENTA CON CONTROL DE BLOQUEO (DEBOUNCE/LOCK)
const limpiarCarrito = () => {
  carrito.value = []
  metodoSeleccionado.value = null
  clienteSeleccionado.value = null
}

const finalizarVenta = async (datosPago) => {
  if (procesandoVenta.value) return // Previene clics dobles simultáneos
  if (carrito.value.length === 0) {
    mostrarNotificacion('El carrito está vacío', 'error')
    return
  }

  procesandoVenta.value = true

  const venta = {
    items: carrito.value,
    total: total.value,
    metodo_pago: metodoSeleccionado.value,
    datos_pago: datosPago,
    id_cliente: clienteSeleccionado.value
  }

  if (cajaActiva.value?.modo_autenticacion === 'por_venta') {
    try {
      await axios.post(`${baseUrl}/api/ventas/pendiente`, venta, headers())
      iniciarEsperaHuella()
    } catch (error) {
      console.error('Error iniciando venta pendiente:', error)
      mostrarNotificacion(error.response?.data?.error || 'Error al iniciar confirmación por huella', 'error')
    } finally {
      procesandoVenta.value = false
    }
    return
  }

  try {
    await axios.post(`${baseUrl}/api/ventas`, venta, headers())
    mostrarNotificacion('Venta realizada con éxito', 'exito')
    limpiarCarrito()
  } catch (error) {
    console.error('Error finalizando venta:', error)
    mostrarNotificacion(error.response?.data?.error || 'Error al procesar la venta', 'error')
  } finally {
    procesandoVenta.value = false
  }
}

// ESPERA DE HUELLA
const esperandoHuella = ref(false)
let intervaloHuella = null
let timeoutHuella = null

const INTERVALO_MS = 2000
const TIMEOUT_MS = 32000

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
          mostrarNotificacion(t ? `Venta confirmada por ${t.nombre} ${t.apellido}.` : 'Venta confirmada.', 'exito')
          limpiarCarrito()
        } else {
          mostrarNotificacion(response.data.error || 'No se pudo confirmar la venta.', 'error')
        }
      }
    } catch (error) {
      // reintentar
    }
  }, INTERVALO_MS)

  timeoutHuella = setTimeout(() => {
    detenerEsperaHuella()
    mostrarNotificacion('Tiempo agotado. No se confirmó la venta.', 'error')
  }, TIMEOUT_MS)
}

const cancelarEsperaHuella = () => {
  detenerEsperaHuella()
}

onUnmounted(() => {
  detenerEsperaHuella()
})

const cargarMetodosPago = async () => {
  try {
    const response = await axios.get(`${baseUrl}/api/metodos-pago`, headers())
    metodosPago.value = response.data
  } catch (error) {
    console.error('Error cargando métodos de pago:', error)
  }
}

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

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
/* Estilos explícitos del Banner para evitar transparencias */
.banner-notificacion {
  position: fixed;
  top: 1.25rem;
  right: 1.25rem;
  z-index: 9999;
  padding: 1rem 1.25rem;
  border-radius: 0.75rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #ffffff !important;
  opacity: 1 !important;
}

/* Verde sólido para Éxito */
.banner-exito {
  background-color: #059669 !important; /* Emerald 600 */
  border: 1px solid #10b981;
}

/* Rojo sólido para Error */
.banner-error {
  background-color: #e11d48 !important; /* Rose 600 */
  border: 1px solid #f43f5e;
}

.icono-contenedor {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 9999px;
  background-color: rgba(255, 255, 255, 0.25);
  font-size: 1.125rem;
  font-weight: bold;
  color: #ffffff !important;
}

.mensaje-texto {
  color: #ffffff !important;
  font-size: 0.875rem;
  font-weight: 600;
  margin: 0;
}

/* Transición suave de entrada y salida */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0 !important;
  transform: translateY(-10px);
}
</style>