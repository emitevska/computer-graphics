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
