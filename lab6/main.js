
import * as THREE from 'three'; //1 first this
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader.js'; //1.1

const scene =  new THREE.Scene(); //2
scene.background = new THREE.Color(0xcccccc); //3

const aspect = window.innerWidth / window.innerHeight; // to use for the orthographic camera

const perspectiveCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100); //4
perspectiveCamera.position.set(2, 2, 10); //5
perspectiveCamera.lookAt(0, 0, 0); //6   at the center of the scene
scene.add(perspectiveCamera); //7


const size = 8
const orthographicCamera = new THREE.OrthographicCamera(
  -size * aspect, 
  size * aspect, 
  size, 
  -size, 
  0.1, 
  100
);
orthographicCamera.position.set(0 ,0, 10);
orthographicCamera.lookAt(0, 0, 0);

const cameras =[perspectiveCamera, orthographicCamera]
let currentCameraIndex = 0; // to keep track of the current camera
console.log("Active camera: Perspective "); // log the current camera index

addEventListener('keydown', (event) => {
  if(event.code === 'Space') {
    event.preventDefault(); 
    currentCameraIndex = currentCameraIndex +1;
    if(currentCameraIndex >= cameras.length) {
      currentCameraIndex = 0; // reset to the first camera if we reach the end of the array
    }
    console.log(`Active camera: ${currentCameraIndex === 0 ? 'Perspective' : 'Orthographic'}`); // log the current camera index
  }
});


const renderer = new THREE.WebGLRenderer({ antialias: true }); //8
renderer.setSize(window.innerWidth, window.innerHeight); //9
document.body.appendChild(renderer.domElement); //10


const ambient = new THREE.AmbientLight(0xFFFFFF, 0.5); // add ambient light to the scene
const directional = new THREE.DirectionalLight(0xFFFFFF, 2); // add directional light to the scene
scene.add(ambient, directional); // add the lights to the scene

//here add an array of depths
const depths = [0, -2, -4];

//here add an array of colors
const colors = [0xdb8787, 0x00ff00, 0x0000ff];

const positions = [-3, 0, 3];

new PLYLoader().load('models/3D.ply', (geometry) => {
  geometry.center(); // center the geometry
  //TODO: add 2 more models with different colors and depths and show all 3 object with different 
  //for each loops, and on the color part you will go and get colors from the colors array,
  colors.forEach((color, index) => {
    const mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({ color: color, roughness: 0.5})); // create a mesh with the geometry and a material
    mesh.scale.setScalar(0.02); // scale the mesh down
    mesh.rotation.x = Math.PI; // rotate the mesh to face the camera

    mesh.position.x = positions[index];
    mesh.position.z = depths[index];

    scene.add(mesh); // add the mesh to the scene
  })

}) //14



function animate() { //11
  requestAnimationFrame(animate); 
  renderer.render(scene, cameras[currentCameraIndex]); //12
}
animate(); //13
