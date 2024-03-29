
import { createScene } from './scene.js';
import { createCamera } from './camera.js';
import { createRenderer } from './renderer.js';
import { createControls  } from './controls.js';
import { addLights } from './lighting.js';
import { addRoom } from './geometry.js';
import { initialiseModel, initialiseModelrobot} from './InitialiseModel.js';
import { createCanvas } from './canvas.js';
import * as THREE from 'three';
import { mixer , robot , robotModel, checkCollision} from './InitialiseModel.js';
const sizes = {
  width : window.innerWidth,
  height : window.innerHeight,
}
const wallTextureUrl = "/AdobeStock_125450626_Preview.jpg"; // Replace with the actual path to your texture file
const ceilingTextureUrl = "/ceiling.jpg"
const couchURL = "/couch.obj"
const robotURL = "/robot.gltf"
const room1 = {
  Width: 10,
  Height: 10,
  Depth: 10

}
const room2 = {
  Width: 10,
  Height: 10,
  Depth: 10

}
const room3 = {
  Width: 10,
  Height: 10,
  Depth: 10

}
const roomDimensions = [room1, room2, room3];

const roomWidth = 10;
const roomHeight = 10;
const roomDepth = 10;

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

let isautoMoving = false;
let speed = 0.05; // Adjust this value for speed
let keysPressed = {};
const clock = new THREE.Clock();
let walkAction;
let isWalking = false;
let destination = new THREE.Vector3(); // Global destination position
let isMovingToDestination = false; // Flag to check if moving towards destination





// Add event listener after the DOM content is loaded
document.addEventListener('DOMContentLoaded', () => {
  const button = document.getElementById('myButton');
  button.addEventListener('click', () => setDestination(0, -5, 0));
});

addLights(scene);   
let room = addRoom(scene, roomWidth, roomHeight, roomDepth, wallTextureUrl, ceilingTextureUrl, roomBounds);
// initialiseModel(couchURL, scene, camera, renderer, roomBounds, controls);
initialiseModelrobot(robotURL, scene, camera, renderer, roomBounds, controls);

// const canvas = createCanvas(scene, room, roomDimensions, wallTextureUrl, ceilingTextureUrl);
// console.log(canvas);
window.addEventListener('resize', () => {
  
  sizes.width = window.innerWidth ; 
  console.log(sizes.width);
  sizes.height = window.innerHeight;
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
})

function animate() {

  controls.update(); // Only required if controls.enableDamping or controls.autoRotate are set to true
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  const deltaTime = clock.getDelta();
  controlWalkingAnimation();
  if (robot) {
    updateModelPosition(deltaTime);
    // console.log(robot.position);
  }
  
  if (mixer){
    mixer.update(deltaTime); // If you have animations
  }
  if (isautoMoving) {
    // Calculate direction vector
    let direction = destination.clone().sub(robot.position).normalize();

    // Move the model
    robot.position.add(direction.multiplyScalar(speed));
    
    // Check if the model has reached close to the destination
    if (robot.position.distanceTo(destination) < speed) {
        robot.position.copy(destination);
        isautoMoving = false;
    }


}
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

document.addEventListener('keydown', (event) => {
  if (document.activeElement.id === 'chatInput') {
    // If the chatInput is focused, ignore the WASD keys
    return;
  }
  keysPressed[event.key.toLowerCase()] = true;
});

document.addEventListener('keyup', (event) => {
  if (document.activeElement.id === 'chatInput') {
    // If the chatInput is focused, ignore the WASD keys
    return;
}
  keysPressed[event.key.toLowerCase()] = false;
});

animate();


function setDestination(x, y, z) {
  // Only update the destination and set the flag if the new destination is different
  let newDestination = new THREE.Vector3(x, y, z);

  destination.copy(newDestination);
  isMovingToDestination = true;
  console.log('setDestination');
  }
  


function controlWalkingAnimation() {
  // Check if any of the WASD keys are pressed
  const isMoving = keysPressed['w'] || keysPressed['a'] || keysPressed['s'] || keysPressed['d'] || isMovingToDestination;

  if (isMoving && !isWalking) {
    console.log("walking");
    // Start the walking animation if not already walking
    if (mixer) {
      walkAction = mixer.clipAction(robotModel.animations[0]); // Assuming the walking animation is the first
      walkAction.play();
    }
    
    isWalking = true;
  } else if (!isMoving && isWalking) {
    // Stop the walking animation if currently walking
    walkAction.stop();
    isWalking = false;
  }
}
function updateModelPosition(deltaTime) {

  if (robot.position.equals(destination)) {
    isMovingToDestination = false; // Stop moving since it's at the destination
    console.log("reached");
}
  const speed = 5; // Adjust the speed as needed
  const distance = speed * deltaTime;
  const previousPosition = robot.position.clone();
  if (isMovingToDestination) {
    // console.log("moving");
    const speed = 5;
    const distance = speed * deltaTime;
    const direction = destination.clone().sub(robot.position).normalize();
    const moveDistance = direction.multiplyScalar(distance);

    if (moveDistance.length() > destination.distanceTo(robot.position)) {
        robot.position.copy(destination);
        isMovingToDestination = false;
    } else {
        robot.position.add(moveDistance);
        robot.rotation.y = Math.atan2(direction.x, direction.z);
    }
} else {
  if (keysPressed['w']) {
    robot.position.z -= distance;
    robot.rotation.y = Math.PI; // Rotated 180 degrees
  }
  if (keysPressed['s']) { 
    robot.position.z += distance;
    robot.rotation.y = 0; // No rotation
  }
  if (keysPressed['a']) {
    robot.position.x -= distance;
    robot.rotation.y = -Math.PI / 2; // Rotated -90 degrees (or 270 degrees)
  }
  if (keysPressed['d']) {
    robot.position.x += distance;
    robot.rotation.y = Math.PI / 2; // Rotated 90 degrees
  }
}
  
  if (checkCollision(robot, roomBounds)) {
    // If collision, revert to previous position
    robot.position.copy(previousPosition);
    const directionToOrigin = new THREE.Vector3(0, roomBounds.min.y, 0).sub(robot.position).normalize();
    robot.position.add(directionToOrigin.multiplyScalar(0.1));
  } else {
    // If no collision, save the current position as the previous position
    robot.previousPosition = robot.position.clone();
  }
}

