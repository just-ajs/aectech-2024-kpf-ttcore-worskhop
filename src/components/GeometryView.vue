<template>
  <div id="viewport">
    <!-- To this element we will append our 3d scene. -->
    <div id="threejs-container"></div>

  </div>
</template>

<script setup>
// Imports;
import { onMounted, onUpdated, watch, onUnmounted } from 'vue'
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { Rhino3dmLoader } from "three/addons/loaders/3DMLoader.js"
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { runCompute } from "@/scripts/compute.js"
import { loadRhino } from "@/scripts/compute.js";

import context from "../assets/dancing_hall_4k.hdr"

const ghPath = '../assets/disco.gh'

const loader = new Rhino3dmLoader()
loader.setLibraryPath('https://cdn.jsdelivr.net/npm/rhino3dm@8.0.0-beta2/')


const props = defineProps(["data", "path", "runCompute"]);
const emits = defineEmits(["updateMetadata"]);  


watch(() => props.data, (newValue) => {
  if (newValue) {
    compute();
  }
}, {deep: true})


// Three js objects
let renderer, camera, scene,  controls, container, gui
let mirrorMaterial, blackMaterial
let spotLight, lightHelper
let spotLight2, lightHelper2

function init() {

  //Define container to put three.js scene in
  container = document.getElementById("threejs-container")

  // Set up renderer - https://threejs.org/docs/#api/en/renderers/WebGLRenderer
  renderer = new THREE.WebGLRenderer()
  renderer.setSize(container.offsetWidth, container.offsetHeight)
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.6

  // We are taking element defined in <template> and appending our render to it. 
  container.appendChild(renderer.domElement)

  // Set up camera - https://threejs.org/docs/#api/en/cameras/PerspectiveCamera
  camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 1000 );
	camera.position.set(500, -300, 0)
  camera.lookAt(0,0,0)

  // Create scene - https://threejs.org/docs/?q=scene#api/en/scenes/Scene
  scene = new THREE.Scene()

  // orbit controls - https://threejs.org/docs/#examples/en/controls/OrbitControls
  controls = new OrbitControls(camera, renderer.domElement)

  // Ambient Light
  const ambientlight = new THREE.AmbientLight(0xffffff, 1)
  ambientlight.position.set(0, 0, 0)

  //Colored Spot Lights
  spotLight = new THREE.SpotLight( 0xff0000, 500 );
  spotLight.position.set(0, 100, 100 );
  spotLight.angle = Math.PI / 6;
  spotLight.penumbra = 1;
  spotLight.decay = 0;
  spotLight.distance = 500;
  scene.add( spotLight );
  lightHelper = new THREE.SpotLightHelper( spotLight );
	scene.add( lightHelper );

  //Create Materials
  mirrorMaterial = new THREE.MeshStandardMaterial( {
    roughness: 0,
    metalness: 1,
    envMapIntensity: 1 
  });
  blackMaterial = new THREE.MeshBasicMaterial( { color: 0x000000 } ); 

  //Load 360 Image for background and envMap
  new RGBELoader().load(context, function (texture) {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    mirrorMaterial.envMap = texture;
    scene.background = texture;
  });

  //Add THREE.js GUI to modify properties
  gui = new GUI();
  gui.domElement.style.position = 'absolute';
  gui.domElement.style.top = '95px';
  gui.domElement.style.right = '20px'

  //mirror material gui
  gui.add( mirrorMaterial, 'roughness', 0, 1 ).name('discoball roughness')
  gui.add( mirrorMaterial, 'metalness', 0, 1 ).name('discoball metalness')

  //ambient light gui
  gui.add( renderer, 'toneMappingExposure', 0, 2 ).name( 'ambient light' );

  //spotlight gui
  const lightColor = { color: spotLight.color.getHex() };
  gui.addColor(lightColor, 'color').name('spotlight color').onChange(function (value) {
    spotLight.color.setHex(value);
  });
  gui.add( spotLight,'intensity', 0, 500).name('spotlight intensity')
  gui.add( spotLight, 'distance', 0, 700).name('spotlight distance')
  gui.add( spotLight, 'angle', 0, Math.PI / 3).name('spotlight angle')

  //Animate
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
    if (!child.type.toLowerCase().includes("light")) {
      objectsToRemove.push(child)
    }
  })
  objectsToRemove.forEach(object => {
    scene.remove(object)
  })

  // add object graph from rhino model to three.js scene
  const buffer = new Uint8Array(doc.toByteArray()).buffer;
  loader.parse(buffer, function (object) {
    object.traverse((child) => {
      if (child.isMesh){
        if (child.userData.attributes.userStrings && child.userData.attributes.userStrings[0][1] == 'sphere'){
          child.material = blackMaterial
        }
        else {
          child.material = mirrorMaterial
          child.castShadow = true; 
          child.receiveShadow = true;
        }
      }
    })

    scene.add(object)
    console.log("Compute done")
  });
}

let angle = 0

// for controls update
function animate() {
  // https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame
  // native Javascript function that tells your browser you are animating!
  requestAnimationFrame(animate);
  controls.update();

  //Rotate Spotlight
  // const radius = 100; 
  // angle += 0.01;
  // spotLight.position.x = Math.sin(angle) * radius;
  // spotLight.position.z = Math.cos(angle) * radius;

  //Rotate Discoball - Y is up
  scene.traverse((child) => {
    if (child.isMesh) {
      child.rotation.y += 0.005; // Adjust the speed as needed
    }
  });

  if (lightHelper) lightHelper.update();
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

// This will be run whenever this component is instantiated
onMounted(async() => {
  init()
  await loadRhino()
  compute();
})

//remove three.js gui panel when the component is unmounted
onUnmounted(async() => {
  gui.destroy()
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
  #gui { position: absolute; top: 2px; left: 2px }

</style>