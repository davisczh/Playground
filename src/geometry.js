import * as THREE from 'three';
import { blackMaterial, floorMaterial } from './materials.js';
import { onBeforeRender, onAfterRender } from './utilities.js';
import { createTexturedMaterial } from './texture.js';


function createWall(scene, width, height, depth, position, rotation, textureUrl) {
    const geometry = new THREE.BoxGeometry(width, height, depth);


    const material = textureUrl ? createTexturedMaterial(textureUrl) : blackMaterial
    const materials = [
      blackMaterial, // Left side
      blackMaterial, // Right side
      blackMaterial, // Top side
      blackMaterial, // Bottom side
      material, // Front side
      material, // Back side
    ]
    const wall = new THREE.Mesh(geometry, materials);
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

  function createCeiling(scene, width, height, depth, position, rotation, textureUrl) {
    const geometry = new THREE.BoxGeometry(width, height, depth);


    const material = textureUrl ? createTexturedMaterial(textureUrl) :  blackMaterial
    const materials = [
      blackMaterial, // Left side
      blackMaterial, // Right side
      material, // Top side
      material, // Bottom side
      blackMaterial, // Front side
      blackMaterial, // Back side
    ]
    const wall = new THREE.Mesh(geometry, materials);
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
  function createFloor(scene, width, height, depth, position, rotation, textureUrl) {
    const geometry = new THREE.BoxGeometry(width, height, depth);


    const material = textureUrl ? createTexturedMaterial(textureUrl) :  blackMaterial
    const materials = [
      blackMaterial, // Left side
      blackMaterial, // Right side
      material, // Top side
      material, // Bottom side
      blackMaterial, // Front side
      blackMaterial, // Back side
    ]
    const wall = new THREE.Mesh(geometry, materials);
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
    
  const wallThickness = 0.15; // for example, 0.1 meters thick

  createWall(scene, roomWidth, roomHeight, wallThickness, { x: 0, y: 0, z: roomDepth / 2 - wallThickness / 2 }, { x: 0, y:2*Math.PI, z:0 }, textureUrl); // Front wall
  createWall(scene, roomWidth, roomHeight, wallThickness, { x: 0, y: 0, z: -roomDepth / 2 + wallThickness / 2 }, { x: 0, y: -Math.PI, z: 0 }, textureUrl); // Back wall
  createWall(scene, roomDepth, roomHeight, wallThickness, { x: -roomWidth / 2 + wallThickness / 2, y: 0, z: 0 }, { x: 0, y: Math.PI/2, z: 0 }, textureUrl); // Left wall
  createWall(scene, roomDepth, roomHeight, wallThickness, { x: roomWidth / 2 - wallThickness / 2, y: 0, z: 0 }, { x: 0, y: -Math.PI/2, z: 0 }, textureUrl); // Right wall


  createCeiling(scene, roomWidth, wallThickness, roomDepth, { x: 0, y: roomHeight/2+ wallThickness/2, z: 0 }, { x: Math.PI, y: 0, z:  2*Math.PI},ceilingTextureUrl); // ceiling
  createFloor(scene, roomWidth, wallThickness, roomDepth, { x: 0, y: -roomHeight/2- wallThickness/2, z: 0 }, { x: Math.PI, y: 0, z:  2*Math.PI},ceilingTextureUrl); // floor
  
    }
