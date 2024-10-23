<template>

    <div id="sidebar">

      
    </div>
  
    <div id="viewer">
      <GeometryView :data="inputs" :path="path" @updateMetadata="receiveMetadata"></GeometryView>
    </div>

</template>
  
<script setup>
  import { ref, onBeforeMount, computed } from "vue"
  import GeometryView from "../components/MinimalisticGeometryView.vue"
  import Slider from '../components/Slider.vue'
  import Dropdown from "../components/Dropdown.vue"
  import MetadataTextBox from "@/components/MetadataTextBox.vue"
  
  //define path to grasshopper script
  import def from "../assets/wall.gh"
  const path = def

  //define input names and values
 
  //define inputs to be sent to Geometry View (and compute)
   let inputs = ref({

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

  function receiveMetadata(newValue) {
    console.log(newValue)
    metadata.value = newValue
  }
  
  </script>
  
  <style scoped>
  
  #sidebar {
    width: 310px;
    padding: 10px;
    flex-shrink: 0; 
  }
  
  #viewer { 
    width: 500px
  }
  
  </style>