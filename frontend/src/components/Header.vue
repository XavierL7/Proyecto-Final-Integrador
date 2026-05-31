<template>
  <header class="header">
    <div class="nav-container">
      <div class="logo" @click="goHome">
        <img src="/src/assets/logo.png" alt="Logo de la marca" class="logo-img">
        <span class="logo-text">{{ siteName }}</span>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: 'Header',
  props: {
    siteName: {
      type: String
    }
  },
  methods: {
    goHome() {
      this.currentView = 'inicio'
      this.$emit('view-change', 'inicio')
    }
  }
}
</script>

<style scoped>
.header {
  background-color: #064469;

}

.nav-container {
  max-width: 1200px;
  margin: 0 10px;
  padding: 0.1rem 0.1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
}

.logo {
  display: flex;
  align-items: center;
  cursor: pointer;
  text-decoration: none;
}

.logo-img {
  height: 100px;
  width: auto;
}

.logo-text {
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
}

@media (max-width: 768px) {
  .nav-container {
    flex-direction: column;
    gap: 1rem;
  }
  
  .logo-text {
    font-size: 1.2rem;
  }
  
  .logo-img {
    height: 40px;
  }
}
</style>