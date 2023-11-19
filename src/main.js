
import { createScene } from './scene.js';
import { createCamera } from './camera.js';
import { createRenderer } from './renderer.js';
import { createControls  } from './controls.js';
import { addLights } from './lighting.js';
import { addRoom } from './geometry.js';
import { initialiseModel} from './InitialiseModel.js';


const sizes = {
  width : window.innerWidth,
  height : window.innerHeight,
}
const wallTextureUrl = "/AdobeStock_125450626_Preview.jpg"; // Replace with the actual path to your texture file
const ceilingTextureUrl = "/ceiling.jpg"
const couchURL = "/couch.obj"


// Define the dimensions of the room
const roomWidth = 4;
const roomHeight = 3;
const roomDepth = 7;

const scene = createScene();
const camera = createCamera(sizesroomHeight, roomDepth);
const renderer = createRenderer(sizes);
document.body.appendChild(renderer.domElement);
const controls = createControls(camera, renderer);


const roomBounds = { // Define the boundaries of your room
  min: { x: -roomWidth / 2, y: -roomHeight / 2, z: -roomDepth / 2 },
  max: { x: roomWidth / 2, y: roomHeight / 2, z: roomDepth / 2 }
};


addLights(scene);
addRoom(scene, roomWidth, roomHeight, roomDepth, wallTextureUrl, ceilingTextureUrl, roomBounds);
// initialiseModel(couchURL, scene, camera, renderer, roomBounds, controls);

window.addEventListener('resize', () => {
  sizes.width = window.innerWidth; 
  sizes.height = window.innerHeight;
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
})

function animate() {
  
  controls.update(); // Only required if controls.enableDamping or controls.autoRotate are set to true
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

animate();