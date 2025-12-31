/**
 * Simplified CAD components for the 3D viewer
 * This avoids the JSCAD import issues by using Three.js directly
 */
import * as THREE from 'three';
import type { CaseOptions } from '../../cad/assemblies/case';

/**
 * Creates a simplified PC case model using Three.js geometries
 */
export function createSimplifiedCase(options: {
  width: number;
  height: number;
  depth: number;
  panelThickness: number;
  cornerRadius: number;
  material?: string;
}): THREE.Group {
  const { width, height, depth, panelThickness, cornerRadius, material } = options;
  
  // Create a group to hold all the panels
  const caseGroup = new THREE.Group();
  
  // Create material based on the specified material type
  const isAcrylic = material?.includes('acrylic');
  const materialObj = new THREE.MeshStandardMaterial({
    color: isAcrylic ? 0xB5D3E7 : 0xA9A9A9,
    metalness: isAcrylic ? 0.1 : 0.5,
    roughness: isAcrylic ? 0.2 : 0.7,
    transparent: isAcrylic,
    opacity: isAcrylic ? 0.7 : 1.0
  });
  
  // Create the panels
  // Front panel
  const frontPanel = createPanel(width, height, panelThickness, cornerRadius);
  frontPanel.position.set(0, depth/2 - panelThickness/2, 0);
  frontPanel.material = materialObj;
  caseGroup.add(frontPanel);
  
  // Back panel
  const backPanel = createPanel(width, height, panelThickness, cornerRadius);
  backPanel.position.set(0, -depth/2 + panelThickness/2, 0);
  backPanel.material = materialObj;
  caseGroup.add(backPanel);
  
  // Top panel
  const topPanel = createPanel(width, depth, panelThickness, cornerRadius);
  topPanel.rotation.x = Math.PI / 2;
  topPanel.position.set(0, 0, height/2 - panelThickness/2);
  topPanel.material = materialObj;
  caseGroup.add(topPanel);
  
  // Bottom panel
  const bottomPanel = createPanel(width, depth, panelThickness, cornerRadius);
  bottomPanel.rotation.x = Math.PI / 2;
  bottomPanel.position.set(0, 0, -height/2 + panelThickness/2);
  bottomPanel.material = materialObj;
  caseGroup.add(bottomPanel);
  
  // Left panel
  const leftPanel = createPanel(depth, height, panelThickness, cornerRadius);
  leftPanel.rotation.y = Math.PI / 2;
  leftPanel.position.set(-width/2 + panelThickness/2, 0, 0);
  leftPanel.material = materialObj;
  caseGroup.add(leftPanel);
  
  // Right panel
  const rightPanel = createPanel(depth, height, panelThickness, cornerRadius);
  rightPanel.rotation.y = Math.PI / 2;
  rightPanel.position.set(width/2 - panelThickness/2, 0, 0);
  rightPanel.material = materialObj;
  caseGroup.add(rightPanel);
  
  return caseGroup;
}

/**
 * Creates a panel with optional rounded corners
 */
function createPanel(
  width: number,
  height: number,
  thickness: number,
  cornerRadius: number
): THREE.Mesh {
  // If cornerRadius is 0, create a simple box
  if (cornerRadius <= 0) {
    return new THREE.Mesh(
      new THREE.BoxGeometry(width, height, thickness)
    );
  }
  
  // Create a rounded rectangle shape
  const shape = new THREE.Shape();
  
  const x = -width / 2;
  const y = -height / 2;
  const r = Math.min(cornerRadius, Math.min(width, height) / 4); // Limit radius
  
  shape.moveTo(x + r, y);
  shape.lineTo(x + width - r, y);
  shape.quadraticCurveTo(x + width, y, x + width, y + r);
  shape.lineTo(x + width, y + height - r);
  shape.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  shape.lineTo(x + r, y + height);
  shape.quadraticCurveTo(x, y + height, x, y + height - r);
  shape.lineTo(x, y + r);
  shape.quadraticCurveTo(x, y, x + r, y);
  
  // Extrude the shape to create a 3D panel
  const extrudeSettings = {
    depth: thickness,
    bevelEnabled: false
  };
  
  return new THREE.Mesh(
    new THREE.ExtrudeGeometry(shape, extrudeSettings)
  );
}

/**
 * Creates a simplified motherboard model
 */
export function createSimplifiedMotherboard(formFactor: string): THREE.Mesh {
  // Get dimensions based on form factor
  const width = formFactor === 'ATX' ? 305 : formFactor === 'microATX' ? 244 : 170;
  const height = formFactor === 'ATX' ? 244 : formFactor === 'microATX' ? 244 : 170;
  const thickness = 1.6;
  
  // Create geometry and material
  const geometry = new THREE.BoxGeometry(width, height, thickness);
  const material = new THREE.MeshStandardMaterial({
    color: 0x006633, // PCB green
    metalness: 0.2,
    roughness: 0.8
  });
  
  // Create and return mesh
  return new THREE.Mesh(geometry, material);
}

/**
 * Creates a simplified power supply model
 */
export function createSimplifiedPSU(formFactor: string): THREE.Mesh {
  // Get dimensions based on form factor
  const width = formFactor === 'ATX' ? 150 : formFactor === 'SFX' ? 125 : 81.5;
  const height = formFactor === 'ATX' ? 86 : formFactor === 'SFX' ? 63.5 : 40.5;
  const length = formFactor === 'ATX' ? 140 : formFactor === 'SFX' ? 100 : 150;
  
  // Create geometry and material
  const geometry = new THREE.BoxGeometry(width, height, length);
  const material = new THREE.MeshStandardMaterial({
    color: 0x333333, // Dark gray
    metalness: 0.7,
    roughness: 0.3
  });
  
  // Create and return mesh
  return new THREE.Mesh(geometry, material);
}
