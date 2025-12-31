import * as vec3 from '@jscad/modeling/src/maths/vec3';
import type { Geom3 } from '@jscad/modeling/src/geometries/types';

export type Vec3 = [number, number, number];
export type Anchor = Vec3;
export type Anchors = Record<string, Anchor>;

export interface GeometryWithAnchors {
  geom: Geom3;
  anchors: Anchors;
}

/**
 * Creates a new anchor point at the specified coordinates
 */
export function createAnchor(x: number, y: number, z: number): Anchor {
  return [x, y, z];
}

/**
 * Translates an anchor by the given vector
 */
export function translateAnchor(anchor: Anchor, translation: Vec3): Anchor {
  return vec3.add(createAnchor(0, 0, 0), anchor, translation);
}

/**
 * Creates a set of anchors for a rectangular panel
 * @param width Width of the panel (X)
 * @param height Height of the panel (Y)
 * @param thickness Thickness of the panel (Z)
 * @param basePosition Base position for the panel
 */
export function createPanelAnchors(
  width: number,
  height: number,
  thickness: number,
  basePosition: Vec3 = [0, 0, 0]
): Anchors {
  const halfWidth = width / 2;
  const halfHeight = height / 2;
  const halfThickness = thickness / 2;
  
  return {
    // Corners (top surface)
    topFrontLeft: translateAnchor([-halfWidth, halfHeight, halfThickness], basePosition),
    topFrontRight: translateAnchor([halfWidth, halfHeight, halfThickness], basePosition),
    topBackLeft: translateAnchor([-halfWidth, -halfHeight, halfThickness], basePosition),
    topBackRight: translateAnchor([halfWidth, -halfHeight, halfThickness], basePosition),
    
    // Corners (bottom surface)
    bottomFrontLeft: translateAnchor([-halfWidth, halfHeight, -halfThickness], basePosition),
    bottomFrontRight: translateAnchor([halfWidth, halfHeight, -halfThickness], basePosition),
    bottomBackLeft: translateAnchor([-halfWidth, -halfHeight, -halfThickness], basePosition),
    bottomBackRight: translateAnchor([halfWidth, -halfHeight, -halfThickness], basePosition),
    
    // Centers of faces
    center: translateAnchor([0, 0, 0], basePosition),
    topCenter: translateAnchor([0, 0, halfThickness], basePosition),
    bottomCenter: translateAnchor([0, 0, -halfThickness], basePosition),
    frontCenter: translateAnchor([0, halfHeight, 0], basePosition),
    backCenter: translateAnchor([0, -halfHeight, 0], basePosition),
    leftCenter: translateAnchor([-halfWidth, 0, 0], basePosition),
    rightCenter: translateAnchor([halfWidth, 0, 0], basePosition),
  };
}

/**
 * Aligns two geometries by matching their anchors
 * @param source The geometry to be moved
 * @param sourceAnchorName The name of the anchor on the source geometry
 * @param target The target geometry
 * @param targetAnchorName The name of the anchor on the target geometry
 * @returns The source geometry translated to align the anchors
 */
export function alignAnchors(
  source: GeometryWithAnchors,
  sourceAnchorName: string,
  target: GeometryWithAnchors,
  targetAnchorName: string
): GeometryWithAnchors {
  if (!source.anchors[sourceAnchorName]) {
    throw new Error(`Source anchor "${sourceAnchorName}" not found`);
  }
  
  if (!target.anchors[targetAnchorName]) {
    throw new Error(`Target anchor "${targetAnchorName}" not found`);
  }
  
  const sourceAnchor = source.anchors[sourceAnchorName];
  const targetAnchor = target.anchors[targetAnchorName];
  
  // Calculate the translation needed to align the anchors
  const translation = vec3.subtract(
    createAnchor(0, 0, 0),
    targetAnchor,
    sourceAnchor
  );
  
  // Create new translated anchors
  const translatedAnchors: Anchors = {};
  Object.entries(source.anchors).forEach(([name, anchor]) => {
    translatedAnchors[name] = translateAnchor(anchor, translation);
  });
  
  // Return the translated geometry with updated anchors
  return {
    geom: source.geom, // Note: actual geometry translation will be handled by the caller
    anchors: translatedAnchors,
  };
}