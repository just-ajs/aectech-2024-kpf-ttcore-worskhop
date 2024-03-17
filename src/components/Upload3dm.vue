<template>    
  <div>
    <input
      type="file"
      ref="fileInput"
      hidden accept=".3dm"
      @change="handleFileUpload"
    />
    <!-- The upload button -->
    <button @click="triggerFileInput">Upload 3dm File</button>
    <span id="3dm-chosen" class="fileText">{{selectedFileName}}</span>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { base64ByteArray } from "@/scripts/compute.js";

const props = defineProps(["title", 'name']);

const emits = defineEmits(['encoded3dm']);

const name = ref(props.name)
const selectedFileName = ref(null);
const fileInput = ref(null);

const triggerFileInput = () => {
  fileInput.value.click();
};

const handleFileUpload = async (event) => {
  const file = fileInput.value.files[0];
  if (!file) return;

  //Assign File Name
  selectedFileName.value = file.name

  //Open and covert file to encoded file format
  const buffer3dm = await file.arrayBuffer()
  const arr = new Uint8Array(buffer3dm)
  const b64ba = base64ByteArray(arr)

  // Process the file here. For example, emit an event with the file
  emits('encoded3dm', b64ba, name.value);
};
</script>

<style scoped>
.customUpload {
  background-color: black;
}
.fileText {
  color: black; /* Change text color to black */
  font-family:'Arial Narrow', Arial, sans-serif
}

</style>