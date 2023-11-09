import * as THREE from 'three';

// Function to load a texture
function loadTexture(url) {
  const loader = new THREE.TextureLoader();
  return loader.load(url);
}

// Function to create a textured material
export function createTexturedMaterial(url) {
  const texture = loadTexture(url);
  return new THREE.MeshBasicMaterial({ map: texture });
}
