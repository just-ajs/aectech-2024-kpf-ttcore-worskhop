<template>
  <div >
    <div class="spinner"></div>
  </div>
</template>


<style scoped>

.spinner {
  border: 6px solid #ffffff;
  border-top: 5px solid #f2dd1c;
  border-radius: 50%;
  width: 70px;
  height: 70px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>