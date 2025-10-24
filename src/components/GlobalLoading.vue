<template>
  <div class="relative w-full h-[400px] flex items-center justify-center">
    <div class="spinner" aria-label="Carregando" />
  </div>
</template>

<style scoped>
.spinner {
  width: 50px;
  height: 50px;
  border: 6px solid #d1e7dd;
  border-top-color: #42916e;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
