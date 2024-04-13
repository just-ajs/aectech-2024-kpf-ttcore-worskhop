<script setup>
import { ref } from "vue"

// Define props
const props = defineProps(['title', 'val'])

const title = ref(props.title)
// Define emits
const emits = defineEmits(['update'])

// Define variables with refs
var toggleValue = ref(props.val)

function emitValueUpdate()
{
  emits("update", toggleValue.value, title.value)
}
</script>


<template>
  <form class = "definition-input">
    <label class="input-title" for="toggle"> {{toggleValue ? 'Dark Mode' : 'Light Mode'}}</label>

    <div style="margin-top: -10px">
      <label class="switch" :for="title">
        <input type="checkbox" :id="title" 
          v-model="toggleValue" 
          v-on:change="emitValueUpdate"/>
        <div class="slider round"></div>
      </label>
    </div>
  </form>
</template>

<style scoped>
.definition-input {
  display: flex;
  align-items: center; /* Aligns items vertically center */
  gap: 0px; /* Adds some space between the label and the switch */
  flex-direction: column;
}

.switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 25px; /* Adjust height */
}

.switch input {
  display: none;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 50%;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--global-neumorphic-light);
  transition: .4s;
  border-radius: 50px;
  height: 25px; /* Match height */
  box-shadow: -1.417px -1.417px 8.492px 0px color(display-p3 0.9843 0.9882 0.9961),
	1.417px 1.417px 2.834px 0px color(display-p3 0.3451 0.4 0.5176 / 0.50);
}

.slider:before {
  position: absolute;
  content: "";
  height: 21px;
  width: 21px;
  left: 4px;
  bottom: 2px;
  background-color: var(--neumorphic-blue);
  transition: .4s;
  border-radius: 50%;
  box-shadow: -1.417px -1.417px 8.492px 0px color(display-p3 0.9843 0.9882 0.9961),
	1.417px 1.417px 2.834px 0px color(display-p3 0.3451 0.4 0.5176 / 0.50);
}

input:checked + .slider {
  background-color: black;
}

input:checked + .slider:before {
  -webkit-transform: translateX(26px);
  -ms-transform: translateX(26px);
  transform: translateX(26);
}

</style>
