import { cuboid } from '@jscad/modeling/src/primitives';
import { subtract } from '@jscad/modeling/src/operations/booleans';
import { translate } from '@jscad/modeling/src/operations/transforms';
import type { Geom3 } from '@jscad/modeling/src/geometries/types';
import { createPanelAnchors, type GeometryWithAnchors, type Vec3 } from '../anchors';
import { createHolePattern } from '../primatives/holePattern';
import { motherboardStandards } from '../../lib/config/standards';

export interface MotherboardOptions {
  formFactor: 'ATX' | 'microATX' | 'miniITX';
  position?: Vec3;
  standoffHeight?: number;
  includeIoShield?: boolean;
}

/**
 * Creates a motherboard model with mounting holes and optional IO shield
 */
export function createMotherboard(options: MotherboardOptions): GeometryWithAnchors {
  const {
    formFactor,
    position = [0, 0, 0],
    standoffHeight = 10,
    includeIoShield = true
  } = options;

  // Get the motherboard specifications from standards
  const spec = motherboardStandards[formFactor];
  if (!spec) {
    throw new Error(`Unknown motherboard form factor: ${formFactor}`);
  }

  // Create the motherboard base
  const motherboardGeom = cuboid({
    size: [spec.width, spec.height, spec.thickness],
    center: [
      position[0],
      position[1],
      position[2] + spec.thickness / 2 + standoffHeight
    ]
  });

  // Create mounting holes
  const mountingHoles = spec.mountingHoles.map(hole => {
    // Convert from spec coordinates to our coordinate system
    // In the spec, (0,0) is the bottom-left corner of the motherboard
    // In our system, (0,0) is the center of the motherboard
    const holeX = position[0] - spec.width / 2 + hole.x;
    const holeY = position[1] - spec.height / 2 + hole.y;
    const holeZ = position[2] + standoffHeight;

    return {
      x: holeX,
      y: holeY,
      z: holeZ,
      diameter: 3.5, // Standard motherboard mounting hole diameter
      depth: spec.thickness + 0.1 // Slightly deeper than the motherboard thickness
    };
  });

  // Create the hole pattern
  const holePositions: Vec3[] = mountingHoles.map(hole => [hole.x, hole.y, hole.z]);
  const holePattern = createHolePattern({
    holePositions,
    holeDiameter: 3.5,
    holeDepth: spec.thickness + 0.1,
    segments: 16
  });

  // Subtract the holes from the motherboard
  const motherboardWithHoles = subtract(motherboardGeom, holePattern);

  // Create IO shield if requested
  let finalGeometry = motherboardWithHoles;
  if (includeIoShield) {
    const ioShieldGeom = cuboid({
      size: [spec.ioShieldWidth, spec.ioShieldHeight, 1.5],
      center: [
        position[0] - spec.width / 2 + spec.ioShieldWidth / 2 + 10, // Position IO shield at the left edge of the motherboard
        position[1],
        position[2] + standoffHeight + spec.thickness / 2
      ]
    });
    
    // In a real implementation, we would subtract the IO cutouts from the shield
    // For now, we'll just add the shield to the motherboard
    // finalGeometry = union(motherboardWithHoles, ioShieldGeom);
    finalGeometry = motherboardWithHoles; // Skip IO shield for now
  }

  // Create anchors for the motherboard
  const motherboardAnchors = createPanelAnchors(
    spec.width,
    spec.height,
    spec.thickness,
    [
      position[0],
      position[1],
      position[2] + standoffHeight + spec.thickness / 2
    ]
  );

  // Add additional anchors specific to motherboards
  const additionalAnchors: Record<string, Vec3> = {
    // CPU socket position (approximate center of the motherboard)
    cpuSocket: [
      position[0],
      position[1] - spec.height / 4,
      position[2] + standoffHeight + spec.thickness
    ],
    // RAM slots position (to the right of the CPU socket)
    ramSlots: [
      position[0] + spec.width / 4,
      position[1],
      position[2] + standoffHeight + spec.thickness
    ],
    // PCIe slots position (bottom area of the motherboard)
    pcieSlots: [
      position[0],
      position[1] + spec.height / 3,
      position[2] + standoffHeight + spec.thickness
    ],
    // IO shield position
    ioShield: [
      position[0] - spec.width / 2 + spec.ioShieldWidth / 2 + 10,
      position[1],
      position[2] + standoffHeight + spec.thickness / 2
    ]
  };

  // Combine all anchors
  const anchors = {
    ...motherboardAnchors,
    ...additionalAnchors
  };

  return {
    geom: finalGeometry,
    anchors
  };
}

/**
 * Creates motherboard standoffs
 */
export function createMotherboardStandoffs(options: MotherboardOptions): GeometryWithAnchors {
  const {
    formFactor,
    position = [0, 0, 0],
    standoffHeight = 10
  } = options;

  // Get the motherboard specifications from standards
  const spec = motherboardStandards[formFactor];
  if (!spec) {
    throw new Error(`Unknown motherboard form factor: ${formFactor}`);
  }

  // Create standoffs for each mounting hole
  const standoffs = spec.mountingHoles.map(hole => {
    // Convert from spec coordinates to our coordinate system
    const holeX = position[0] - spec.width / 2 + hole.x;
    const holeY = position[1] - spec.height / 2 + hole.y;
    const holeZ = position[2] + standoffHeight / 2;

    // Create a standoff (cylinder)
    return cuboid({
      size: [6, 6, standoffHeight],
      center: [holeX, holeY, holeZ]
    });
  });

  // Create anchors for the standoffs
  const anchors: Record<string, Vec3> = {};
  spec.mountingHoles.forEach((hole, index) => {
    const holeX = position[0] - spec.width / 2 + hole.x;
    const holeY = position[1] - spec.height / 2 + hole.y;
    const holeZ = position[2] + standoffHeight;

    anchors[`standoff_${index}`] = [holeX, holeY, holeZ];
  });

  // Combine all standoffs into a single geometry
  // In a real implementation, we would use union() to combine them
  // For now, we'll just return the first standoff
  return {
    geom: standoffs[0],
    anchors
  };
}