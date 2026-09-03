<!-- frontend/src/components/caja/SelectorCliente.vue -->
<template>
  <div class="rounded-lg shadow p-4 mb-4">
    <label class="block text-sm font-semibold mb-2">Cliente</label>

    <select
      :value="modelValue ?? ''"
      @change="onChange"
      class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
    >
      <option value="">Cliente General</option>
      <option
        v-for="cliente in clientes"
        :key="cliente.id_cliente"
        :value="cliente.id_cliente"
      >
        {{ cliente.nombre }} {{ cliente.apellido }} — DNI {{ cliente.dni }}
      </option>
    </select>

    <p v-if="clienteActual" class="text-xs mt-1">
      {{ clienteActual.telefono ? `Tel: ${clienteActual.telefono}` : 'Sin teléfono cargado' }}
    </p>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  clientes: { type: Array, default: () => [] },
  // null / '' = "Cliente General". Si no, es el id_cliente seleccionado.
  modelValue: { type: [Number, String, null], default: null }
})

const emit = defineEmits(['update:modelValue'])

const onChange = (e) => {
  const valor = e.target.value
  // El <option> de "Cliente General" tiene value="" -> lo mandamos como null
  emit('update:modelValue', valor === '' ? null : Number(valor))
}

const clienteActual = computed(() =>
  props.clientes.find(c => c.id_cliente === props.modelValue) || null
)
</script>
