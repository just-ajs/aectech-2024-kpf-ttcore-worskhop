<template>
  <div >
    <div class="spinner"></div>
  </div>
</template>


<style scoped>

.spinner {
  border: 6px solid rgba(255, 255, 255, 0.5); 
  border-top-color: var(--neumorphic-blue); 
  border-radius: 50%;
  width: 70px;
  height: 70px;
  animation: spin 1s linear infinite;
  box-shadow: inset -2px -2px 5px rgba(255, 255, 255, 0.7), 
              inset 2px 2px 5px rgba(0, 0, 0, 0.2),
              -3px -3px 7px rgba(255, 255, 255, 0.7), 
              3px 3px 7px rgba(0, 0, 0, 0.2); 
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