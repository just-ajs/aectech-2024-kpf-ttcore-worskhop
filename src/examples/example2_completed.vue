<template>

    <div id="sidebar">
      <Slider :title="heightSliderName" 
      :min="1" max="20" :step="1" :val="heightSliderValue" 
      @update="updateValue"></Slider>

      <Slider 
      :title="widthSliderName" 
      :min="1" max="30" :step="1" :val="widthSliderValue" @update="updateValue"></Slider>
      
      <Slider :title="verticalRotationSliderName" 
      :min="0" max="30" :step="1" :val="verticalRotationValue" @update="updateValue"></Slider>

      <Slider :title="horizontalRotationSliderName" 
      :min="0" max="15" :step="1" :val="horizontalRotationValue" @update="updateValue"></Slider>

      <Dropdown :title="shapeDropDownName"
      :options="dropdownOptions" :val="shapeIndex" @update="updateValue"></Dropdown>

      <MetadataTextBox :metadata="metadata"></MetadataTextBox>
    
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
  const heightSliderName = ref("Height")
  const heightSliderValue = ref(16)
  
  const widthSliderName = ref("Width")
  const widthSliderValue = ref(29)
  
  const verticalRotationSliderName = ref("VerticalRotation")
  const verticalRotationValue = ref(12)

  const horizontalRotationSliderName = ref("HorizontalRotation")
  const horizontalRotationValue = ref(4)

  const shapeDropDownName = ref("Shape")
  const shapeIndex = ref(0)
  const dropdownOptions = ref([
    {label: "Standard", value: 0},
    {label: "Concave", value: 1},
    {label: "Convex", value: 2}
  ])

  let metadata = ref([])


  
  //define inputs
  let inputs = ref({
    [heightSliderName.value]: heightSliderValue.value ,
    [widthSliderName.value] : widthSliderValue.value ,
    [verticalRotationSliderName.value] : verticalRotationValue.value,
    [horizontalRotationSliderName.value] : horizontalRotationValue.value,
    [shapeDropDownName.value] : shapeIndex.value
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
    width: 350px;
    padding: 20px;
    flex-shrink: 0; 
  }
  
  #viewer { 
    width: 500px
  }
  
  </style>