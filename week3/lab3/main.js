import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/Addons.js';

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    100
)
camera.position.set(0, 15, 25)
camera.lookAt(0, 0, 0)
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)
const pointLight = new THREE.PointLight(0xffffff, 400, 0, 1.6)
const ambientLight = new THREE.AmbientLight(0xffffff, 2.3)
scene.add(pointLight, ambientLight)

const geometry = new THREE.SphereGeometry(2, 32, 24);
const material = new THREE.MeshStandardMaterial({ color: 0XFFA500 })
const sun = new THREE.Mesh(geometry, material)
scene.add(sun)

const earthOrbit = new THREE.Object3D();
sun.add(earthOrbit)


const earth = new THREE.Mesh(
    new THREE.SphereGeometry(0.8, 32, 24),
    new THREE.MeshStandardMaterial({ color: 0X1E40FF, roughness: 0.9 })
)
earth.position.x = 6
earthOrbit.add(earth)

const moonOrbit = new THREE.Object3D();
earth.add(moonOrbit)
const moon = new THREE.Mesh(
    new THREE.SphereGeometry(0.25, 32, 24),
    new THREE.MeshStandardMaterial({ color: 0X808080, roughness: 0.9 })
)
moon.position.x = 1.8
moonOrbit.add(moon)


// Mars orbit around the Sun
const marsOrbit = new THREE.Object3D();
sun.add(marsOrbit);

// Mars planet
const mars = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 24),
    new THREE.MeshStandardMaterial({ color: 0xC1440E, roughness: 0.9 })
);
mars.position.x = 8;
marsOrbit.add(mars);

// Phobos orbit around Mars
const phobosOrbit = new THREE.Object3D();
mars.add(phobosOrbit);

// Phobos moon
const phobos = new THREE.Mesh(
    new THREE.SphereGeometry(0.15, 32, 24),
    new THREE.MeshStandardMaterial({ color: 0x888888 })
);
phobos.position.x = 1;
phobosOrbit.add(phobos);

const control = new OrbitControls(camera, renderer.domElement);
function animate() {
    requestAnimationFrame(animate);

    control.update();

    // Sun rotation
    sun.rotation.y += 0.003;

    // Earth and Moon
    earthOrbit.rotation.y += 0.01;
    earth.rotation.y += 0.01;
    moonOrbit.rotation.y += 0.04;


    // Mars and Phobos
    marsOrbit.rotation.y += 0.007;
    mars.rotation.y += 0.012;
    phobosOrbit.rotation.y += 0.05;

    renderer.render(scene, camera);
}

animate()

addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(innerWidth, innerHeight)
})