/**
 * PC industry standards and specifications
 * This file contains standardized dimensions for PC components
 */

// Motherboard form factors
export interface MotherboardSpec {
  name: string;
  width: number;
  height: number;
  thickness: number;
  mountingHoles: { x: number; y: number }[];
  ioShieldWidth: number;
  ioShieldHeight: number;
}

export const motherboardStandards: Record<string, MotherboardSpec> = {
  ATX: {
    name: 'ATX',
    width: 305,
    height: 244,
    thickness: 1.6,
    mountingHoles: [
      { x: 6.35, y: 6.35 },
      { x: 6.35, y: 193.68 },
      { x: 146.05, y: 193.68 },
      { x: 146.05, y: 6.35 },
      { x: 226.06, y: 6.35 },
      { x: 226.06, y: 193.68 },
      { x: 298.45, y: 193.68 },
      { x: 298.45, y: 6.35 },
      { x: 298.45, y: 116.84 }
    ],
    ioShieldWidth: 158.75,
    ioShieldHeight: 44.45
  },
  microATX: {
    name: 'microATX',
    width: 244,
    height: 244,
    thickness: 1.6,
    mountingHoles: [
      { x: 6.35, y: 6.35 },
      { x: 6.35, y: 193.68 },
      { x: 146.05, y: 193.68 },
      { x: 146.05, y: 6.35 },
      { x: 226.06, y: 6.35 },
      { x: 226.06, y: 193.68 },
      { x: 237.49, y: 193.68 },
      { x: 237.49, y: 6.35 }
    ],
    ioShieldWidth: 158.75,
    ioShieldHeight: 44.45
  },
  miniITX: {
    name: 'Mini-ITX',
    width: 170,
    height: 170,
    thickness: 1.6,
    mountingHoles: [
      { x: 6.35, y: 6.35 },
      { x: 6.35, y: 163.65 },
      { x: 163.65, y: 163.65 },
      { x: 163.65, y: 6.35 }
    ],
    ioShieldWidth: 158.75,
    ioShieldHeight: 44.45
  }
};

// Power supply form factors
export interface PowerSupplySpec {
  name: string;
  width: number;
  height: number;
  length: number;
  mountingHoles: { x: number; y: number }[];
  fanDiameter?: number;
  fanPosition?: { x: number; y: number; z: number };
  connectorPosition?: { x: number; y: number; z: number };
}

export const powerSupplyStandards: Record<string, PowerSupplySpec> = {
  ATX: {
    name: 'ATX',
    width: 150,
    height: 86,
    length: 140,
    mountingHoles: [
      { x: 10, y: 10 },
      { x: 10, y: 76 },
      { x: 140, y: 10 },
      { x: 140, y: 76 }
    ],
    fanDiameter: 80,
    fanPosition: { x: 75, y: 43, z: 0 }
  },
  SFX: {
    name: 'SFX',
    width: 125,
    height: 63.5,
    length: 100,
    mountingHoles: [
      { x: 10, y: 10 },
      { x: 10, y: 53.5 },
      { x: 115, y: 10 },
      { x: 115, y: 53.5 }
    ],
    fanDiameter: 60,
    fanPosition: { x: 62.5, y: 31.75, z: 0 }
  },
  FlexATX: {
    name: 'Flex ATX',
    width: 81.5,
    height: 40.5,
    length: 150,
    mountingHoles: [
      { x: 10, y: 10 },
      { x: 10, y: 30.5 },
      { x: 71.5, y: 10 },
      { x: 71.5, y: 30.5 }
    ],
    fanDiameter: 40,
    fanPosition: { x: 40.75, y: 20.25, z: 0 }
  }
};

// Fan sizes
export interface FanSpec {
  name: string;
  size: number;
  thickness: number;
  mountingHoleDistance: number;
  mountingHoleDiameter: number;
}

export const fanStandards: Record<string, FanSpec> = {
  fan40mm: {
    name: '40mm',
    size: 40,
    thickness: 10,
    mountingHoleDistance: 32,
    mountingHoleDiameter: 3
  },
  fan80mm: {
    name: '80mm',
    size: 80,
    thickness: 25,
    mountingHoleDistance: 71.5,
    mountingHoleDiameter: 4
  },
  fan92mm: {
    name: '92mm',
    size: 92,
    thickness: 25,
    mountingHoleDistance: 82.5,
    mountingHoleDiameter: 4
  },
  fan120mm: {
    name: '120mm',
    size: 120,
    thickness: 25,
    mountingHoleDistance: 105,
    mountingHoleDiameter: 4.5
  },
  fan140mm: {
    name: '140mm',
    size: 140,
    thickness: 25,
    mountingHoleDistance: 124.5,
    mountingHoleDiameter: 4.5
  }
};

