<template>
  <div class="login-container">
    <h2>Proyecto Kairo - Login</h2>
    <form @submit.prevent="entrarTradicional">
      
      <div class="form-group">
        <input 
          type="text" 
          v-model="credentials.nombre" 
          placeholder="Nombre" 
          required 
        />
      </div>

      <div class="form-group">
        <input 
          type="text" 
          v-model="credentials.apellido" 
          placeholder="Apellido" 
          required 
        />
      </div>

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
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

// Ajustamos la estructura de las credenciales a tu tabla Trabajador
const credentials = ref({ 
  nombre: '', 
  apellido: '', 
  password: '' 
});

const entrarTradicional = async () => {
  // Mandamos el objeto con nombre, apellido y password
  const resultado = await authStore.loginConContrasena(credentials.value);
  
  if (resultado.success) {
    router.push('/'); // El guard lo procesa y te deja pasar al Dashboard
  } else {
    alert(resultado.message || 'Error al iniciar sesión');
  }
};
</script>

