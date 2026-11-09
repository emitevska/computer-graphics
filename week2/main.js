import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 
    75, 
    window.innerWidth / window.innerHeight, 
    0.1, 1000);
     //from our view 
camera.position.set(6,5,6); //position of the camera
const renderer= new THREE.WebGLRenderer();
renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);

const control= new OrbitControls(camera, renderer.domElement); //add orbit controls

//floor(plane)
const n = new THREE.Vector3(0, 1, 0); //normal vector
const p0=new THREE.Vector3(0, 0, 0); //point on the plane
const d =n.dot(p0); //distance from the origin to the plane

//for creating the plane we need geometry and material,
//after we have them we have to mix them together creating a mesh
//after createing a mesh we have our object and we have to add it on the scene

const geometry = new THREE.PlaneGeometry(12, 12); //width and height
const material = new THREE.MeshBasicMaterial({color: 0x00ff00}); //color and side4
const floor = new THREE.Mesh(geometry, material); //mixing geometry and material 
floor.rotation.x =-Math.PI/2; //rotating the floor to be horizontal

const grid = new THREE.GridHelper(12, 12); //creating a grid helper
scene.add(floor,grid); //adding the grid on the scene

const o= new THREE.Vector3(2, 5, 1); //origin
const dir = new THREE.Vector3(0.3, -1, 0.1).normalize(); //we use normalize when we need to find one peace of vector so we know what direction the array goes //direction

//formula
const t =(d-n.dot(o))/n.dot(dir); //t is the distance from the origin to the plane
const hit = o.clone().addScaledVector(dir, t); // we use clone because we don't want to change the original vector, we want to create a new vector that is the same as the original vector and then we add the scaled vector to it, and sc
//scale vector is the direction vector multiplied by the distance t, and then we add it to the origin vector to get the hit point

//ray
scene.add(new THREE.Line(
    new THREE.BufferGeometry().setFromPoints([o, hit]),
    new THREE.MeshBasicMaterial({color: 0xff4422})

))
const dot = new THREE.Mesh(
    new THREE.SphereGeometry(0.18),
    new THREE.MeshBasicMaterial({color: 0xff4422})
)
dot.position.copy(hit); 
scene.add(dot);

const rayCaster = new THREE.Raycaster(o, dir); //we create a raycaster with the origin and direction
console.log('our formula',hit.toArray()); //we log the hit point from our formula

function animate() {
    requestAnimationFrame(animate);
    control.update(); //update the controls because when we use orbit controls we need to update the controls in the animation loop
    renderer.render(scene, camera);
}
animate();  

