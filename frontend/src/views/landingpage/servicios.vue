<template>
  <section class="bg-[#e2e2e2] text-gray-800 min-h-screen py-16 px-4 sm:px-6 lg:px-8">
    <div class="max-w-6xl mx-auto space-y-16">

      <div class="text-center space-y-4 max-w-3xl mx-auto">
        <h1 class="text-3xl md:text-5xl font-black tracking-tight text-black">
          Todo lo que tu negocio <br class="hidden sm:inline">
          necesita, <span class="text-[#00a8bd]">en uno.</span>
        </h1>
        <p class="text-gray-600 text-sm md:text-base leading-relaxed px-4">
          Módulos integrados que trabajan juntos. No más planillas sueltas, no más sistemas que no se comuniquen.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
        <div 
          v-for="module in modules" 
          :key="module.id"
          class="relative rounded-2xl p-8 pt-12 flex flex-col justify-between shadow-lg"
          :class="module.isCyan ? 'bg-[#00a8bd] text-black' : 'bg-[#11161d] text-white'"
        >
          <!-- Badge Número -->
          <div 
            class="absolute -top-4 -left-4 font-bold w-12 h-12 rounded-full flex items-center justify-center text-sm border-2 border-[#e2e2e2]"
            :class="module.isCyan ? 'bg-[#11161d] text-white' : 'bg-[#007ba2] text-white'"
          >
            {{ module.id }}
          </div>

          <div class="space-y-6 text-center">
            <!-- Icono principal -->
            <div class="flex justify-center">
              <div v-if="module.customIconWrapper" class="w-16 h-16 flex items-center justify-center" :class="module.customIconWrapper">
                <component :is="module.icon" :class="module.isCyan ? 'text-gray-700' : 'text-[#00bcd4]'" class="w-10 h-10" />
              </div>
              <component v-else :is="module.icon" class="w-16 h-16" :class="module.isCyan ? 'text-black' : 'text-[#00bcd4]'" />
            </div>

            <h2 class="text-xl font-bold" :class="module.isCyan ? 'text-black' : 'text-[#00bcd4]'">
              {{ module.title }}
            </h2>
            <p 
              class="text-xs leading-relaxed text-left" 
              :class="module.isCyan ? 'text-black/80 font-medium' : 'text-gray-300'"
            >
              {{ module.description }}
            </p>
          </div>

          <!-- Listado de características -->
          <div 
            class="mt-8 space-y-3 text-xs"
            :class="module.isCyan ? 'text-black font-semibold' : 'text-gray-300'"
          >
            <div v-for="(feature, idx) in module.features" :key="idx" class="flex items-start gap-2">
              <svg 
                class="w-4 h-4 shrink-0 mt-0.5" 
                :class="module.isCyan ? 'text-black' : 'text-[#00bcd4]'" 
                fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"></path>
              </svg>
              <span>{{ feature }}</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  </section>
</template>

<script setup>
import { h } from 'vue'

const StockIcon = () => h('svg', { fill: 'none', stroke: 'currentColor', 'stroke-width': '1.5', viewBox: '0 0 24 24' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' }),
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M17 17h2a1 1 0 001-1v-3a1 1 0 00-1-1h-2v4z' })
])

const PosIcon = () => h('svg', { fill: 'none', stroke: 'currentColor', 'stroke-width': '1.5', viewBox: '0 0 24 24' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' })
])

const CashIcon = () => h('svg', { fill: 'none', stroke: 'currentColor', 'stroke-width': '1.5', viewBox: '0 0 24 24' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' })
])

const AttendanceIcon = () => h('svg', { fill: 'none', stroke: 'currentColor', 'stroke-width': '2', viewBox: '0 0 24 24' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' })
])

const AnalyticsIcon = () => h('svg', { fill: 'none', stroke: 'currentColor', 'stroke-width': '1.5', viewBox: '0 0 24 24' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' }),
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M16 17v4m-4-8v8m-4-4v4' })
])

const SecurityIcon = () => h('svg', { fill: 'none', stroke: 'currentColor', 'stroke-width': '2', viewBox: '0 0 24 24' }, [
  h('path', { 'stroke-linecap': 'round', 'stroke-linejoin': 'round', d: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' })
])

const modules = [
  {
    id: '01',
    isCyan: false,
    title: 'Gestión de Stock',
    description: 'Control de inventario en tiempo real con alertas automáticas cuando el stock llega al mínimo configurado.',
    icon: StockIcon,
    features: ['Registro de entrada y salida', 'Cálculo de horas trabajadas', 'Historial por empleado']
  },
  {
    id: '02',
    isCyan: true,
    title: 'Punto de Ventas',
    description: 'Caja rápida e intuitiva para el vendedor. Registro de ventas, cálculo de cambio, medios de pago múltiples.',
    icon: PosIcon,
    features: ['Efectivo, tarjeta, transferencia', 'Ventas en cuenta corriente', 'Descuentos y promociones']
  },
  {
    id: '03',
    isCyan: false,
    title: 'Gestión de Caja',
    description: 'Apertura y cierre de caja con resumen diario. Seguimiento de ingresos y egresos por tipo de pago.',
    icon: CashIcon,
    features: ['Apertura y cierre diario', 'Egresos y gastos del día', 'Resumen por vendedor']
  },
  {
    id: '04',
    isCyan: true,
    title: 'Asistencia del Personal',
    description: 'El ingreso al sistema con huella digital registra automáticamente la asistencia. Sin papeles ni relojes adicionales.',
    icon: AttendanceIcon,
    customIconWrapper: 'bg-gray-200/60 rounded-full',
    features: ['Registro de entrada y salida', 'Cálculo de horas trabajadas', 'Historial por empleado']
  },
  {
    id: '05',
    isCyan: false,
    title: 'Reportes & Analítica',
    description: 'Visualización de ventas, rentabilidad y tendencias. Disponible solo para usuarios con nivel de acceso Admin.',
    icon: AnalyticsIcon,
    features: ['Top productos del período', 'Ingresos por vendedor', 'Comparativa mensual', 'Top vendedores por día']
  },
  {
    id: '06',
    isCyan: true,
    title: 'Seguridad & Roles',
    description: 'Sistema de permisos por nivel. Cada usuario accede únicamente a lo que corresponde a su rol dentro de la organización.',
    icon: SecurityIcon,
    customIconWrapper: 'bg-gray-200/60 rounded-t-full rounded-b-2xl',
    features: ['Niveles: Admin y roles creados', 'Log de acciones por usuario', 'Bloqueo por inactividad']
  }
]
</script>