<script setup>
import Slider from './components/Slider.vue'
import Dropdown from './components/Dropdown.vue';

const dropdownOptions = [
  { label: "Blue", value: 0 },
  { label: "Pink", value: 1 },
  { label: "Orange", value: 2 }
];

import DiscoExample from "./examples/example1Disco.vue"

</script>

<template>


  <div id="top-bar">

    <div id="title-container">
      <img class="logo-image" alt="Iaac logo" src="./assets/graphics/AECtech_24_Barcelona-Banner_sm.png" />

      <h2>
        My nice app
      </h2>
    </div>
  </div>

  <div id="content">
    <div id="viewer">
      <div id="content">
        <DiscoExample></DiscoExample>
      </div>
    </div>
  </div>


</template>

<script setup>

</script>

<style scoped>
#content {
  display: flex;
  flex-direction: row;

  margin-top: 7cqi;
}

#sidebar {
  display: grid;
  width: 310px;
  padding: 10px;
  flex-shrink: 0;
}

#viewer {
  flex-grow: 1;
}

#top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 8px 15px -4px rgba(0, 0, 0, 0.2),
    0 -4px 6px -2px rgba(255, 255, 255, 0.7);
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  padding-bottom: 10px;
}

#title-container {
  display: flex;
  align-items: center;
  margin-right: 1.5rem;
}

.logo-image {
  height: 4rem;
  padding: 0.5rem;
}
</style>
