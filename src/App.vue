<template>
  <div id="app">
    <HeaderComponent />
    <main>
      <RouterView />
    </main>
    <FooterComponent />
  </div>
</template>

<script>
import { RouterView } from 'vue-router'
import HeaderComponent from './components/HeaderComponent.vue'
import FooterComponent from './components/FooterComponent.vue'

export default {
  name: 'App',
  components: {
    RouterView,
    HeaderComponent,
    FooterComponent,
  },
}
</script>

<style>
body,
html {
  margin: 0;
  padding: 0;
  height: 100%;
  overflow-x: hidden;
}

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  font-family: 'Arial', sans-serif;
  background-color: #f4f4f4;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
}

main {
  flex: 1;
  padding: 20px;
  width: 100%;
  box-sizing: border-box;
}
</style>
