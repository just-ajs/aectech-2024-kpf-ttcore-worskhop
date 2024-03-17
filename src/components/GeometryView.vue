<template>
  <div id="viewport">
    <!-- To this element we will append our 3d scene. -->
    <div id="threejs-container"></div>
    
  </div>
</template>

<script setup>
// Imports;
import { onMounted, onUpdated, watch } from 'vue'
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { Rhino3dmLoader } from "three/addons/loaders/3DMLoader.js"
import { runCompute } from "@/scripts/compute.js"
import { loadRhino } from "@/scripts/compute.js";


const loader = new Rhino3dmLoader()
loader.setLibraryPath('https://cdn.jsdelivr.net/npm/rhino3dm@8.0.0-beta2/')


const props = defineProps(["data", "path", "runCompute"]);
const emits = defineEmits(["updateMetadata"]);  


watch(() => props.runCompute, (newValue) => {
  if (newValue) {
    compute();
  }
})


// Three js objects
let renderer, camera, scene,  controls, container


function init() {
  // https://threejs.org/docs/#api/en/renderers/WebGLRenderer
  // This object will render our scene
  renderer = new THREE.WebGLRenderer()

  container = document.getElementById("threejs-container")

  // Rendered needs to know what's the size of the scene. 
  renderer.setSize(container.offsetWidth, container.offsetHeight)

  // We are taking element defined in <template> and appending our render to it. 
  container.appendChild(renderer.domElement)

  // https://threejs.org/docs/#api/en/cameras/PerspectiveCamera
  camera = new THREE.PerspectiveCamera(75, container.offsetWidth / container.offsetHeight, 0.1, 1000)
  camera.position.set(0, 0, 40)

  // https://threejs.org/docs/?q=scene#api/en/scenes/Scene
  scene = new THREE.Scene()
  scene.background = new THREE.Color("#f5f6fa")

  // orbit controls
  controls = new OrbitControls(camera, renderer.domElement)

  // add some ambient light here
  const ambientlight = new THREE.AmbientLight(0xffffff, 1)
  ambientlight.position.set(0, 0, 0)
  scene.add(ambientlight)

  const directionalLight = new THREE.DirectionalLight(0xffffff, 3)
  directionalLight.position.set(0, 1, 0)
  scene.add(directionalLight)


  // add fun shape
  animate()
}


// this function runs Compute
async function compute() {
  console.log("Runnning compute... \ndata sent: ", props.data)
  const doc = await runCompute(props.data, props.path)

  if (doc.metadata) {
    emits("updateMetadata", doc.metadata);
  }

  // clear objects from scene
  let objectsToRemove = []
  scene.children.forEach(child => {
    if (!child.isLight) {
      objectsToRemove.push(child)
    }
  })
  objectsToRemove.forEach(object => {
    scene.remove(object)
  })


  const buffer = new Uint8Array(doc.toByteArray()).buffer;
  loader.parse(buffer, function (object) {
    ///////////////////////////////////////////////////////////////////////
    // add object graph from rhino model to three.js scene
    object.traverse((child) => {

      if (child.isLine) {
          
        if (child.userData.attributes.userStrings!= undefined && child.userData.attributes.userStrings.length > 0) {
          //get color from userStrings
          const colorData = child.userData.attributes.userStrings[0]
          const col = colorData[1]

          //convert color from userstring to THREE color and assign it
          const threeColor = new THREE.Color("rgb(" + col + ")")
          const mat = new THREE.LineBasicMaterial({ color: threeColor })
          child.material = mat
        }
      }
    })

    scene.add(object)

    // zoom to extents
    for (let child of scene.children) {
      if (child.type == "Object3D") {
        zoomCameraToSelection(camera, controls, child.children)

      }
    }
    console.log("Compute done")
  });
}



// for controls update
function animate() {
  // https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame
  // native Javascript function that tells your browser you are animating!
  requestAnimationFrame(animate);
  controls.update();


  renderer.render(scene, camera);
}

// This will be run whenever the window is resized
window.addEventListener("resize", onWindowResize);
function onWindowResize() {

  const height = container.offsetHeight
  const width = container.offsetWidth

  camera.aspect = width/ height
  camera.updateProjectionMatrix();


  renderer.setSize(width, height)

}

/**
 * Helper function that behaves like rhino's "zoom to selection", but for three.js!
 */
function zoomCameraToSelection(camera, controls, selection, fitOffset = 1.1) {

  const box = new THREE.Box3();

  for (const object of selection) {
    if (object.isLight) continue
    box.expandByObject(object);
  }

  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());

  const maxSize = Math.max(size.x, size.y, size.z);
  const fitHeightDistance = maxSize / (2 * Math.atan(Math.PI * camera.fov / 360));
  const fitWidthDistance = fitHeightDistance / camera.aspect;
  const distance = fitOffset * Math.max(fitHeightDistance, fitWidthDistance);

  const direction = controls.target.clone()
    .sub(camera.position)
    .normalize()
    .multiplyScalar(distance);
  controls.maxDistance = distance * 10;
  controls.target.copy(center);

  camera.near = distance / 100;
  camera.far = distance * 100;
  camera.updateProjectionMatrix();
  camera.position.copy(controls.target).sub(direction);

  controls.update();

}



// This will be run whenever this component is instantiated
onMounted(async() => {
  init()
  await loadRhino()
  // compute();
})


</script>

<style scoped>


#viewport {

  height: 100%;
  width: 100%;
  min-width: 200px;
  position:inherit;
}

#threejs-container {
  height: 100%;
  width: 100%;
  min-width: 200px;
  position:inherit;
}

</style>