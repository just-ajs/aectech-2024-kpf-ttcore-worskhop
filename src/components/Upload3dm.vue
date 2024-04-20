<template>
  <div class="button">
    <label for='upload3dm' class='customUpload'
        title="Upload a .3dm model"> upload 3dm 
      </label>
    <input type="file" accept=".3dm" id="upload3dm" @change="uploadFile" hidden />
    <span id="3dm-chosen" class="fileText">{{selectedFileName}}</span>
  </div>
</template>
  
<script setup>
import { ref } from 'vue';
import { base64ByteArray } from "@/scripts/compute.js";

let uploadDoc = ref(null);

const emits = defineEmits(['encoded3dm']);

const selectedFile = ref(null);

const selectedFileName = ref("");


const uploadFile = async (event) => {
  selectedFile.value = event.target.files[0];
  if (!selectedFile.value) {
    return;
  }else{
    console.log(selectedFile.value);
  }


  // get file
  let  file = selectedFile.value
  selectedFileName.value = file.name;

  // try to open 3dm file
  const buffer3dm = await file.arrayBuffer()
  const arr = new Uint8Array(buffer3dm)
  const b64ba = base64ByteArray(arr)

  uploadDoc.value = b64ba

  emits('encoded3dm', uploadDoc.value);
  console.log('emit')
  // selectedFile.value = null;

}
</script>
  
<style scoped>
  .customUpload {
    background-color:  rgba(241, 152, 88, 0.909);
    height: 15px;
    width: 275px;
  }

</style>