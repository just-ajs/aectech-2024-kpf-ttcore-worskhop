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
    <label class="input-title" for="toggle"> {{ title }}: {{  toggleValue }}</label>

    <div class="checkbox-wrapper-22">
      <label class="switch" for="checkbox">
        <input type="checkbox" id="checkbox" 
          v-model="toggleValue" 
          v-on:change="emitValueUpdate"/>

        <div class="slider round"></div>
      </label>
    </div>
  </form>
</template>