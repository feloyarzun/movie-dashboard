<template>
  <header class="navbar">
    <nav>
      <div class="logo">🎬 Movies</div>
      <div class="nav-links">
        <RouterLink to="/" class="nav-link">Home</RouterLink>
      </div>
    </nav>
  </header>
</template>

<script>
import { RouterLink } from 'vue-router'

export default {
  name: 'HeaderComponent',
  components: {
    RouterLink,
  },
}
</script>

<style scoped>
.navbar {
  background: linear-gradient(
    to right,
    #0a0a0a,
    #1c1c1c,
    #2c2c2c,
    #3c3c3c,
    #4c4c4c,
    #5c5c5c,
    #6c6c6c
  );
  color: white;
  padding: 15px 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
}

.nav-links {
  display: flex;
  gap: 20px;
}

.nav-link {
  color: white;
  text-decoration: none;
  transition: color 0.3s ease;
}

.nav-link:hover {
  color: #ddd;
}
</style>
