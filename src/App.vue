<script setup>
import { ref } from "vue"

import TopBar from "./components/TopBar.vue"
import Example0 from "./examples/example0.vue"
import Example1 from "./examples/example1.vue"
import Example2 from "./examples/example2.vue"
//import Example2 from "./examples/example2_completed.vue"
import Loading from "./components/Loading.vue"

//Import and define Store
import {useComputeStore} from "@/stores/computeStore.js"
const computeStore = useComputeStore()

const selectedExample = ref(0)

function toggleSelectedExample(exampleNum){
  selectedExample.value = exampleNum
}

</script>

<template>

  <TopBar :selectedExample="selectedExample" @selectedExampleChange="toggleSelectedExample"></TopBar>
  <div id="content">
    <Example0 v-if="selectedExample==0"></Example0>
    <Example1 v-if="selectedExample==1"></Example1>
    <Example2 v-if="selectedExample==2"></Example2>
  </div>
  <Loading class="loader-overlay" v-if="computeStore.computing"></Loading>
</template>

<style scoped>
#content {
  display: flex;
  flex-direction: row;
  height: calc(100vh - 75px);
  width: 100vw;
  margin-top: 75px;
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

#navigation-tabs {
  display: flex;
}

.navigation-tab {
  padding: 10px 20px; /* Adjust padding */
  margin-left: 10px; /* Add margin between tabs */
  color: #007bff; /* Change tab text color to blue */
  cursor: pointer;
  text-decoration: underline; /* Add underline */
}

.navigation-tab:hover {
  text-decoration: none; /* Remove underline on hover */
}

.selected-tab {
  font-weight: bold; /* Make text bold */
  color: #000; /* Change text color to black */
  border-bottom: 2px solid #007bff; /* Add bottom border */
}
.loader-overlay {
  position: fixed;
  top: 0;
  left: 0; 
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100000
}
</style>
