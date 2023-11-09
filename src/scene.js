import * as THREE from 'three';

export function createScene() {
  const scene = new THREE.Scene();
  const axesHelper = new THREE.AxesHelper(5);
  scene.add(axesHelper);
  return scene;
}
