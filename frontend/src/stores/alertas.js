// frontend/src/stores/alertas.js
//
// Cola simple de avisos globales tipo "toast". La usa el interceptor de
// axios (plugins/axiosErrorHandler.js) para mostrar un mensaje amigable
// cuando el servidor o la base de datos no responden, sin importar qué
// pantalla haya disparado la request.
import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useAlertasStore = defineStore('alertas', () => {
  const mensaje = ref('')
  const visible = ref(false)
  let idOculto = null

  const mostrar = (texto, duracionMs = 6000) => {
    mensaje.value = texto
    visible.value = true
    clearTimeout(idOculto)
    idOculto = setTimeout(() => {
      visible.value = false
    }, duracionMs)
  }

  const ocultar = () => {
    visible.value = false
    clearTimeout(idOculto)
  }

  return { mensaje, visible, mostrar, ocultar }
})
