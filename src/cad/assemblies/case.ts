import { cuboid } from '@jscad/modeling/src/primitives';
import { subtract, union } from '@jscad/modeling/src/operations/booleans';
import { translate } from '@jscad/modeling/src/operations/transforms';
import type { Geom3 } from '@jscad/modeling/src/geometries/types';
import { createPanelAnchors, type GeometryWithAnchors, type Vec3 } from '../anchors';
import { createPanel, createPanelWithCutout } from '../primatives/panel';
import { addPanelFillets } from '../primatives/fillet';
import { createMotherboard, createMotherboardStandoffs } from './motherboard';
import { materialOptions } from '../../lib/config/standards';

export interface CaseOptions {
  width: number;
  height: number;
  depth: number;
  panelThickness: number;
  cornerRadius: number;
  motherboardFormFactor?: 'ATX' | 'microATX' | 'miniITX';
  includeMotherboard?: boolean;
  position?: Vec3;
  material?: string;
  frontPanel?: 'solid' | 'mesh' | 'window';
  topPanel?: 'solid' | 'mesh' | 'window';
  sidePanel?: 'solid' | 'mesh' | 'window';
  rearPanel?: 'solid' | 'mesh';
  bottomPanel?: 'solid' | 'mesh';
}

/**
 * Creates a PC case with panels and optional components
 */
export function createCase(options: CaseOptions): GeometryWithAnchors {
  const {
    width,
    height,
    depth,
    panelThickness,
    cornerRadius,
    motherboardFormFactor = 'microATX',
    includeMotherboard = false,
    position = [0, 0, 0],
    material = 'aluminum3mm',
    frontPanel = 'solid',
    topPanel = 'solid',
    sidePanel = 'solid',
    rearPanel = 'solid',
    bottomPanel = 'solid'
  } = options;

  // Get material thickness from config if available
  const materialThickness = materialOptions[material]?.thickness || panelThickness;

  // Create the case panels
  const panels = createCasePanels({
    width,
    height,
    depth,
    thickness: materialThickness,
    cornerRadius,
    position,
    frontPanel,
    topPanel,
    sidePanel,
    rearPanel,
    bottomPanel
  });

  // Create the motherboard if requested
  let motherboardAssembly: GeometryWithAnchors | null = null;
  let standoffsAssembly: GeometryWithAnchors | null = null;

  if (includeMotherboard && motherboardFormFactor) {
    // Position the motherboard inside the case
    // We'll place it on the back panel with some margin
    const motherboardPosition: Vec3 = [
      position[0],
      position[1],
      position[2] - depth / 2 + 20 // 20mm from the back panel
    ];

    // Create motherboard standoffs
    standoffsAssembly = createMotherboardStandoffs({
      formFactor: motherboardFormFactor,
      position: motherboardPosition,
      standoffHeight: 10
    });

    // Create the motherboard
    motherboardAssembly = createMotherboard({
      formFactor: motherboardFormFactor,
      position: motherboardPosition,
      standoffHeight: 10,
      includeIoShield: true
    });
  }

  // Combine all geometries
  // In a real implementation, we would use union() to combine them
  // For now, we'll just return the panels
  const finalGeometry = panels.geom;

  // Create anchors for the case
  const caseAnchors = createPanelAnchors(width, height, depth, position);

  // Add additional anchors specific to the case
  const additionalAnchors: Record<string, Vec3> = {
    // Front panel center
    frontPanelCenter: [
      position[0],
      position[1] + depth / 2,
      position[2]
    ],
    // Rear panel center
    rearPanelCenter: [
      position[0],
      position[1] - depth / 2,
      position[2]
    ],
    // Top panel center
    topPanelCenter: [
      position[0],
      position[1],
      position[2] + height / 2
    ],
    // Bottom panel center
    bottomPanelCenter: [
      position[0],
      position[1],
      position[2] - height / 2
    ],
    // Left side panel center
    leftPanelCenter: [
      position[0] - width / 2,
      position[1],
      position[2]
    ],
    // Right side panel center
    rightPanelCenter: [
      position[0] + width / 2,
      position[1],
      position[2]
    ]
  };

  // Add motherboard anchors if available
  if (motherboardAssembly) {
    Object.entries(motherboardAssembly.anchors).forEach(([key, value]) => {
      additionalAnchors[`motherboard_${key}`] = value;
    });
  }

  // Combine all anchors
  const anchors = {
    ...caseAnchors,
    ...additionalAnchors
  };

  return {
    geom: finalGeometry,
    anchors
  };
}

