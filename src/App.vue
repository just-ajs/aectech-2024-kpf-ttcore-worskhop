<script setup>
import Slider from './components/Slider.vue'
</script>

<template>
  <div id="content">
    <div id="sidebar">
      <h2>Things</h2>
      <button>ui example</button>
      <Slider title="Inputtitle" :min="0" :max="50" :step="2"></Slider>
    </div>

    <div id="viewer">
    </div>
  </div>
</template>

<script setup>


</script>

<style scoped>
#content {
  display: flex;
  flex-direction: row;
  height: calc(100vh - 68px);
}

#sidebar {
  width: 310px;
  padding: 10px;
  flex-shrink: 0; 
}

#viewer {
  flex-grow: 1; 
}
</style>
