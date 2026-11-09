
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1, 1000);
     //from our view
camera.position.set(6,5,6); //position of the camera
camera.lookAt(0, 0, 0);

const renderer= new THREE.WebGLRenderer({antialias: true});
renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);

const control= new OrbitControls(camera, renderer.domElement); //add orbit controls

//MINIMUM - axes helper
scene.add(new THREE.AxesHelper(6));

//MINIMUM - vectors a and b
const origin = new THREE.Vector3(0, 0, 0);
const a = new THREE.Vector3(3, 4, 0);
const b = new THREE.Vector3(1, 0, 0);

//create arrow helpers for vectors
const arrA = new THREE.ArrowHelper(
    a.clone().normalize(), origin, a.length(),
    0xE00000, 0.35, 0.2
);

const arrB = new THREE.ArrowHelper(
    b.clone().normalize(), origin, b.length(),
    0x00E000, 0.35, 0.2
);

//calculate the sum of a and b
const sum = new THREE.Vector3().addVectors(a, b);

const arrSum = new THREE.ArrowHelper(
    sum.clone().normalize(), origin, sum.length(),
    0x0000ff, 0.35, 0.2
);

scene.add(arrA, arrB, arrSum);

//STANDARD - GUI panel
const gui = new GUI();

const params = {
    aX: a.x, aY: a.y, aZ: a.z,
    bX: b.x, bY: b.y, bZ: b.z,
    sum: '',
    dot: '',
    cross: '',
    crossLength: '',
    angle: ''
};

//folder for vector a
const aFolder = gui.addFolder('Vector A');

aFolder.add(params, 'aX', -5, 5, 0.1).name('X').onChange(value => {
    a.x = value;
    updateVectors();
});

aFolder.add(params, 'aY', -5, 5, 0.1).name('Y').onChange(value => {
    a.y = value;
    updateVectors();
});

aFolder.add(params, 'aZ', -5, 5, 0.1).name('Z').onChange(value => {
    a.z = value;
    updateVectors();
});

//folder for vector b
const bFolder = gui.addFolder('Vector B');

bFolder.add(params, 'bX', -5, 5, 0.1).name('X').onChange(value => {
    b.x = value;
    updateVectors();
});

bFolder.add(params, 'bY', -5, 5, 0.1).name('Y').onChange(value => {
    b.y = value;
    updateVectors();
});

bFolder.add(params, 'bZ', -5, 5, 0.1).name('Z').onChange(value => {
    b.z = value;
    updateVectors();
});

//folder for results
const resultFolder = gui.addFolder('Results');

resultFolder.add(params, 'sum').name('a+b').disable();
resultFolder.add(params, 'dot').name('a(dot)b').disable();
resultFolder.add(params, 'cross').name('axb').disable();
resultFolder.add(params, 'crossLength').name('||axb||').disable();
resultFolder.add(params, 'angle').name('degrees').disable();

resultFolder.open();

//function to update arrows and calculations
function updateVectors() {

    //update arrow a
    if (a.length() > 0) {
        arrA.setDirection(a.clone().normalize());
    }
    arrA.setLength(a.length(), 0.35, 0.2);

    //update arrow b
    if (b.length() > 0) {
        arrB.setDirection(b.clone().normalize());
    }
    arrB.setLength(b.length(), 0.35, 0.2);

    //update sum
    sum.addVectors(a, b);

    if (sum.length() > 0) {
        arrSum.setDirection(sum.clone().normalize());
    }
    arrSum.setLength(sum.length(), 0.35, 0.2);

    //calculate dot product
    const dot = a.dot(b);

    //calculate cross product
    const cross = new THREE.Vector3().crossVectors(a, b);
    const crossLength = cross.length();

    //calculate angle between vectors
    let angle = null;

    if (a.length() > 0 && b.length() > 0) {
        const cos = THREE.MathUtils.clamp(
            dot / (a.length() * b.length()),
            -1, 1
        );

        angle = THREE.MathUtils.radToDeg(Math.acos(cos));
    }

    //update GUI results
    params.sum = `(${sum.x.toFixed(2)}, ${sum.y.toFixed(2)}, ${sum.z.toFixed(2)})`;
    params.dot = dot.toFixed(2);
    params.cross = `(${cross.x.toFixed(2)}, ${cross.y.toFixed(2)}, ${cross.z.toFixed(2)})`;
    params.crossLength = crossLength.toFixed(2);
    params.angle = angle === null ? 'Undefined' : angle.toFixed(2) + '°';

    resultFolder.controllersRecursive().forEach(controller => {
        controller.updateDisplay();
    });
}

updateVectors();

//CHALLENGE - plane and ray intersection

//floor(plane)
const n = new THREE.Vector3(0, 1, 0); //normal vector
const p0=new THREE.Vector3(0, 0, 0); //point on the plane
const d =n.dot(p0); //distance from the origin to the plane

//for creating the plane we need geometry and material,
//after we have them we have to mix them together creating a mesh
//after createing a mesh we have our object and we have to add it on the scene

const geometry = new THREE.PlaneGeometry(12, 12); //width and height
const material = new THREE.MeshBasicMaterial({color: 0x00ff00, side: THREE.DoubleSide}); //color and side4
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
    new THREE.LineBasicMaterial({color: 0xff4422})

))
const dot = new THREE.Mesh(
    new THREE.SphereGeometry(0.18),
    new THREE.MeshBasicMaterial({color: 0xff4422})
)
dot.position.copy(hit);
scene.add(dot);

const rayCaster = new THREE.Raycaster(o, dir); //we create a raycaster with the origin and direction
console.log('our formula',hit.toArray()); //we log the hit point from our formula

//compare the formula result with Raycaster
const intersections = rayCaster.intersectObject(floor);

if (intersections.length > 0) {
    const rayHit = intersections[0].point;

    console.log('Raycaster result:', rayHit.toArray());
    console.log('Formula result:', hit.toArray());
    console.log('Difference:', hit.distanceTo(rayHit));
    console.log('Results match:', hit.distanceTo(rayHit) < 0.0001);
} else {
    console.log('Raycaster found no intersection');
}

function animate() {
    requestAnimationFrame(animate);
    control.update(); //update the controls because when we use orbit controls we need to update the controls in the animation loop
    renderer.render(scene, camera);
}
animate();
