<!-- frontend/src/views/DashboardView.vue -->
<!-- dashboard para acceder slo a ventas por ahora -->
<template>
  <div class="dashboard">
    <h1>Panel de Control - Kairo</h1>
    
    <!-- muestra info basica del vendedor, nombre y apellido. rol y permisos ahora viven en /perfil -->
    <div class="user-info">
      <p>Usuario: {{ authStore.trabajador?.nombre }} {{ authStore.trabajador?.apellido }}</p>
    </div>
 
    <!-- Resumen de hoy -->
    <div class="resumen-hoy">
      <h2 class="resumen-titulo">Cómo va hoy</h2>
 
      <div class="kpi-grid">
        <div class="kpi-card kpi-sky">
          <p class="kpi-label">Ventas</p>
          <p class="kpi-valor">{{ resumenHoy.tickets }}</p>
        </div>
        <div class="kpi-card kpi-teal">
          <p class="kpi-label">Precio Promedio</p>
          <p class="kpi-valor">${{ formatearNumero(resumenHoy.precio_promedio) }}</p>
        </div>
        <div class="kpi-card kpi-blue">
          <p class="kpi-label">Productos x Venta</p>
          <p class="kpi-valor">{{ formatearNumero(resumenHoy.productos_por_ticket) }}</p>
        </div>
        <div class="kpi-card kpi-violet">
          <p class="kpi-label">Venta promedio</p>
          <p class="kpi-valor">${{ formatearNumero(resumenHoy.ticket_promedio) }}</p>
        </div>
        <div class="kpi-card kpi-yellow">
          <p class="kpi-label">Total $</p>
          <p class="kpi-valor">${{ formatearNumero(resumenHoy.total) }}</p>
        </div>
        <div class="kpi-card kpi-pink">
          <p class="kpi-label">Total Unidades</p>
          <p class="kpi-valor">{{ resumenHoy.unidades }}</p>
        </div>
      </div>
 
      <div class="resumen-graficos">
        <div class="grafico-box">
          <p class="grafico-titulo">Ventas por vendedor</p>
          <div v-if="resumenHoy.porVendedor.length === 0" class="sin-datos">
            Sin ventas hoy todavía.
          </div>
          <div v-else>
            <div v-for="v in resumenHoy.porVendedor" :key="v.id_trabajador" class="barra-fila">
              <div class="barra-info">
                <span class="barra-nombre">{{ v.nombre }}</span>
                <span class="barra-detalle">${{ formatearNumero(v.total) }} · {{ v.unidades }} uds</span>
              </div>
              <div class="barra-fondo">
                <div class="barra-relleno" :style="{ width: anchoBarra(v.total, maxTotalVendedor) + '%' }"></div>
              </div>
            </div>
          </div>
        </div>
 
        <div class="grafico-box">
          <p class="grafico-titulo">Ventas por etiqueta</p>
          <div v-if="resumenHoy.porEtiqueta.length === 0" class="sin-datos">
            Sin ventas hoy todavía.
          </div>
          <div v-else class="dona-contenedor">
            <svg viewBox="0 0 42 42" class="dona-svg">
              <circle
                v-for="seg in segmentosDonut"
                :key="seg.id_etiqueta"
                cx="21" cy="21" r="15.9"
                fill="transparent"
                :stroke="seg.color"
                stroke-width="6"
                pathLength="100"
                :stroke-dasharray="`${seg.porcentaje} ${100 - seg.porcentaje}`"
                :stroke-dashoffset="seg.dashoffset"
              />
            </svg>
            <ul class="dona-leyenda">
              <li v-for="seg in segmentosDonut" :key="seg.id_etiqueta">
                <span class="dona-punto" :style="{ backgroundColor: seg.color }"></span>
                <span class="dona-nombre">{{ seg.nombre_etiqueta }}</span>
                <span class="dona-porcentaje">{{ seg.porcentaje }}%</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
 
 
    <div class="dashboard-grid">
      <!-- solo admin -->
      <button 
        v-if="authStore.tienePermiso('crear_roles')"
        class="btn-admin"
        @click="navigateTo('/administracion')"
      >
      Panel Admin
      </button>
 
      <!-- boton quelleva a Ventas -->
      <button 
        class="btn-ventas"
        @click="navigateTo('/ventas')"
      >
       Ventas
      </button>
 
      <!-- boton que lleva a Cajas -->
      <button 
        class="btn-cajas"
        @click="navigateTo('/cajas')"
      >
       Cajas
      </button>
 
      <!-- boton que lleva al perfil del usuario (datos, rol, permisos y cambio de contraseña) -->
      <button 
        class="btn-perfil"
        @click="navigateTo('/perfil')"
      >
       Perfil
      </button>
    </div>
  </div>
</template>
 
<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'
 
 
//usa router para redirigir a otras paginas y authstore para autenticar usuarios
const authStore = useAuthStore()
const router = useRouter()
 
const navigateTo = (path) => {
  router.push(path)
}
 
// ---------- Resumen de hoy ----------
const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000'
 
const resumenHoy = ref({
  tickets: 0,
  total: 0,
  unidades: 0,
  precio_promedio: 0,
  productos_por_ticket: 0,
  ticket_promedio: 0,
  porVendedor: [],
  porEtiqueta: []
})
 
const formatearNumero = (n) => Number(n || 0).toLocaleString('es-AR', { maximumFractionDigits: 2 })
 
