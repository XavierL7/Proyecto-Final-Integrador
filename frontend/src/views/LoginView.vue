<!--Login -->
<template>
  <div class="login-container">
    <h2>Proyecto Kairo - Login</h2>
    <form @submit.prevent="entrarTradicional">
      
      <!-- campo del login que pide que pongas un nombre requerido -->
      <div class="form-group">
        <input 
          type="text" 
          v-model="credentials.nombre" 
          placeholder="Nombre" 
          required 
        />
      </div>

      <!--campo del login que pide que pongas un apellido requerido -->
      <div class="form-group">
        <input 
          type="text" 
          v-model="credentials.apellido" 
          placeholder="Apellido" 
          required 
        />
      </div>

      <!-- campo del login que pide que pongas un dni requerido -->
      <div class="form-group">
        <input 
          type="number" 
          v-model="credentials.dni" 
          placeholder="DNI" 
          required 
        />
      </div>

     <!-- campo del login que pide que pongas una contrasea requerido -->
      <div class="form-group">
        <input 
          type="password" 
          v-model="credentials.password" 
          placeholder="Contraseña" 
          required 
        />
      </div>

      <button type="submit">Iniciar Sesión</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../stores/auth'; //autorizacion
import { useRouter } from 'vue-router'; //router

const authStore = useAuthStore(); //autorizacion de ponia
const router = useRouter(); //para acceder a otras rutas

const credentials = ref({  //credenciales del usuario que se usan en cont resultado =
  nombre: '', 
  apellido: '', 
  dni: '',    
  password: '' 
});

//fuuncion encargada de verificar que existis como usuario
const entrarTradicional = async () => {
  const resultado = await authStore.loginConContrasena(credentials.value); //resultado es = a la funcion loginConContrasena del auth.js en stores
  
  if (resultado.success) {
    router.push('/'); //si seinicio sesion te envia a / que es el dashboard
  } else {
    alert(resultado.message || 'Error al iniciar sesión');
  }
};
</script>