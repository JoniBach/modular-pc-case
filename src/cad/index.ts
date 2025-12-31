/**
 * Main entry point for the CAD module
 * Exports all components and utilities for use in the UI
 */

// Export anchors and types
export * from './anchors';

// Export primitives
export { createPanel, createPanelWithCutout } from './primatives/panel';
export { createHolePattern, createHoleGrid, createFanMountPattern } from './primatives/holePattern';
export { createFillet, addPanelFillets } from './primatives/fillet';

// Export assemblies
export { createMotherboard, createMotherboardStandoffs } from './assemblies/motherboard';
export { createCase } from './assemblies/case';

// Re-export JSCAD types for convenience
export type { Geom3 } from '@jscad/modeling/src/geometries/types';

/**
 * Generate a PC case based on the provided configuration
 * This is the main entry point for the CAD generation
 */
import { createCase } from './assemblies/case';
import type { CaseOptions } from './assemblies/case';
import type { GeometryWithAnchors } from './anchors';

export function generatePCCase(config: CaseOptions): GeometryWithAnchors {
  return createCase(config);
}