<template>
  <div id="app">
    <button class="compute-button"
    @mousedown="onButtonClick(true)"
    @mouseup="onButtonClick(false)"
    >{{ titlec }}</button>
  </div>
</template>

<script setup>
import { ref } from "vue";

const emits = defineEmits(["toggleCompute"]);

const props = defineProps(["title"]);
const titlec = ref(props.title);
const isActive = ref(false);


async function onButtonClick(state) {
  isActive.value = state
  emits("toggleCompute", isActive.value );
}
</script>

<style scoped>

button, .customUpload {
  width: 100%;
  font-family: 'Roboto Mono', monospace;
  background-color: var(--blue);
  border: #1897ff;
  color: white;
  font-weight: bold;
  padding: 10px 15px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
  border-radius: 10px;
  transition: all 0.1s ease-in-out;
  
}
  
  
  button:hover,  .customUpload:hover {
    background-color: #007ffd;
    box-shadow: 3px 3px rgb(46, 46, 46);
  }

</style>