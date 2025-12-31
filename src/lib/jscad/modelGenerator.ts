/**
 * Helper functions for generating 3D models based on configuration
 */
import { generatePCCase } from '../../cad';
import type { Geom3 } from '@jscad/modeling/src/geometries/types';
import type { CaseOptions } from '../../cad/assemblies/case';
import { geomToBufferData } from './toMesh';
import * as THREE from 'three';

/**
 * Generates a Three.js mesh for a PC case based on configuration
 */
export function generateCaseMesh(config: CaseOptions): {
  mesh: THREE.Mesh;
  geometry: Geom3;
} {
  try {
    // Generate the case using our CAD module
    const caseGeometry = generatePCCase(config);
    
    // Convert JSCAD geometry to Three.js buffer data
    const bufferData = geomToBufferData(caseGeometry.geom);
    
    // Create Three.js geometry
    const threeGeometry = new THREE.BufferGeometry();
    threeGeometry.setAttribute('position', new THREE.Float32BufferAttribute(bufferData.vertices, 3));
    threeGeometry.setAttribute('normal', new THREE.Float32BufferAttribute(bufferData.normals, 3));
    threeGeometry.setIndex(bufferData.indices);
    
    // Create material
    const material = new THREE.MeshStandardMaterial({
      color: config.material === 'acrylic3mm' || config.material === 'acrylic5mm' 
        ? 0xB5D3E7 // Acrylic color
        : 0xA9A9A9, // Aluminum color
      metalness: config.material?.includes('acrylic') ? 0.1 : 0.5,
      roughness: config.material?.includes('acrylic') ? 0.2 : 0.7,
      transparent: config.material?.includes('acrylic'),
      opacity: config.material?.includes('acrylic') ? 0.7 : 1.0,
      flatShading: false
    });
    
    // Create mesh
    const mesh = new THREE.Mesh(threeGeometry, material);
    
    return {
      mesh,
      geometry: caseGeometry.geom
    };
  } catch (error) {
    console.error('Error generating case model:', error);
    
    // Create a placeholder cube if generation fails
    const cubeGeometry = new THREE.BoxGeometry(100, 100, 100);
    const material = new THREE.MeshStandardMaterial({
      color: 0xcccccc,
      metalness: 0.3,
      roughness: 0.7
    });
    
    // Create mesh
    const mesh = new THREE.Mesh(cubeGeometry, material);
    
    // Return placeholder
    return {
      mesh,
      geometry: null as unknown as Geom3 // This is a hack, but it's just for error handling
    };
  }
}

/**
 * Generates a Three.js mesh for a motherboard based on configuration
 */
export function generateMotherboardMesh(formFactor: string): THREE.Mesh {
  // Create a simple placeholder for the motherboard
  const width = formFactor === 'ATX' ? 305 : formFactor === 'microATX' ? 244 : 170;
  const height = formFactor === 'ATX' ? 244 : formFactor === 'microATX' ? 244 : 170;
  
  const geometry = new THREE.BoxGeometry(width, height, 1.6);
  const material = new THREE.MeshStandardMaterial({
    color: 0x006633, // PCB green
    metalness: 0.2,
    roughness: 0.8
  });
  
  return new THREE.Mesh(geometry, material);
}

/**
 * Generates a Three.js mesh for a power supply based on configuration
 */
export function generatePSUMesh(formFactor: string): THREE.Mesh {
  // Create a simple placeholder for the PSU
  const width = formFactor === 'ATX' ? 150 : formFactor === 'SFX' ? 125 : 81.5;
  const height = formFactor === 'ATX' ? 86 : formFactor === 'SFX' ? 63.5 : 40.5;
  const length = formFactor === 'ATX' ? 140 : formFactor === 'SFX' ? 100 : 150;
  
  const geometry = new THREE.BoxGeometry(width, height, length);
  const material = new THREE.MeshStandardMaterial({
    color: 0x333333, // Dark gray
    metalness: 0.7,
    roughness: 0.3
  });
  
  return new THREE.Mesh(geometry, material);
}
