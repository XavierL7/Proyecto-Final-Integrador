<!-- frontend/src/views/PerfilView.vue -->
<!-- perfil del usuario: sus datos, sus permisos (a pedido) y el cambio de contraseña -->
<template>
  <div class="perfil">
    <h1>Mi Perfil - Kairo</h1>

    <!-- aviso obligatorio si es el primer ingreso del trabajador -->
    <div v-if="authStore.requiereCambioPassword" class="aviso-primer-ingreso">
      Es tu primer ingreso al sistema. Por seguridad, tenés que cambiar tu
      contraseña provisoria antes de continuar.
    </div>

    <!-- datos del trabajador -->
    <div class="seccion datos-usuario">
      <h2>Mis datos</h2>
      <p><strong>Nombre:</strong> {{ authStore.trabajador?.nombre }}</p>
      <p><strong>Apellido:</strong> {{ authStore.trabajador?.apellido }}</p>
      <p><strong>DNI:</strong> {{ authStore.trabajador?.dni }}</p>
      <p><strong>Rol:</strong> {{ authStore.rolActual }}</p>

      <!-- los permisos quedan ocultos hasta que el usuario pide verlos -->
      <button type="button" class="btn-secundario" @click="mostrarPermisos = !mostrarPermisos">
        {{ mostrarPermisos ? 'Ocultar permisos' : 'Mostrar permisos' }}
      </button>

      <ul v-if="mostrarPermisos" class="lista-permisos">
        <li v-for="permiso in authStore.funcionalidades" :key="permiso">{{ permiso }}</li>
        <li v-if="authStore.funcionalidades.length === 0" class="sin-permisos">
          Este rol no tiene permisos asignados.
        </li>
      </ul>
    </div>

    <!-- cambio de contraseña -->
    <div class="seccion cambio-password">
      <h2>Cambiar contraseña</h2>

      <form @submit.prevent="onCambiarPassword">
        <div class="campo">
          <label for="passwordActual">Contraseña actual</label>
          <input
            id="passwordActual"
            v-model="passwordActual"
            type="password"
            required
            autocomplete="current-password"
          />
        </div>

        <div class="campo">
          <label for="passwordNueva">Contraseña nueva</label>
          <input
            id="passwordNueva"
            v-model="passwordNueva"
            type="password"
            required
            minlength="6"
            autocomplete="new-password"
          />
        </div>

        <div class="campo">
          <label for="passwordConfirmar">Confirmar contraseña nueva</label>
          <input
            id="passwordConfirmar"
            v-model="passwordConfirmar"
            type="password"
            required
            minlength="6"
            autocomplete="new-password"
          />
        </div>

        <p v-if="error" class="mensaje mensaje-error">{{ error }}</p>
        <p v-if="exito" class="mensaje mensaje-exito">{{ exito }}</p>

        <button type="submit" class="btn-primario" :disabled="cargando">
          {{ cargando ? 'Guardando...' : 'Cambiar contraseña' }}
        </button>
      </form>
    </div>

    <!-- si no es un cambio obligatorio, dejamos volver al dashboard -->
    <button
      v-if="!authStore.requiereCambioPassword"
      type="button"
      class="btn-volver"
      @click="router.push('/')"
    >
      Volver al panel
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const mostrarPermisos = ref(false)

const passwordActual = ref('')
const passwordNueva = ref('')
const passwordConfirmar = ref('')
const error = ref('')
const exito = ref('')
const cargando = ref(false)

async function onCambiarPassword() {
  error.value = ''
  exito.value = ''

  if (passwordNueva.value !== passwordConfirmar.value) {
    error.value = 'La nueva contraseña y su confirmación no coinciden.'
    return
  }

  cargando.value = true
  const resultado = await authStore.cambiarPassword(passwordActual.value, passwordNueva.value)
  cargando.value = false

  if (!resultado.success) {
    error.value = resultado.message
    return
  }

  exito.value = 'Contraseña actualizada con éxito.'
  passwordActual.value = ''
  passwordNueva.value = ''
  passwordConfirmar.value = ''

  // Si el cambio era obligatorio (primer ingreso), ya se levantó la
  // bandera requiereCambioPassword en el store: lo mandamos al dashboard.
  setTimeout(() => {
    router.push('/')
  }, 1200)
}
</script>

<style scoped>
.perfil {
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
}

h1 {
  font-size: 1.5rem;
}

h2 {
  font-size: 1.1rem;
  margin-bottom: 10px;
}

.aviso-primer-ingreso {
  background: #fff3cd;
  border: 1px solid #ffc107;
  color: #856404;
  padding: 12px 15px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.seccion {
  padding: 15px 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  border: 1px solid #dee2e6;
}

.seccion p {
  margin: 5px 0;
}

.lista-permisos {
  margin-top: 10px;
  padding-left: 20px;
}

.sin-permisos {
  list-style: none;
  padding-left: 0;
  color: #6c757d;
}

.campo {
  margin-bottom: 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.campo label {
  font-size: 0.9rem;
  font-weight: bold;
}

.campo input {
  padding: 8px 10px;
  border: 1px solid #ced4da;
  border-radius: 5px;
  font-size: 1rem;
}

.mensaje {
  margin: 10px 0;
  font-size: 0.9rem;
}

.mensaje-error {
  color: #dc3545;
}

.mensaje-exito {
  color: #28a745;
}

button {
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primario {
  background: #4CAF50;
  color: #fff;
  width: 100%;
}

.btn-primario:hover:not(:disabled) {
  background: #45a049;
}

.btn-secundario {
  background: #e9ecef;
  color: #212529;
  margin-top: 8px;
}

.btn-secundario:hover {
  background: #dee2e6;
}

.btn-volver {
  background: transparent;
  color: #6c757d;
  border: 1px solid #6c757d;
}

.btn-volver:hover {
  background: #6c757d;
  color: #fff;
}
</style>