interface CasePanelsOptions {
  width: number;
  height: number;
  depth: number;
  thickness: number;
  cornerRadius: number;
  position: Vec3;
  frontPanel: 'solid' | 'mesh' | 'window';
  topPanel: 'solid' | 'mesh' | 'window';
  sidePanel: 'solid' | 'mesh' | 'window';
  rearPanel: 'solid' | 'mesh';
  bottomPanel: 'solid' | 'mesh';
}

/**
 * Creates the panels for a PC case
 */
function createCasePanels(options: CasePanelsOptions): GeometryWithAnchors {
  const {
    width,
    height,
    depth,
    thickness,
    cornerRadius,
    position,
    frontPanel,
    topPanel,
    sidePanel,
    rearPanel,
    bottomPanel
  } = options;

  // Create the front panel
  const frontPanelGeom = createPanel({
    width,
    height,
    thickness,
    position: [position[0], position[1] + depth / 2, position[2]],
    cornerRadius,
    holes: []
  });

  // Create the rear panel
  const rearPanelGeom = createPanel({
    width,
    height,
    thickness,
    position: [position[0], position[1] - depth / 2, position[2]],
    cornerRadius,
    holes: []
  });

  // Create the top panel
  const topPanelGeom = createPanel({
    width,
    height: depth, // Use depth as the height for top panel
    thickness,
    position: [position[0], position[1], position[2] + height / 2],
    cornerRadius,
    holes: []
  });

  // Create the bottom panel
  const bottomPanelGeom = createPanel({
    width,
    height: depth, // Use depth as the height for bottom panel
    thickness,
    position: [position[0], position[1], position[2] - height / 2],
    cornerRadius,
    holes: []
  });

  // Create the left side panel
  const leftPanelGeom = createPanel({
    width: depth,
    height,
    thickness,
    position: [position[0] - width / 2, position[1], position[2]],
    cornerRadius,
    holes: []
  });

  // Create the right side panel
  const rightPanelGeom = createPanel({
    width: depth,
    height,
    thickness,
    position: [position[0] + width / 2, position[1], position[2]],
    cornerRadius,
    holes: []
  });

  // Apply fillets to panels if cornerRadius > 0
  // In a real implementation, we would apply fillets to all panels
  // For now, we'll skip this step

  // Combine all panels
  // In a real implementation, we would use union() to combine them
  // For now, we'll just return the front panel
  return frontPanelGeom;
}

/**
 * Creates a mesh panel with ventilation holes
 */
function createMeshPanel(
  width: number,
  height: number,
  thickness: number,
  position: Vec3,
  holeSize: number = 5,
  holeSpacing: number = 2
): GeometryWithAnchors {
  // Create the base panel
  const panel = createPanel({
    width,
    height,
    thickness,
    position,
    cornerRadius: 0,
    holes: []
  });

  // In a real implementation, we would create a pattern of holes
  // For now, we'll just return the base panel
  return panel;
}

/**
 * Creates a window panel with a transparent section
 */
function createWindowPanel(
  width: number,
  height: number,
  thickness: number,
  position: Vec3,
  windowWidth: number = 0.8,
  windowHeight: number = 0.8
): GeometryWithAnchors {
  // Calculate window dimensions as a percentage of panel dimensions
  const actualWindowWidth = width * windowWidth;
  const actualWindowHeight = height * windowHeight;

  // Create the panel with a window cutout
  return createPanelWithCutout(
    {
      width,
      height,
      thickness,
      position,
      cornerRadius: 0,
      holes: []
    },
    actualWindowWidth,
    actualWindowHeight
  );
}