const maxTotalVendedor = computed(() => {
  return Math.max(1, ...resumenHoy.value.porVendedor.map(v => v.total))
})
 
const anchoBarra = (valor, maximo) => Math.max(4, Math.round((valor / maximo) * 100))
 
const coloresEtiquetas = ['#4a8db7', '#a78bfa', '#f472b6', '#34d399', '#fbbf24', '#fb923c', '#f87171', '#60a5fa']
 
const segmentosDonut = computed(() => {
  let acumulado = 0
  return resumenHoy.value.porEtiqueta.map((e, i) => {
    const seg = {
      ...e,
      color: coloresEtiquetas[i % coloresEtiquetas.length],
      dashoffset: -acumulado
    }
    acumulado += e.porcentaje
    return seg
  })
})
 
const cargarResumenHoy = async () => {
  try {
    const { data } = await axios.get(`${baseUrl}/api/estadisticas/resumen-dia`, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    })
    resumenHoy.value = data
  } catch (error) {
    console.error('Error cargando el resumen de hoy:', error)
  }
}
 
onMounted(cargarResumenHoy)
</script>
 
<style scoped> 
.dashboard {
  padding: 32px 40px;
  max-width: 1600px;
  margin: 0 auto;
}
 
h1 {
  font-size: 2rem;
}
 
.user-info {
  padding: 18px 24px;
  border-radius: 10px;
  margin-bottom: 36px;
  border: 1px solid #dee2e6;
  font-size: 1.05rem;
}
 
.user-info p {
  margin: 5px 0;
}
 
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}
 
@media (min-width: 900px) {
  .dashboard-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
 
button {
  padding: 18px 20px;
  border: none;
  border-radius: 10px;
  font-size: 1.35rem;
  cursor: pointer;
}
 
button:hover {
  transform: scale(1.02);
}
 
.btn-admin {
  background: #ffc107;
  color: #212529;
  border: 2px solid #ffc107;
}
 
.btn-admin:hover {
  background: #e0a800;
}
 
.btn-ventas {
  background: #4CAF50;
  color: #212529;
}
 
.btn-ventas:hover {
  background: #45a049;
}
 
.btn-cajas {
  background: #2196F3;
  color: #212529;
}
 
.btn-cajas:hover {
  background: #1976D2;
}
 
.btn-perfil {
  background: #6c757d;
  color: #fff;
}
 
.btn-perfil:hover {
  background: #5a6268;
}
 
/* ---------- Resumen de hoy ---------- */
.resumen-hoy {
  margin-bottom: 40px;
}
 
.resumen-titulo {
  font-size: 1.5rem;
  margin-bottom: 18px;
}
 
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}
 
@media (min-width: 640px) {
  .kpi-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
 
@media (min-width: 1100px) {
  .kpi-grid {
    grid-template-columns: repeat(6, 1fr);
  }
}
 
.kpi-card {
  border-radius: 16px;
  padding: 20px;
}
 
.kpi-label {
  font-size: 0.95rem;
  font-weight: 600;
  margin: 0;
}
 
.kpi-valor {
  font-size: 2rem;
  font-weight: 700;
  margin: 8px 0 0;
}
 
.kpi-sky    { background: #bae6fd; color: #0c4a6e; }
.kpi-teal   { background: #2dd4bf; color: #042f2e; }
.kpi-blue   { background: #3b82f6; color: #fff; }
.kpi-violet { background: #c4b5fd; color: #2e1065; }
.kpi-yellow { background: #fde047; color: #422006; }
.kpi-pink   { background: #f472b6; color: #500724; }
 
.resumen-graficos {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}
 
@media (min-width: 900px) {
  .resumen-graficos {
    grid-template-columns: 1fr 1fr;
  }
}
 
.grafico-box {
  background: #f3f4f6;
  border-radius: 16px;
  padding: 24px;
}
 
.grafico-titulo {
  font-size: 1.15rem;
  font-weight: 600;
  margin: 0 0 18px;
  color: #111827;
}
 
.sin-datos {
  text-align: center;
  color: #6b7280;
  font-size: 1rem;
  padding: 32px 0;
}
 
.barra-fila {
  margin-bottom: 16px;
}
 
.barra-info {
  display: flex;
  justify-content: space-between;
  font-size: 0.95rem;
  margin-bottom: 5px;
}
 
.barra-nombre {
  font-weight: 600;
  color: #111827;
}
 
.barra-detalle {
  color: #6b7280;
}
 
.barra-fondo {
  width: 100%;
  height: 14px;
  background: #e5e7eb;
  border-radius: 999px;
  overflow: hidden;
}
 
.barra-relleno {
  height: 100%;
  background: #3b82f6;
  border-radius: 999px;
}
 
.dona-contenedor {
  display: flex;
  align-items: center;
  gap: 28px;
}
 
.dona-svg {
  width: 180px;
  height: 180px;
  flex-shrink: 0;
  transform: rotate(-90deg);
}
 
.dona-leyenda {
  list-style: none;
  padding: 0;
  margin: 0;
  font-size: 0.95rem;
}
 
.dona-leyenda li {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}
 
.dona-punto {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  display: inline-block;
}
 
.dona-nombre {
  font-weight: 600;
  color: #111827;
}
 
.dona-porcentaje {
  color: #6b7280;
}
</style>