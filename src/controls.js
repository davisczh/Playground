import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as THREE from 'three';
export function createControls(camera, renderer) {
  const controls = new OrbitControls(camera, renderer.domElement);

  // Prevent the camera from going beneath the ZX plane
  controls.maxPolarAngle = Math.PI / 2 + 0.1; // Adjust this value as needed


  return controls;
}

