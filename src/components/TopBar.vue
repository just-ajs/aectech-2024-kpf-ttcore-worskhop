<template>
  <div id="top-bar">
    <div id="title-container">
      <img class="logo-image" alt="Iaac logo" src="../assets/graphics/AECtech_24_Barcelona-Banner_sm.png" />
      <h2>My nice app</h2>
      <div id="navigation-tabs">
        <div :class="{ 'selected-tab': selectedExample === 0, 'navigation-tab': selectedExample !== 0 }" @click="toggleExample(0)">Example 1</div>
        <div :class="{ 'selected-tab': selectedExample === 1, 'navigation-tab': selectedExample !== 1 }" @click="toggleExample(1)">Example 2</div>
      </div>
      <Toggle></Toggle>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Toggle from "./Toggle.vue"

const props = defineProps(["selectedExample"]);
let selectedExample = ref(props.selectedExample)

function toggleExample(exampleNum) {
  selectedExample.value = exampleNum
  emitSelectedExampleChange()
}

const emits = defineEmits(['selectedExampleChange'])
function emitSelectedExampleChange(){
  console.log('here')
  emits("selectedExampleChange", selectedExample.value)
}
</script>

<style scoped>
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

#navigation-tabs {
  display: flex;
  margin-left: 20px
}

.navigation-tab {
  color: #007bff; 
  cursor: pointer;
  text-decoration: underline; 
  margin-right: 20px
}

.navigation-tab:hover {
  text-decoration: none; 
}

.selected-tab {
  font-weight: bold; 
  color: #000; 
  border-bottom: 2px solid #007bff; 
  margin-right: 20px
}
</style>
