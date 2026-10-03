import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export async function createTruck(scene) {
  const loader = new GLTFLoader();
  const truckGroup = new THREE.Group();
  
  try {
    const gltf = await loader.loadAsync('/models/PE- 15741-R00.glb');
    const model = gltf.scene;
    
    // Melhorar visualização de materiais e sombras
    model.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        
        // Ajustes para materiais ficarem mais claros e visíveis
        if (child.material) {
          // Se o material for muito escuro, podemos dar um pequeno boost
          if (child.material.color && child.material.color.getHex() === 0x000000) {
            child.material.color.setHex(0x333333);
          }
          child.material.envMapIntensity = 1.0;
          child.material.needsUpdate = true;
        }
      }
    });

    // Centralizar e colocar no chão
    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    
    // O modelo fica com o centro X e Z na origem (0,0,0) e a base (min Y) no chão (Y = 0)
    model.position.x = -center.x;
    model.position.z = -center.z;
    model.position.y = -box.min.y;
    
    truckGroup.add(model);
    scene.add(truckGroup);
    
    return truckGroup;
  } catch (error) {
    console.error('Erro ao carregar o modelo 3D:', error);
    return null;
  }
}

