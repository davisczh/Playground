import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export function loadModel(path) {
  return new Promise((resolve, reject) => {
      // Determine the file extension
      const extension = path.split('.').pop().toLowerCase();

      // Load the model based on the file extension
      switch (extension) {
          case 'obj':
              new OBJLoader().load(path, resolve, undefined, reject);
              break;
          case 'fbx':
              new FBXLoader().load(path, resolve, undefined, reject);
              break;
          case 'gltf':
          case 'glb':
              new GLTFLoader().load(path, resolve, undefined, reject);
              break;
          // Add other cases for different file extensions
          default:
              reject('Unsupported file format: ' + extension);
              break;
      }
  });
}