// Storage drive specifications
export interface StorageDriveSpec {
  name: string;
  width: number;
  height: number;
  length: number;
  mountingHoles: { x: number; y: number; z: number }[];
}

export const storageDriveStandards: Record<string, StorageDriveSpec> = {
  hdd35inch: {
    name: '3.5" HDD',
    width: 101.6,
    height: 26.1,
    length: 147.0,
    mountingHoles: [
      { x: 0, y: 0, z: 0 },
      { x: 0, y: 0, z: 26.1 },
      { x: 101.6, y: 0, z: 0 },
      { x: 101.6, y: 0, z: 26.1 },
      { x: 0, y: 147.0, z: 0 },
      { x: 0, y: 147.0, z: 26.1 },
      { x: 101.6, y: 147.0, z: 0 },
      { x: 101.6, y: 147.0, z: 26.1 }
    ]
  },
  hdd25inch: {
    name: '2.5" HDD/SSD',
    width: 69.85,
    height: 9.5,
    length: 100.0,
    mountingHoles: [
      { x: 0, y: 0, z: 0 },
      { x: 69.85, y: 0, z: 0 },
      { x: 0, y: 100.0, z: 0 },
      { x: 69.85, y: 100.0, z: 0 }
    ]
  },
  m2: {
    name: 'M.2 SSD',
    width: 22,
    height: 3.5,
    length: 80, // Can be 30, 42, 60, 80, or 110
    mountingHoles: [
      { x: 0, y: 0, z: 0 },
      { x: 0, y: 80, z: 0 }
    ]
  }
};

// PCI expansion card specifications
export interface PCIExpansionSpec {
  name: string;
  slotWidth: number;
  slotHeight: number;
  slotSpacing: number;
  bracketHeight: number;
  bracketWidth: number;
}

export const pciExpansionStandards: PCIExpansionSpec = {
  name: 'PCI Express',
  slotWidth: 15.0,
  slotHeight: 11.15,
  slotSpacing: 20.32, // Standard spacing between PCI slots
  bracketHeight: 120.0,
  bracketWidth: 18.42
};

// Case standards
export interface CaseSpec {
  name: string;
  maxMotherboardSize: string;
  maxPSUSize: string;
  maxGPULength: number;
  maxCPUCoolerHeight: number;
  expansionSlots: number;
  supportedFans: string[];
  supportedRadiators: string[];
}

export const caseFormFactors: Record<string, CaseSpec> = {
  fullTower: {
    name: 'Full Tower',
    maxMotherboardSize: 'ATX',
    maxPSUSize: 'ATX',
    maxGPULength: 400,
    maxCPUCoolerHeight: 180,
    expansionSlots: 7,
    supportedFans: ['fan120mm', 'fan140mm'],
    supportedRadiators: ['120mm', '240mm', '280mm', '360mm']
  },
  midTower: {
    name: 'Mid Tower',
    maxMotherboardSize: 'ATX',
    maxPSUSize: 'ATX',
    maxGPULength: 330,
    maxCPUCoolerHeight: 160,
    expansionSlots: 7,
    supportedFans: ['fan120mm', 'fan140mm'],
    supportedRadiators: ['120mm', '240mm', '280mm']
  },
  miniTower: {
    name: 'Mini Tower',
    maxMotherboardSize: 'microATX',
    maxPSUSize: 'ATX',
    maxGPULength: 300,
    maxCPUCoolerHeight: 150,
    expansionSlots: 4,
    supportedFans: ['fan120mm'],
    supportedRadiators: ['120mm', '240mm']
  },
  sffpc: {
    name: 'Small Form Factor',
    maxMotherboardSize: 'miniITX',
    maxPSUSize: 'SFX',
    maxGPULength: 300,
    maxCPUCoolerHeight: 70,
    expansionSlots: 2,
    supportedFans: ['fan80mm', 'fan92mm', 'fan120mm'],
    supportedRadiators: ['120mm', '240mm']
  }
};

// Material specifications
export interface MaterialSpec {
  name: string;
  thickness: number;
  color: string;
  density: number; // g/cm³
}

export const materialOptions: Record<string, MaterialSpec> = {
  aluminum3mm: {
    name: 'Aluminum 3mm',
    thickness: 3,
    color: '#A9A9A9',
    density: 2.7
  },
  aluminum5mm: {
    name: 'Aluminum 5mm',
    thickness: 5,
    color: '#A9A9A9',
    density: 2.7
  },
  acrylic3mm: {
    name: 'Acrylic 3mm',
    thickness: 3,
    color: '#B5D3E7',
    density: 1.18
  },
  acrylic5mm: {
    name: 'Acrylic 5mm',
    thickness: 5,
    color: '#B5D3E7',
    density: 1.18
  }
};