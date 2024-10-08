<template>
  <div id="top-bar">
    <div id="title-container">
      <div style="display: flex; align-items: center">
        <img class="logo-image" alt="AECtechLogo" src="../assets/graphics/AECtech-12.png" />
        <h2>Grasshopper on the Web</h2>
        <div id="navigation-tabs">
          <div :class="{ 'selected-tab': selectedExample === 0, 'navigation-tab': selectedExample !== 0 }" @click="toggleExample(0)">Example 0</div>
          <div :class="{ 'selected-tab': selectedExample === 1, 'navigation-tab': selectedExample !== 1 }" @click="toggleExample(1)">Example 1</div>
          <div :class="{ 'selected-tab': selectedExample === 2, 'navigation-tab': selectedExample !== 2 }" @click="toggleExample(2)">Example 2</div>
        </div>
      </div>
      <DarkModeToggle @update="changeMode" :title="'darkMode'" id="toggle" ></DarkModeToggle>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import DarkModeToggle from "./DarkModeToggle.vue"

const props = defineProps(["selectedExample"]);
let selectedExample = ref(props.selectedExample)

function toggleExample(exampleNum) {
  selectedExample.value = exampleNum
  emitSelectedExampleChange()
}

const emits = defineEmits(['selectedExampleChange'])
function emitSelectedExampleChange(){
  emits("selectedExampleChange", selectedExample.value)
}

function changeMode(value, title){
  if (value) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
  else {
    document.documentElement.setAttribute('data-theme', 'light');
  }  
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
  width: 100vw;
  justify-content: space-between 
}

#toggle {
  right: 0px
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
  color: var(--vt-c-text-light-2); 
  cursor: pointer;
  text-decoration: underline; 
  margin-right: 20px;
}

.navigation-tab:hover {
  text-decoration: none; 
}

.selected-tab {
  font-weight: bold; 
  color: var(--neumorphic-blue);
  border-bottom: 2px solid var(--neumorphic-blue);
  margin-right: 20px
}
</style>
