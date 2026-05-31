<template>
  <div id="app">
    <Header :site-name="siteName" />
    <main class="main-content">
      <div class="hero">
        <h1>{{ siteName }}</h1>
        <p>{{ description }}</p>
        <p class="status">Estado del servidor: 
          <span :class="serverStatus ? 'online' : 'offline'">
            {{ serverStatus ? 'Conectado' : 'Desconectado' }}
          </span>
        </p>
      </div>
    </main>
  </div>
</template>

<script>
import Header from './components/Header.vue'
import axios from 'axios'

export default {
  name: 'App',
  components: {
    Header
  },
  data() {
    return {
      siteName: 'Mi Marca',
      description: 'Aplicación desarrollada con Vue 3 y Express',
      serverStatus: false
    }
  },
  mounted() {
    this.checkServerStatus()
  },
  methods: {
    async checkServerStatus() {
      try {
        const response = await axios.get('/api/info')
        this.siteName = response.data.name
        this.description = response.data.description
        this.serverStatus = true
      } catch (error) {
        console.error('Error conectando al servidor:', error)
        this.serverStatus = false
      }
    }
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #d0d7e1 ;
  min-height: 100vh;
}

.main-content {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 2rem;
}

.hero {
  background: white;
  border-radius: 20px;
  padding: 3rem;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
}

.hero h1 {
  font-size: 5.5rem;
  color: #333;
  margin-bottom: 1rem;
}

.hero p {
  color: #666;
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.status {
  margin-top: 1rem;
  font-weight: 500;
}

.online {
  color: #10b981;
}

.offline {
  color: #ef4444;
}

@media (max-width: 768px) {
  .hero h1 {
    font-size: 1.8rem;
  }
}
</style>