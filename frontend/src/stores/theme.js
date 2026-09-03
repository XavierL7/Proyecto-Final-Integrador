import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useThemeStore = defineStore('theme', () => {
  // Leemos el tema guardado o detectamos si el sistema operativo usa modo oscuro
  const esOscuro = ref(
    localStorage.getItem('theme') === 'dark' ||
    (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
  )

  const aplicarTema = () => {
    if (esOscuro.value) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  const toggleTema = () => {
    esOscuro.value = !esOscuro.value
    aplicarTema()
  }

  // Inicializar al cargar la app
  const inicializarTema = () => {
    aplicarTema()
  }

  return { esOscuro, toggleTema, inicializarTema }
})