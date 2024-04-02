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
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { runCompute } from "@/scripts/compute.js"
import { loadRhino } from "@/scripts/compute.js";

import context from "../assets/moonless_golf_1k.hdr"

const ghPath = '../assets/disco.gh'

const loader = new Rhino3dmLoader()
loader.setLibraryPath('https://cdn.jsdelivr.net/npm/rhino3dm@8.0.0-beta2/')


const props = defineProps(["data", "path", "runCompute"]);
const emits = defineEmits(["updateMetadata"]);  


watch(() => props.data, (newValue) => {
  console.log(props.data)
  if (newValue) {
    compute();
  }
}, {deep: true})


// Three js objects
let renderer, camera, scene,  controls, container, spotLight
let mirrorMaterial, blackMaterial
let spotLightRed, spotLightBlue, spotLightGreen, spotLightOrange


function init() {

  //Define container to put three.js scene in
  container = document.getElementById("threejs-container")

  // Set up renderer - https://threejs.org/docs/#api/en/renderers/WebGLRenderer
  renderer = new THREE.WebGLRenderer()
  renderer.setSize(container.offsetWidth, container.offsetHeight)
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.8

  // We are taking element defined in <template> and appending our render to it. 
  container.appendChild(renderer.domElement)

  // Set up camera - https://threejs.org/docs/#api/en/cameras/PerspectiveCamera
  camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 1000 );
	camera.position.set(500, -300, 0)
  camera.lookAt(0,0,0)

  // Create scene - https://threejs.org/docs/?q=scene#api/en/scenes/Scene
  scene = new THREE.Scene()
  scene.background = new THREE.Color("#f5f6fa")
  scene.rotation.y = 0.5;

  // orbit controls - https://threejs.org/docs/#examples/en/controls/OrbitControls
  controls = new OrbitControls(camera, renderer.domElement)

  // Ambient Light
  const ambientlight = new THREE.AmbientLight(0xffffff, 1)
  ambientlight.position.set(0, 0, 0)

  //Colored Spot Lights
  spotLightRed = new THREE.SpotLight( 0xff0040, 400 );
  spotLightRed.position.set( 100, 0, 0);
  scene.add( spotLightRed );

  spotLightBlue = new THREE.SpotLight( 0x0040ff, 400 );
  spotLightBlue.position.set( 0, 100, 0);
  scene.add( spotLightBlue );

  spotLightGreen = new THREE.SpotLight( 0x80ff80, 400 );
  spotLightGreen.position.set( -100, 0, 0);
  scene.add( spotLightGreen );

  spotLightOrange = new THREE.SpotLight( 0xffaa00, 400 );
  spotLightOrange.position.set( 0, -100, -100);
  scene.add( spotLightOrange );

  //Load 360 Image for background and envMap
  new RGBELoader().load(context, function (texture){
    texture.mapping = THREE.EquirectangularReflectionMapping;
    mirrorMaterial.envMap = texture
    scene.background = texture;
  })

  //Create Materials
  mirrorMaterial = new THREE.MeshStandardMaterial( {
    roughness: 0,
    metalness: 1,
    flatShading: false
  });

  blackMaterial = new THREE.MeshBasicMaterial( { color: 0x000000 } ); 

  //Add THREE.js GUI to modify material properties
  const gui = new GUI();
  gui.domElement.style.position = 'absolute';
  gui.domElement.style.top = '95px';
  gui.domElement.style.right = '20px'
  gui.add( mirrorMaterial, 'roughness', 0, 1 );
  gui.add( mirrorMaterial, 'metalness', 0, 1 );
  gui.add( renderer, 'toneMappingExposure', 0, 2 ).name( 'exposure' );

  //Rotate scene
  controls.autoRotate = true;

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



// for controls update
function animate() {
  // https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame
  // native Javascript function that tells your browser you are animating!
  requestAnimationFrame(animate);
  controls.update();

  //Rotate Lights
  const time = Date.now() * 0.001;
  spotLightRed.position.x = Math.sin( time * 0.7 ) * 100;
  spotLightRed.position.y = Math.cos( time * 0.5 ) * 100;
  spotLightRed.position.z = Math.cos( time * 0.3 ) * 100;

  spotLightBlue.position.x = Math.cos( time * 0.3 ) * 100;
  spotLightBlue.position.y = Math.sin( time * 0.5 ) * 100;
  spotLightBlue.position.z = Math.sin( time * 0.7 ) * 100;

  spotLightGreen.position.x = Math.sin( time * 0.7 ) * 100;
  spotLightGreen.position.y = Math.cos( time * 0.3 ) * 100;
  spotLightGreen.position.z = Math.sin( time * 0.5 ) * 100;

  spotLightOrange.position.x = Math.sin( time * 0.3 ) * 100;
  spotLightOrange.position.y = Math.cos( time * 0.7 ) * 100;
  spotLightOrange.position.z = Math.sin( time * 0.5 ) * 100;

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
  compute();
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