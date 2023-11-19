import * as THREE from 'three';

export function createCamera(roomHeight, roomDepth) {
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, roomHeight, roomDepth * 1.5);

  return camera;
}
