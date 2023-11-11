import * as THREE from 'three';

export function createRenderer(sizes) {
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(sizes.width, sizes.height);
  renderer.setClearColor(0xffffff); // Sets background to white
  return renderer;
}
