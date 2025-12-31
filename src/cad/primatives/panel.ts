import primitivesPkg from '@jscad/modeling/src/primitives';
const { cuboid, cylinder } = primitivesPkg;

import booleansPkg from '@jscad/modeling/src/operations/booleans';
const { subtract } = booleansPkg;

import transformsPkg from '@jscad/modeling/src/operations/transforms';
const { translate } = transformsPkg;
import type { Geom3 } from '@jscad/modeling/src/geometries/types';
import { createPanelAnchors, type GeometryWithAnchors, type Vec3 } from '../anchors';

export interface PanelOptions {
  width: number;
  height: number;
  thickness: number;
  position?: Vec3;
  cornerRadius?: number;
  holes?: HoleDefinition[];
  depth?: number; // Optional depth parameter for top/bottom panels
}

export interface HoleDefinition {
  x: number;
  y: number;
  diameter: number;
  countersink?: boolean;
  countersinkDiameter?: number;
  countersinkDepth?: number;
}

/**
 * Creates a panel with optional holes and rounded corners
 */
export function createPanel(options: PanelOptions): GeometryWithAnchors {
  const {
    width,
    height,
    thickness,
    position = [0, 0, 0],
    cornerRadius = 0,
    holes = []
  } = options;

  // Create the base panel
  let panel = cuboid({
    size: [width, height, thickness],
    center: position
  });

  // Add holes if specified
  if (holes.length > 0) {
    const holeGeometries = holes.map(hole => {
      const holePosition: Vec3 = [
        position[0] + hole.x,
        position[1] + hole.y,
        position[2]
      ];
      
      // Create the basic hole cylinder
      const holeGeometry = cylinder({
        radius: hole.diameter / 2,
        height: thickness + 0.1, // Slightly larger to ensure clean subtraction
        center: holePosition,
        segments: 32 // Smooth circle
      });
      
      // Add countersink if specified
      if (hole.countersink && hole.countersinkDiameter && hole.countersinkDepth) {
        const countersinkGeometry = cylinder({
          radius: hole.countersinkDiameter / 2,
          height: hole.countersinkDepth,
          center: [
            holePosition[0],
            holePosition[1],
            position[2] + thickness / 2 - hole.countersinkDepth / 2
          ],
          segments: 32 // Smooth circle
        });
        
        return [holeGeometry, countersinkGeometry];
      }
      
      return [holeGeometry];
    }).flat();
    
    // Subtract all holes from the panel
    panel = subtract(panel, ...holeGeometries);
  }

  // Create anchors for the panel
  const anchors = createPanelAnchors(width, height, thickness, position);
  
  return {
    geom: panel,
    anchors
  };
}

/**
 * Creates a panel with a cutout (useful for I/O panels, fan mounts, etc.)
 */
export function createPanelWithCutout(
  options: PanelOptions,
  cutoutWidth: number,
  cutoutHeight: number,
  cutoutPosition: Vec3 = [0, 0, 0]
): GeometryWithAnchors {
  const panelWithAnchors = createPanel(options);
  
  // Calculate the actual cutout position
  const basePosition = options.position || [0, 0, 0];
  const actualCutoutPosition: Vec3 = [
    basePosition[0] + cutoutPosition[0],
    basePosition[1] + cutoutPosition[1],
    basePosition[2] + cutoutPosition[2]
  ];
  
  // Create the cutout
  const cutout = cuboid({
    size: [cutoutWidth, cutoutHeight, options.thickness + 0.1], // Slightly larger to ensure clean subtraction
    center: actualCutoutPosition
  });
  
  // Subtract the cutout from the panel
  const panelWithCutout = subtract(panelWithAnchors.geom, cutout);
  
  return {
    geom: panelWithCutout,
    anchors: panelWithAnchors.anchors
  };
}