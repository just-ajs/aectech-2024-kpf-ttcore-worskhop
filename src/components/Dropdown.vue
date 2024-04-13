<script setup>
import { ref } from "vue";

// Define props coming from parent component
const props = defineProps(["title", "options"]);

const title = ref(props.title)

// Define events that will be accessible from parent component
const emits = defineEmits(["update"]);

// Value that is binded with selection option
var selectedOption = ref(0);

// Function called on change
function emitValueUpdate() {
  emits("update", selectedOption.value, title.value);
}
</script>

<template>
  <form class="definition-input">
    <label class="input-title">{{ title }} index: {{ selectedOption }} </label>

    <select
      v-model="selectedOption"
      class="dropdown"
      @change="emitValueUpdate"
>

      <option
        v-for="option in options"
        :key="option.label"
        :value="option.value"
      >
        {{ option.label }}
      </option>

     
    </select>
  </form>
</template>

<style scoped>
.dropdown {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background: var(--global-neumorphic-light) url('path_to_your_arrow_icon') no-repeat right 10px center; /* Adjust path_to_your_arrow_icon */
  border-radius: 340.074px;
  padding: 10px 35px 10px 15px; /* Adjust padding to make room for the arrow */
  border: none;
  width: 100%;
  height: 40px;
  color: var(--neumorphic-blue);
  font-size: medium;
  cursor: pointer;
  box-shadow: -1.417px -1.417px 8.492px 0px color(display-p3 0.9843 0.9882 0.9961),
              1.417px 1.417px 2.834px 0px color(display-p3 0.3451 0.4 0.5176 / 0.50);
}

.dropdown:hover, .dropdown:focus {
  color: black;
  box-shadow: -1.751px -1.751px 3.503px 0px color(display-p3 1 1 1 / 0.50) inset, 
              1.751px 1.751px 3.503px 0px color(display-p3 0.3451 0.4 0.5176 / 0.50) inset;
  border:none;
  outline: none;
}

/* Style adjustments for options */
.dropdown option {
  color: var(--neumorphic-blue);
  background: var(--global-neumorphic-background);
  border:none;
  box-shadow:none;
}
</style>
