import * as THREE from 'three';
import { wallMaterial, floorMaterial } from './materials.js';
import { onBeforeRender, onAfterRender } from './utilities.js';
import { createTexturedMaterial } from './texture.js';


function createWall(scene, width, height, depth, position, rotation, textureUrl) {
    const geometry = new THREE.BoxGeometry(width, height, depth);


    const material = textureUrl ? createTexturedMaterial(textureUrl) : wallMaterial

    const wall = new THREE.Mesh(geometry, material);
    wall.position.set(position.x, position.y, position.z);
    wall.rotation.set(rotation.x, rotation.y, rotation.z);
    scene.add(wall);
  
    // Calculate the direction towards the origin (0,0,0)
    const directionToOrigin = new THREE.Vector3().subVectors(new THREE.Vector3(0, 0, 0), wall.position).normalize();
  
    // Set the calculated direction as the normal
    wall.userData.normal = directionToOrigin;
  
    // Create an ArrowHelper to visualize the normal
    const arrowLength = 1; // Can be adjusted to your scene scale
    const arrowColor = 0xff0000; // Red color for the normal vector
    const arrowHelper = new THREE.ArrowHelper(
      wall.userData.normal, // Direction (already normalized)
      wall.position, // Origin
      arrowLength,
      arrowColor
    );
  
    scene.add(arrowHelper);
  
    wall.onBeforeRender = onBeforeRender;
    wall.onAfterRender = onAfterRender;
    return wall;
  }

  
export function addRoom(scene, roomWidth, roomHeight, roomDepth, textureUrl, ceilingTextureUrl) {
    
const wallThickness = 0.1; // for example, 0.1 meters thick

  createWall(scene, roomWidth, roomHeight, wallThickness, { x: 0, y: 0, z: roomDepth / 2 - wallThickness / 2 }, { x: 0, y:2*Math.PI, z:0 }, textureUrl); // Front wall
  createWall(scene, roomWidth, roomHeight, wallThickness, { x: 0, y: 0, z: -roomDepth / 2 + wallThickness / 2 }, { x: 0, y: -Math.PI, z: 0 }, textureUrl); // Back wall
  createWall(scene, wallThickness, roomHeight, roomDepth, { x: -roomWidth / 2 + wallThickness / 2, y: 0, z: 0 }, { x: 0, y: 0, z: 0 }, textureUrl); // Left wall
  createWall(scene, wallThickness, roomHeight, roomDepth, { x: roomWidth / 2 - wallThickness / 2, y: 0, z: 0 }, { x: 0, y: -Math.PI, z: 0 }, textureUrl); // Right wall


  createWall(scene, roomWidth, wallThickness, roomDepth, { x: 0, y: roomHeight/2+ wallThickness/2, z: 0 }, { x: Math.PI, y: 0, z:  2*Math.PI},ceilingTextureUrl); // ceiling
  
  
  // Create the floor and ceiling
  const floorGeometry = new THREE.PlaneGeometry(roomWidth, roomDepth);
  const floor = new THREE.Mesh(floorGeometry, floorMaterial);
  const ceiling = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.rotation.x = -Math.PI / 2; // Rotate to lay flat
  floor.position.y = -roomHeight / 2; // Position at the bottom of the walls
  ceiling.rotation.x = Math.PI / 2; // Rotate to lay flat
  ceiling.position.y = roomHeight / 2; // Position at the top of the walls
  scene.add(floor);

    }
