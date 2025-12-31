/**
 * Default configuration values for the PC case configurator
 */

import { materialOptions, motherboardStandards, powerSupplyStandards, fanStandards } from './standards';

// Default case dimensions
export const defaultCaseDimensions = {
  width: 300,
  height: 400,
  depth: 350,
  panelThickness: materialOptions.aluminum3mm.thickness,
  cornerRadius: 3,
  standoffHeight: 10 // Height of motherboard standoffs
};

// Default component selections
export const defaultComponentSelections = {
  motherboard: motherboardStandards.microATX.name,
  powerSupply: powerSupplyStandards.ATX.name,
  material: materialOptions.aluminum3mm.name,
  frontFans: [fanStandards.fan120mm.name, fanStandards.fan120mm.name],
  topFans: [fanStandards.fan120mm.name],
  rearFans: [fanStandards.fan120mm.name],
  bottomFans: []
};

// Default spacing values
export const defaultSpacing = {
  componentClearance: 5, // Minimum clearance between components
  panelClearance: 2, // Minimum clearance between components and panels
  fanClearance: 10, // Minimum clearance around fans
  cableManagementSpace: 20 // Space reserved for cable management
};

// Default mounting options
export const defaultMountingOptions = {
  motherboardMountType: 'standoff', // standoff or direct
  psuMountType: 'bracket', // bracket or direct
  driveMountType: 'tray', // tray or direct
  fanMountType: 'bracket' // bracket or direct
};

// Default appearance options
export const defaultAppearanceOptions = {
  color: '#A9A9A9', // Default aluminum color
  sidePanel: 'solid', // solid, mesh, or window
  frontPanel: 'mesh', // solid, mesh, or window
  topPanel: 'mesh', // solid, mesh, or window
  rearPanel: 'mesh', // solid or mesh
  bottomPanel: 'solid' // solid or mesh
};

// Default ventilation options
export const defaultVentilationOptions = {
  frontVentilation: true,
  topVentilation: true,
  rearVentilation: true,
  bottomVentilation: false,
  sideVentilation: false,
  ventilationHoleSize: 5,
  ventilationHoleSpacing: 2
};

// Default I/O options
export const defaultIOOptions = {
  frontPorts: {
    usb2: 2,
    usb3: 1,
    usbC: 0,
    audio: true,
    powerButton: true,
    resetButton: true,
    powerLED: true,
    hddLED: true
  }
};

// Default export options
export const defaultExportOptions = {
  format: 'stl',
  quality: 'medium', // low, medium, high
  units: 'mm',
  tolerance: 0.1
};

// Combine all defaults into a single configuration object
export const defaultConfig = {
  dimensions: defaultCaseDimensions,
  components: defaultComponentSelections,
  spacing: defaultSpacing,
  mounting: defaultMountingOptions,
  appearance: defaultAppearanceOptions,
  ventilation: defaultVentilationOptions,
  io: defaultIOOptions,
  export: defaultExportOptions
};