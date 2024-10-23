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

import texturePath from "../assets/graphics/brick_texture.jpg"


const loader = new Rhino3dmLoader()
loader.setLibraryPath('https://cdn.jsdelivr.net/npm/rhino3dm@8.0.0-beta2/')


const props = defineProps(["data", "path", "runCompute"]);
const emits = defineEmits(["updateMetadata"]);


watch(() => props.data, (newValue) => {
    console.log(props.data)
    if (newValue) {
        compute();
    }
}, { deep: true })


// Three js objects
let renderer, camera, scene, controls, container
let mirrorMaterial, blackMaterial, texture


const widthRatio = 0.7;
const heightRatio = 0.85;
let width = window.innerWidth * widthRatio;
let heigh = window.innerHeight * heightRatio;
const frustumSize = 40;
const aspectRatio = width / heigh;



function init() {

    window.addEventListener("resize", onWindowResize, false);
    // rendeder
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, heigh);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.getElementById("threejs-container").appendChild(renderer.domElement);

    // camera
      // Set up camera - https://threejs.org/docs/#api/en/cameras/PerspectiveCamera
    camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 1000 );
	camera.position.set(50, 50, 20)
    camera.lookAt(0,0,0)
    camera.up.set(0, 0, 1)


    // scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color("rgb(222, 231, 243)");


    // orbit controls
    controls = new OrbitControls(camera, renderer.domElement);

    let lightX = 20;
    let lightY = 50;
    let lightZ = 50;

    // create a spotlight with shadow camera parameters
    const hemiLight = new THREE.HemisphereLight( 0xffffff, 0x8d8d8d, 1.5 );
    hemiLight.position.set( lightX, lightY,lightZ );
    scene.add( hemiLight );


    let dirLightX = 20;
    let dirLightY= 50;
    let dirLightZ = 50;
    const dirLight = new THREE.DirectionalLight( 0xFFDB83, 6 );
    dirLight.position.set(dirLightX, dirLightY, dirLightZ);
    dirLight.lookAt(0, 0, 15)
    dirLight.castShadow = true;
    dirLight.shadow.camera.left = -35;
    dirLight.shadow.camera.right = 35; 
    dirLight.shadow.camera.top = 80;

    dirLight.shadow.camera.near = 0.1;
    dirLight.shadow.camera.far = 500;

    // Increase shadow map size for better quality
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;


    scene.add( dirLight );

    const material = new THREE.MeshBasicMaterial( { color: 0xffff00 } ); 

    const directLightgeometry = new THREE.SphereGeometry( 1,10,10); 
    const directLightSphere = new THREE.Mesh( directLightgeometry, material );
    directLightSphere.position.set(dirLightX, dirLightY, dirLightZ);
    scene.add(directLightSphere)


    // add shadow plane
    const plane = new THREE.Mesh(
        new THREE.PlaneGeometry(1000, 50),
        new THREE.ShadowMaterial( {
            color:  "rgb(194, 191, 194)",
            transparent: true,
            opacity: 0.5,
            side: THREE.DoubleSide,
        } ),
    );
    plane.receiveShadow = true;
     scene.add( plane );

    texture = new THREE.TextureLoader().load(texturePath, function() {
    console.log('Texture loaded successfully');
    }, undefined, function(err) {
        console.error('Error loading texture:', err);
    });
    THREE.Object3D.DEFAULT_UP.set(0, 0, 1);
    animate();
}


// this function runs Compute
async function compute() {
    console.log("Runnning compute... \ndata sent: ", props.data)
    const doc = await runCompute(props.data, props.path)

    if (doc.metadata) {
        emits("updateMetadata", doc.metadata);
    }

    // clear objects from scene
    scene.traverse((child) => {
        if (!child.isLight && child.isCompute) {
        scene.remove(child);
        }
    });


    // add object graph from rhino model to three.js scene
    const buffer = new Uint8Array(doc.toByteArray()).buffer;
    loader.parse(buffer, function (object) {
        
        object.isCompute = true;
        object.castShadow = true;
        object.traverse((child) => {
            if (child.isMesh) {


                child.castShadow = true;
                child.receiveShadow = true;
                // Create a material with the texture
                const material = new THREE.MeshStandardMaterial({
                    map: texture,
                    side: THREE.DoubleSide
                });


                // Apply the material to the child
                child.material = material;
            }
        })

        scene.add(object)
        console.log("Compute done")
    });
}



// for controls update
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

// This will be run whenever the window is resized
window.addEventListener("resize", onWindowResize);
function onWindowResize() {

    camera.aspect =
    (window.innerWidth * widthRatio) / (window.innerHeight * heightRatio);
  camera.updateProjectionMatrix();

  renderer.setSize(
    window.innerWidth * widthRatio,
    window.innerHeight * heightRatio
  );
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
onMounted(async () => {
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
    position: inherit;
}

#threejs-container {
    height: 100%;
    width: 100%;
    min-width: 200px;
    position: inherit;
}
</style>