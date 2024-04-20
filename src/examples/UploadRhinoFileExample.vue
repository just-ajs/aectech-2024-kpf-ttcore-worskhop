<template>

  <div id="sidebar">
    <Upload3dm @encoded3dm="update3dmData"/>
  </div>

  <div id="viewer">
    <GeometryView :data="inputs" :path="path"></GeometryView>
  </div>
</template>

<script setup>
import { ref, onBeforeMount, computed } from "vue"
import GeometryView from "../components/MinimalisticGeometryView.vue"
import Upload3dm from "../components/Upload3dm.vue"

//define path to grasshopper script
import def from "../assets/rhino_input.gh"
const path = def

//define input names and values
let encodedFile = ref(null)

//define inputs
let inputs = ref({
  ["encodedFile"]: encodedFile.value, 
});

function updateValue(newValue, parameterName) {
  // Iterate over the inputs array
  for (const [key, value] of Object.entries(inputs.value)) {
    if (key == parameterName){
        inputs.value[key] = newValue
        console.log(parameterName + ':' + newValue)
    }
  }
}

function update3dmData(newData) {
    console.log('here', inputs)
  inputs.value.encodedFile = newData
}

</script>

<style scoped>

#sidebar {
  width: 310px;
  padding: 20px;
  flex-shrink: 0; 
}

#viewer { 
  width: 100%;
  margin: 20px
}

</style>