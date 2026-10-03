import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';

const BRAND_BLUE = new THREE.Color(0x0b4a9e);
const BRAND_LINE = new THREE.Color(0x2aa3ff);

// Pintura e acabamentos (só cor/material; a geometria do modelo não é alterada).
// Os nomes são os materiais do arquivo .glb otimizado.
function applyLivery(model) {
  const byName = new Map();
  const all = new Set();
  model.traverse((child) => {
    if (!child.isMesh) return;
    for (const m of Array.isArray(child.material) ? child.material : [child.material]) {
      all.add(m);
      if (!byName.has(m.name)) byName.set(m.name, []);
      byName.get(m.name).push(m);
    }
  });

  const paint = (name, hex, { metalness, roughness } = {}) => {
    for (const m of byName.get(name) || []) {
      m.color.setHex(hex);
      if (metalness !== undefined) m.metalness = metalness;
      if (roughness !== undefined) m.roughness = roughness;
      m.needsUpdate = true;
    }
  };

  // Saia e base do baú: azul da marca, metalizado
  paint('PaletteMaterial058', 0x0b4a9e, { metalness: 0.35, roughness: 0.4 });
  // Painéis de extremidade: alumínio claro
  paint('PaletteMaterial057', 0xc7d2de, { metalness: 0.5, roughness: 0.35 });

  // Pneus: borracha preta e fosca
  for (const m of byName.get('PaletteMaterial070') || []) {
    m.color.setHex(0x15171a);
    m.map = null;
    m.specularIntensity = 0.15;
    m.roughness = 0.92;
    m.metalness = 0;
    m.needsUpdate = true;
  }

  // Paredes: tinta branca brilhante, com faixa azul na base e filete claro
  for (const m of byName.get('') || []) {
    m.color.setHex(0xf2f6fa);
    m.metalness = 0.15;
    m.roughness = 0.32;
    m.onBeforeCompile = (shader) => {
      shader.vertexShader = shader.vertexShader
        .replace('#include <common>', '#include <common>\nvarying vec3 vWPos;')
        .replace('#include <begin_vertex>', `#include <begin_vertex>
          vec4 wp = vec4(transformed, 1.0);
          #ifdef USE_INSTANCING
            wp = instanceMatrix * wp;
          #endif
          vWPos = (modelMatrix * wp).xyz;`);
      shader.fragmentShader = shader.fragmentShader
        .replace('#include <common>', '#include <common>\nvarying vec3 vWPos;')
        .replace('#include <color_fragment>', `#include <color_fragment>
          vec3 liveryBlue = vec3(${BRAND_BLUE.r}, ${BRAND_BLUE.g}, ${BRAND_BLUE.b});
          vec3 liveryLine = vec3(${BRAND_LINE.r}, ${BRAND_LINE.g}, ${BRAND_LINE.b});
          float band = 1.0 - smoothstep(1.84, 1.86, vWPos.y);
          float pin = smoothstep(1.86, 1.87, vWPos.y) * (1.0 - smoothstep(1.93, 1.94, vWPos.y));
          diffuseColor.rgb = mix(diffuseColor.rgb, liveryBlue, band);
          diffuseColor.rgb = mix(diffuseColor.rgb, liveryLine, pin);`);
    };
    m.customProgramCacheKey = () => 'livery-v1';
    m.needsUpdate = true;
  }

  // Vidros: azulados, quase transparentes e reflexivos
  for (const m of all) {
    if (m.transparent || m.opacity < 1) {
      m.color.setHex(0x9ec9e6);
      m.opacity = Math.min(m.opacity, 0.35);
      m.roughness = 0.05;
      m.metalness = 0;
      m.depthWrite = false;
      m.needsUpdate = true;
    }
  }
}

export async function createTruck(scene) {
  const loader = new GLTFLoader();
  loader.setMeshoptDecoder(MeshoptDecoder);
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
          // Texturas nítidas em ângulos rasos (o three limita ao máximo da placa de vídeo)
          for (const key of ['map', 'normalMap', 'roughnessMap', 'metalnessMap', 'emissiveMap', 'aoMap']) {
            if (child.material[key]) child.material[key].anisotropy = 16;
          }
          child.material.needsUpdate = true;
        }
      }
    });

    applyLivery(model);

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

