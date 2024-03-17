<script setup>
import { ref } from "vue";
// Define properties that you will be able to access from parent component. 
// Those properties will be binded from parent to child. 
// Available JavaScript types: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures
const props = defineProps(['title', 'min', 'max', 'step', 'val'])

const title = ref(props.title)

// Define events that will be accessible from parent component
const emits = defineEmits(['update'])

var sliderValue = ref(props.val)  

function emitValueUpdate()
{
  emits("update", sliderValue.value, title.value)
}


</script>

<template>
<div>
	<form class="definition-input">
    <label class="input-title" for="range-slider">{{ title }}: {{ sliderValue }}</label>

    <input type="range" class="modern-range"
      :min="min" 
      :max="max" 
      :step="step"
      v-model="sliderValue" 
      @mouseup="emitValueUpdate"
    />
      
	</form>
</div>


</template>

<style scoped>
.modern-range {
  -webkit-appearance: none;
  width: 100%;
  background: linear-gradient(90deg, #fce1e9, #eb7e48);
  height: 17px;
  border-radius: 15px;
  margin: 10px 0px;
}

.modern-range::-webkit-slider-thumb {
  -webkit-appearance: none;
  height: 15px;
  width: 15px;
  border-radius: 15px;
  background-color: white;
  cursor: pointer;
}
</style>