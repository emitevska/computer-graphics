
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

// TODO 1 - Camera
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.set(0, 1, 5);
camera.lookAt(0, 0, 0);

// TODO 2 - Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// TODO 3 - Cube
const geometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
const material = new THREE.MeshStandardMaterial({ color: 0xE8431C });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// TODO 4 - Lights
const light = new THREE.AmbientLight(0xFFFFFF, 2.5);
scene.add(light);

const dirLight = new THREE.DirectionalLight(0xFFFFFF, 2.5);
dirLight.position.set(5, 5, 5);
scene.add(dirLight);

// TODO 6 - OrbitControls (optional)
const control = new OrbitControls(camera, renderer.domElement);

// TODO 5 - Animation
function animate() {
    requestAnimationFrame(animate);

    cube.rotation.x += 0.005;
    cube.rotation.y += 0.005;

    control.update();
    renderer.render(scene, camera);
}
animate();
