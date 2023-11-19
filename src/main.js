
import { createScene } from './scene.js';
import { createCamera } from './camera.js';
import { createRenderer } from './renderer.js';
import { createControls  } from './controls.js';
import { addLights } from './lighting.js';
import { addRoom } from './geometry.js';
import { initialiseModel} from './InitialiseModel.js';
import { createCanvas } from './canvas.js';


const sizes = {
  width : window.innerWidth,
  height : window.innerHeight,
}
const wallTextureUrl = "/AdobeStock_125450626_Preview.jpg"; // Replace with the actual path to your texture file
const ceilingTextureUrl = "/ceiling.jpg"
const couchURL = "/couch.obj"

const room1 = {
  Width: 4,
  Height: 3,
  Depth: 7

}
const room2 = {
  Width: 10,
  Height: 3,
  Depth: 10

}
const room3 = {
  Width: 10,
  Height: 10,
  Depth: 10

}
const roomDimensions = [room1, room2, room3];

const roomWidth = 4;
const roomHeight = 4;
const roomDepth = 4;

const roomBounds = { 
  min: { x: -roomWidth / 2, y: -roomHeight / 2, z: -roomDepth / 2 },
  max: { x: roomWidth / 2, y: roomHeight / 2, z: roomDepth / 2 }
};

console.log(roomWidth, roomHeight, roomDepth);

const scene = createScene();
let camera = createCamera(roomHeight, roomDepth);
const renderer = createRenderer(sizes);
document.body.appendChild(renderer.domElement);
let controls = createControls(camera, renderer);


addLights(scene);
let room = addRoom(scene, roomWidth, roomHeight, roomDepth, wallTextureUrl, ceilingTextureUrl, roomBounds);
// initialiseModel(couchURL, scene, camera, renderer, roomBounds, controls);

const canvas = createCanvas(scene, room, roomDimensions, wallTextureUrl, ceilingTextureUrl);
console.log(canvas);
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
export function updateRoom(scene, newDimensions) {
  if (room && room.parent === scene) {
    // Remove the room group from the scene
    scene.remove(room);
    // Dispose of the room's materials and geometries
    room.traverse(function (object) {
      if (object.isMesh) {
        object.geometry.dispose();
        if (Array.isArray(object.material)) {
          object.material.forEach(material => material.dispose());
        } else {
          object.material.dispose();
        }
      }
    });
    // Clear the reference
    room = null;
  }
  
  // Create and add the new room to the scene with the new dimensions
  room = addRoom(scene, newDimensions.Width, newDimensions.Height, newDimensions.Depth, wallTextureUrl, ceilingTextureUrl, roomBounds);

  // Adjust camera and controls if necessary
  camera = createCamera(newDimensions.Height, newDimensions.Depth);
  controls = createControls(camera, renderer);
  
  // Update any other relevant parts of the scene, such as lighting, etc.
}

animate();