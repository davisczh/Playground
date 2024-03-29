import { DragControls } from 'three/examples/jsm/controls/DragControls.js';
import * as THREE from 'three';
import { loadModel } from './modelLoader.js';


export async function initialiseModel(couchURL, scene, camera, renderer, roomBounds, controls) {
  let selectedObject = null;
  let boundingBoxHelper = null;
  try {
    const model = await loadModel(couchURL);
  // loadModel(couchURL, (model) => {
    model.scale.set(0.001, 0.001, 0.001); // Scale if needed
    scene.add(model);

    const dragControls = new DragControls([model], camera, renderer.domElement);
    dragControls.addEventListener('dragstart', (event) => {
      controls.enabled = false
      selectedObject = event.object;
      addBoundingBox(selectedObject);
    });
    dragControls.addEventListener('dragend', (event) => {
      controls.enabled = true
      removeBoundingBox(); // Function to remove the bounding box
      selectedObject = null;
    });
    dragControls.addEventListener('drag', onDrag); // Listen to drag events

    model.userData.previousPosition = robot.position.clone(); // Initialize previous position
} catch (error) {
  console.error('An error occurred while loading the model:', error);
}

  // });


  // Collision detection function
  function checkCollision(object) {
   
    const boundingBox = new THREE.Box3().setFromObject(object);
  
    // Check for collision with room bounds
    if (boundingBox.min.x < roomBounds.min.x || boundingBox.max.x > roomBounds.max.x ||
        boundingBox.min.y < roomBounds.min.y || boundingBox.max.y > roomBounds.max.y ||
        boundingBox.min.z < roomBounds.min.z || boundingBox.max.z > roomBounds.max.z) {
      return true; // Collision occurred
    }
    return false; // No collision
  }

  function onDrag(event) {
    const draggableObject = event.object; // Use the object from the event

    if (checkCollision(draggableObject)) {
      // Handle the collision
      // For example, you can revert the model's position to its previous value
      event.object.position.copy(event.object.userData.previousPosition);
    } else {
      // If no collision, save the current position as the previous position
      event.object.userData.previousPosition = event.object.position.clone();
    }
    updateBoundingBox(event.object);
    
  }
  function addBoundingBox(object) {
  // Remove the previous bounding box if it exists
  if (boundingBoxHelper) {
    scene.remove(boundingBoxHelper);
  }
  // Create a new bounding box helper
  const boundingBox = new THREE.Box3().setFromObject(object);
  boundingBoxHelper = new THREE.Box3Helper(boundingBox, 0xff0000); // Red color for the bounding box
  scene.add(boundingBoxHelper);
}

function removeBoundingBox() {
  // Remove the bounding box helper from the scene
  if (boundingBoxHelper) {
    scene.remove(boundingBoxHelper);
    boundingBoxHelper = null;
  }
}
function updateBoundingBox(object) {
  // If a bounding box helper already exists, remove it
  if (boundingBoxHelper) {
    scene.remove(boundingBoxHelper);
  }
  // Create a new bounding box for the object
  const boundingBox = new THREE.Box3().setFromObject(object);
  // Create a new helper for the new bounding box
  boundingBoxHelper = new THREE.Box3Helper(boundingBox, 0xff0000); // Red color for the bounding box
  // Add the new helper to the scene
  scene.add(boundingBoxHelper);
}

}

export let mixer;
export let robot;
export let robotModel;

export async function initialiseModelrobot(robotURL, scene, camera, renderer, roomBounds, controls) {
  let selectedObject = null;
  let boundingBoxHelper = null;

  let clock = new THREE.Clock(); // Clock to manage animations
try {
    const model = await loadModel(robotURL);
  // await loadModel(robotURL, (model) => {
    // model.scale.set(0.001, 0.001, 0.001); // Scale the model if needed
    robotModel = model
    robot = model.scene;
    scene.add(robot);

    // Assuming the robot model has animations
    mixer = new THREE.AnimationMixer(robot);

    // console.log(model.animations)
    // const walkAction = mixer.clipAction(model.animations[0]); // Replace with the correct index for walking animation
    // walkAction.play();

    robot.position.set(0,  roomBounds.min.y,0); // Set the initial position of the robot

    robot.previousPosition = robot.position.clone(); // Initialize previous position

} catch (error) {
  console.error('An error occurred while loading the model:', error);
}
  // });
 
  // Collision detection function

}
export function checkCollision(object, roomBounds) {
   
  const boundingBox = new THREE.Box3().setFromObject(object);

  // Check for collision with room bounds
  if (boundingBox.min.x < roomBounds.min.x || boundingBox.max.x > roomBounds.max.x ||
      boundingBox.min.y < roomBounds.min.y || boundingBox.max.y > roomBounds.max.y ||
      boundingBox.min.z < roomBounds.min.z || boundingBox.max.z > roomBounds.max.z) {
    return true; // Collision occurred
  }
  return false; // No collision
}