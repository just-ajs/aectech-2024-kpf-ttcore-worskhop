<template>

  <div id="sidePanel">
        
  </div>

  <div id="viewer">
    <GeometryView :data="computeData" :path="path"></GeometryView>
  </div>
</template>

<script setup>
import { ref, onBeforeMount, computed } from "vue"
import GeometryView from "./components/GeometryView.vue"

import def from "./assets/disco.gh"
const path = def

let data = ref({})

const computeData = computed(() => {
  data = {
    ["divisions"]: 20,
    ["width"]: 4
  };
  return data
})



</script>

<style scoped>

  #viewer{
    height: 100vh;
    width: calc(100vw - 200px);
  }
  #sidePanel{
    width: 200px;
    height: 100vh
  }

</style>