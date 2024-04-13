<template>

  <div id="sidebar">
    <Slider :title="radiusSliderName" :min="1" max="100" :step="1" :val="radiusSliderValue" @update="updateValue"></Slider>
    <Slider :title="divisionsVertSliderName" :min="1" max="30" :step="1" :val="divisionsVertValue" @update="updateValue"></Slider>
    <Slider :title="horzDivisionWidthSliderName" :min="1" max="10" :step="1" :val="horzDivisionWidthValue" @update="updateValue"></Slider>
    <Toggle :title="makeSpikeyToggleName" :val="makeSpikeyToggleValue" @update="updateValue"></Toggle>
  </div>

  <div id="viewer">
    <GeometryView :data="inputs" :path="path"></GeometryView>
  </div>
</template>

<script setup>
import { ref, onBeforeMount, computed } from "vue"
import GeometryView from "../components/GeometryView.vue"
import Slider from '../components/Slider.vue'
import Toggle from "../components/Toggle.vue"

//define path to grasshopper script
import def from "../assets/disco.gh"
const path = def

//define input names and values
const radiusSliderName = ref("radius")
const radiusSliderValue = ref(50)

const divisionsVertSliderName = ref("divisionsVert")
const divisionsVertValue = ref(20)

const horzDivisionWidthSliderName = ref("horzDivisionWidth")
const horzDivisionWidthValue = ref(4)

const makeSpikeyToggleName = ref("makeSpikey")
const makeSpikeyToggleValue = ref(false)

//define inputs
let inputs = ref({
  [radiusSliderName.value]: radiusSliderValue.value ,
  [divisionsVertSliderName.value] : divisionsVertValue.value ,
  [horzDivisionWidthSliderName.value] : horzDivisionWidthValue.value,
  [makeSpikeyToggleName.value] : makeSpikeyToggleValue.value
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