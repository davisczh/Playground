import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export function loadModel(path, onLoad, onError) {
  // Determine the file extension
  const extension = path.split('.').pop().toLowerCase();

  // Use a switch statement to determine the loader
  switch (extension) {
    case 'obj':
      new OBJLoader().load(path, onLoad, undefined, onError);
      break;
    case 'fbx':
      new FBXLoader().load(path, onLoad, undefined, onError);
      break;
    case 'gltf':
    case 'glb':
      new GLTFLoader().load(path, onLoad, undefined, onError);
      break;
    // Add other cases for different file extensions
    default:
      console.error('Unsupported file format:', extension);
      break;
  }
}
