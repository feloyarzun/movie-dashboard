<template>
  <footer class="footer">
    <div class="footer-content">
      <p>© 2024 Made by Felipe Oyarzun</p>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'FooterComponent',
}
</script>

<style scoped>
.footer {
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
  text-align: center;
  padding: 15px 20px;
  width: 100%;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  font-size: 0.9rem;
}
</style>
