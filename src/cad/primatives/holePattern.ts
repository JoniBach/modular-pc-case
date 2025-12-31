import primitivesPkg from '@jscad/modeling/src/primitives';
const { cylinder } = primitivesPkg;

import booleansPkg from '@jscad/modeling/src/operations/booleans';
const { union } = booleansPkg;
import type { Geom3 } from '@jscad/modeling/src/geometries/types';
import { type Vec3 } from '../anchors';

export interface HolePatternOptions {
  holePositions: Vec3[];
  holeDiameter: number;
  holeDepth: number;
  segments?: number;
}

/**
 * Creates a pattern of holes based on the provided positions
 * Useful for mounting patterns like motherboard standoffs, fan mounts, etc.
 */
export function createHolePattern(options: HolePatternOptions): Geom3 {
  const {
    holePositions,
    holeDiameter,
    holeDepth,
    segments = 32
  } = options;

  // Create individual holes
  const holes = holePositions.map(position => {
    return cylinder({
      radius: holeDiameter / 2,
      height: holeDepth,
      center: position,
      segments
    });
  });

  // Union all holes together
  return union(...holes);
}

/**
 * Creates a grid pattern of holes
 */
export function createHoleGrid(
  rows: number,
  columns: number,
  rowSpacing: number,
  columnSpacing: number,
  holeDiameter: number,
  holeDepth: number,
  basePosition: Vec3 = [0, 0, 0],
  segments: number = 32
): Geom3 {
  const holePositions: Vec3[] = [];
  
  // Calculate the starting position (top-left of grid)
  const startX = basePosition[0] - (columns - 1) * columnSpacing / 2;
  const startY = basePosition[1] - (rows - 1) * rowSpacing / 2;
  const z = basePosition[2];
  
  // Generate positions for each hole in the grid
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      const x = startX + col * columnSpacing;
      const y = startY + row * rowSpacing;
      holePositions.push([x, y, z]);
    }
  }
  
  return createHolePattern({
    holePositions,
    holeDiameter,
    holeDepth,
    segments
  });
}

/**
 * Creates a standard fan mounting hole pattern
 * @param fanSize Fan size in mm (e.g., 120 for a 120mm fan)
 * @param holeDiameter Diameter of mounting holes
 * @param holeDepth Depth of the holes
 * @param basePosition Center position of the fan
 */
export function createFanMountPattern(
  fanSize: number,
  holeDiameter: number,
  holeDepth: number,
  basePosition: Vec3 = [0, 0, 0],
  segments: number = 32
): Geom3 {
  // Standard fan mounting holes are in a square pattern
  // with holes at each corner, inset by a standard amount
  const holeInset = 7.5; // Standard inset for PC fan mounting holes
  
  const mountingDistance = fanSize - (holeInset * 2);
  const halfDistance = mountingDistance / 2;
  
  const holePositions: Vec3[] = [
    [basePosition[0] - halfDistance, basePosition[1] - halfDistance, basePosition[2]],
    [basePosition[0] - halfDistance, basePosition[1] + halfDistance, basePosition[2]],
    [basePosition[0] + halfDistance, basePosition[1] - halfDistance, basePosition[2]],
    [basePosition[0] + halfDistance, basePosition[1] + halfDistance, basePosition[2]]
  ];
  
  return createHolePattern({
    holePositions,
    holeDiameter,
    holeDepth,
    segments
  });
}