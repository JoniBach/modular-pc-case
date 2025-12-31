import primitivesPkg from '@jscad/modeling/src/primitives';
const { cylinder } = primitivesPkg;

import booleansPkg from '@jscad/modeling/src/operations/booleans';
const { subtract, union } = booleansPkg;

import transformsPkg from '@jscad/modeling/src/operations/transforms';
const { translate, rotate } = transformsPkg;
import type { Geom3 } from '@jscad/modeling/src/geometries/types';
import { type Vec3 } from '../anchors';

/**
 * Creates a fillet (rounded edge) for a corner
 * @param radius Radius of the fillet
 * @param length Length of the fillet
 * @param position Position of the fillet
 * @param rotation Rotation of the fillet in radians [x, y, z]
 */
export function createFillet(
  radius: number,
  length: number,
  position: Vec3 = [0, 0, 0],
  rotation: Vec3 = [0, 0, 0],
  segments: number = 32
): Geom3 {
  // Create a cylinder
  const cyl = cylinder({
    radius,
    height: length,
    center: [0, 0, 0],
    segments
  });
  
  // Create a cube to subtract from the cylinder to create the fillet
  const cube = cylinder({
    radius: radius * 2,
    height: length,
    center: [radius, 0, 0],
    segments: 4 // Square
  });
  
  // Subtract the cube from the cylinder to create the fillet
  const fillet = subtract(cyl, cube);
  
  // Apply rotation and translation
  const rotated = rotate(rotation, fillet);
  return translate(position, rotated);
}

/**
 * Adds fillets to the edges of a rectangular panel
 * @param panel The panel geometry to add fillets to
 * @param width Width of the panel
 * @param height Height of the panel
 * @param thickness Thickness of the panel
 * @param radius Radius of the fillets
 * @param position Position of the panel
 */
export function addPanelFillets(
  panel: Geom3,
  width: number,
  height: number,
  thickness: number,
  radius: number,
  position: Vec3 = [0, 0, 0]
): Geom3 {
  if (radius <= 0) return panel;
  
  const halfWidth = width / 2;
  const halfHeight = height / 2;
  const halfThickness = thickness / 2;
  
  // Create fillets for the four edges along the width
  const topFrontFillet = createFillet(
    radius,
    width,
    [position[0], position[1] + halfHeight, position[2] + halfThickness],
    [Math.PI / 2, 0, 0]
  );
  
  const topBackFillet = createFillet(
    radius,
    width,
    [position[0], position[1] - halfHeight, position[2] + halfThickness],
    [Math.PI / 2, 0, Math.PI]
  );
  
  const bottomFrontFillet = createFillet(
    radius,
    width,
    [position[0], position[1] + halfHeight, position[2] - halfThickness],
    [Math.PI / 2, 0, Math.PI]
  );
  
  const bottomBackFillet = createFillet(
    radius,
    width,
    [position[0], position[1] - halfHeight, position[2] - halfThickness],
    [Math.PI / 2, 0, 0]
  );
  
  // Create fillets for the four edges along the height
  const topLeftFillet = createFillet(
    radius,
    height,
    [position[0] - halfWidth, position[1], position[2] + halfThickness],
    [Math.PI / 2, 0, Math.PI / 2]
  );
  
  const topRightFillet = createFillet(
    radius,
    height,
    [position[0] + halfWidth, position[1], position[2] + halfThickness],
    [Math.PI / 2, 0, -Math.PI / 2]
  );
  
  const bottomLeftFillet = createFillet(
    radius,
    height,
    [position[0] - halfWidth, position[1], position[2] - halfThickness],
    [Math.PI / 2, 0, -Math.PI / 2]
  );
  
  const bottomRightFillet = createFillet(
    radius,
    height,
    [position[0] + halfWidth, position[1], position[2] - halfThickness],
    [Math.PI / 2, 0, Math.PI / 2]
  );
  
  // Combine all fillets
  const fillets = union(
    topFrontFillet,
    topBackFillet,
    bottomFrontFillet,
    bottomBackFillet,
    topLeftFillet,
    topRightFillet,
    bottomLeftFillet,
    bottomRightFillet
  );
  
  // Subtract the fillets from the panel
  return subtract(panel, fillets);
}