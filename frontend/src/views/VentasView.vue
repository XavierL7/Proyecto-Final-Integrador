<!-- frontend/src/views/VentasView.vue -->
<template>
  <div class="ventas-container">
    <h1>Ventas</h1>
    
    <!-- Buscador de productos -->
    <div class="buscador">
      <input 
        type="text" 
        v-model="codigoBuscado" 
        placeholder="Ingresa código de barras o nombre del producto"
        @keyup.enter="buscarProducto"
      />
      <button @click="buscarProducto" class="btn-buscar">Buscar</button>
    </div>

    <!-- Producto encontrado -->
    <div v-if="productoEncontrado" class="producto-card">
      <h3>{{ productoEncontrado.nombre_producto }}</h3>
      <p><strong>Código:</strong> {{ productoEncontrado.codigo_barras || 'Sin código' }}</p>
      <p><strong>Precio:</strong> ${{ productoEncontrado.precio_unitario }}</p>
      <p><strong>Stock disponible:</strong> {{ productoEncontrado.stock_actual }}</p>
      
      <div class="acciones">
        <label>Cantidad:</label>
        <input type="number" v-model.number="cantidad" min="1" :max="productoEncontrado.stock_actual" />
        <button @click="agregarAlCarrito" class="btn-agregar"> Agregar</button>
      </div>
    </div>

    <p v-else-if="buscando && !productoEncontrado" class="no-encontrado">
      Producto no encontrado
    </p>

    <!-- Carrito de compras -->
    <div v-if="carrito.length > 0" class="carrito">
      <h2>Carrito</h2>
      <table>
        <thead>
          <tr>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Precio</th>
            <th>Subtotal</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in carrito" :key="index">
            <td>{{ item.nombre_producto }}</td>
            <td>{{ item.cantidad }}</td>
            <td>${{ item.precio_unitario }}</td>
            <td>${{ (item.cantidad * item.precio_unitario).toFixed(2) }}</td>
            <td><button @click="eliminarDelCarrito(index)" class="btn-eliminar">X</button></td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td colspan="3"><strong>Total</strong></td>
            <td><strong>${{ totalCarrito.toFixed(2) }}</strong></td>
            <td></td>
          </tr>
        </tfoot>
      </table>
      <button @click="finalizarVenta" class="btn-finalizar">Finalizar Venta</button>
    </div>

    <!-- Mensaje de venta realizada -->
    <div v-if="ventaRealizada" class="venta-exitosa">
      <h2>Venta realizada con éxito</h2>
      <p>Total: ${{ ultimaVentaTotal }}</p>
      <button @click="ventaRealizada = false" class="btn-volver">Volver</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import axios from 'axios'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
const codigoBuscado = ref('')
const productoEncontrado = ref(null)
const buscando = ref(false)
const cantidad = ref(1)
const carrito = ref([])
const ventaRealizada = ref(false)
const ultimaVentaTotal = ref(0)

const totalCarrito = computed(() => {
  return carrito.value.reduce((total, item) => {
    return total + (item.cantidad * item.precio_unitario)
  }, 0)
})

// Buscar producto por código o nombre
const buscarProducto = async () => {
  if (!codigoBuscado.value.trim()) {
    alert('Ingresa un código o nombre de producto')
    return
  }

  buscando.value = true
  productoEncontrado.value = null

  try {
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'
    const response = await axios.get(`${baseUrl}/api/productos/buscar`, {
      params: { q: codigoBuscado.value },
      headers: {
        'Authorization': `Bearer ${authStore.token}`
      }
    })

    if (response.data) {
      productoEncontrado.value = response.data
      cantidad.value = 1
    } else {
      productoEncontrado.value = null
    }
  } catch (error) {
    console.error('Error buscando producto:', error)
    productoEncontrado.value = null
  } finally {
    buscando.value = false
  }
}

// Agregar producto al carrito
const agregarAlCarrito = () => {
  if (!productoEncontrado.value) return

  // Verificar stock
  if (cantidad.value > productoEncontrado.value.stock_actual) {
    alert(`Stock insuficiente. Disponible: ${productoEncontrado.value.stock_actual}`)
    return
  }

  // Verificar si ya está en el carrito
  const existente = carrito.value.find(item => item.id_producto === productoEncontrado.value.id_producto)
  
  if (existente) {
    const nuevaCantidad = existente.cantidad + cantidad.value
    if (nuevaCantidad > productoEncontrado.value.stock_actual) {
      alert(`Stock insuficiente. Disponible: ${productoEncontrado.value.stock_actual}`)
      return
    }
    existente.cantidad = nuevaCantidad
  } else {
    carrito.value.push({
      id_producto: productoEncontrado.value.id_producto,
      nombre_producto: productoEncontrado.value.nombre_producto,
      precio_unitario: productoEncontrado.value.precio_unitario,
      cantidad: cantidad.value,
      stock_actual: productoEncontrado.value.stock_actual
    })
  }

  // Limpiar búsqueda
  codigoBuscado.value = ''
  productoEncontrado.value = null
  cantidad.value = 1
}

// Eliminar del carrito
const eliminarDelCarrito = (index) => {
  carrito.value.splice(index, 1)
}

// Finalizar venta
const finalizarVenta = async () => {
  if (carrito.value.length === 0) {
    alert('El carrito está vacío')
    return
  }

  try {
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'
    const total = totalCarrito.value

    // Simular venta (solo para prueba)
    console.log('Venta registrada:', {
      total: total,
      productos: carrito.value,
      trabajador: authStore.trabajador?.nombre
    })

    ultimaVentaTotal.value = total
    ventaRealizada.value = true
    carrito.value = []

  } catch (error) {
    console.error('Error finalizando venta:', error)
    alert('Error al finalizar la venta')
  }
}
</script>

