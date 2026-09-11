<!-- frontend/src/components/stock/SelectorEtiquetas.vue -->
<!--
  Barra de búsqueda + chips para elegir etiquetas, en vez de listar todas
  las etiquetas como checkboxes (con muchas etiquetas eso sobrecarga la
  pantalla). Se usa tanto para filtrar el listado de Stock como para
  asignar etiquetas al crear/editar un producto.

  - v-model: array de id_etiqueta seleccionados
  - :etiquetas: lista completa de etiquetas disponibles (ya se trae una
    sola vez al cargar la vista; acá solo se filtra en memoria, sin pegarle
    al backend en cada letra)
-->
<template>
  <div class="relative" ref="contenedor">
    <!-- Caja única: chips + input adentro del mismo contorno, para que se
         vea como un solo campo y no una caja chica perdida bajo el título -->
    <div
      class="w-full flex flex-wrap items-center gap-1.5 px-2 py-1.5 border border-gray-300 rounded-lg bg-white focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500"
      @click="focoInput"
    >
      <span
        v-for="etiqueta in seleccionadas"
        :key="etiqueta.id_etiqueta"
        class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 whitespace-nowrap"
      >
        {{ etiqueta.nombre_etiqueta }}
        <button
          type="button"
          @click.stop="quitar(etiqueta.id_etiqueta)"
          class="text-blue-500 hover:text-blue-800 font-bold leading-none"
          title="Quitar etiqueta"
        >
          ×
        </button>
      </span>

      <!-- Campo de búsqueda, sin su propio borde: el contorno lo pone la caja de afuera -->
      <input
        ref="input"
        type="text"
        v-model="busqueda"
        @focus="desplegado = true"
        :placeholder="seleccionadas.length === 0 ? placeholder : ''"
        class="flex-1 min-w-[120px] border-none outline-none text-sm py-0.5"
      />
    </div>

    <!-- Dropdown de resultados (se limita a unos pocos para no sobrecargar) -->
    <div
      v-if="desplegado && busqueda.trim() !== ''"
      class="absolute left-0 right-0 mt-1 max-h-56 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg z-20 divide-y divide-gray-100"
    >
      <button
        v-for="etiqueta in resultados"
        :key="etiqueta.id_etiqueta"
        type="button"
        @click="elegir(etiqueta)"
        class="w-full text-left px-3 py-2 text-sm text-gray-800 hover:bg-blue-50 transition-colors"
      >
        {{ etiqueta.nombre_etiqueta }}
      </button>

      <div v-if="resultados.length === 0" class="px-3 py-2 text-xs text-gray-400 text-center">
        No se encontraron etiquetas
      </div>
      <div v-else-if="hayMasResultados" class="px-3 py-1.5 text-xs text-gray-400 text-center">
        Seguí escribiendo para afinar la búsqueda...
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  etiquetas: { type: Array, default: () => [] }, // lista completa disponible
  modelValue: { type: Array, default: () => [] }, // ids seleccionados
  placeholder: { type: String, default: 'Buscar etiquetas...' },
  maxResultados: { type: Number, default: 8 }
})

const emit = defineEmits(['update:modelValue'])

const busqueda = ref('')
const desplegado = ref(false)
const contenedor = ref(null)
const input = ref(null)

const focoInput = () => input.value?.focus()

const seleccionadas = computed(() =>
  props.etiquetas.filter(e => props.modelValue.includes(e.id_etiqueta))
)

// Candidatas: todas las que todavía no están seleccionadas y matchean el texto
const candidatas = computed(() => {
  const q = busqueda.value.trim().toLowerCase()
  if (!q) return []
  return props.etiquetas.filter(
    e => !props.modelValue.includes(e.id_etiqueta) &&
         e.nombre_etiqueta.toLowerCase().includes(q)
  )
})

// Solo mostramos un puñado a la vez, aunque haya cientos de etiquetas
const resultados = computed(() => candidatas.value.slice(0, props.maxResultados))
const hayMasResultados = computed(() => candidatas.value.length > props.maxResultados)

function elegir(etiqueta) {
  emit('update:modelValue', [...props.modelValue, etiqueta.id_etiqueta])
  busqueda.value = ''
}

function quitar(id) {
  emit('update:modelValue', props.modelValue.filter(id_etiqueta => id_etiqueta !== id))
}

const handleClickOutside = (e) => {
  if (contenedor.value && !contenedor.value.contains(e.target)) {
    desplegado.value = false
    busqueda.value = ''
  }
}

onMounted(() => document.addEventListener('click', handleClickOutside))
onUnmounted(() => document.removeEventListener('click', handleClickOutside))
</script>
