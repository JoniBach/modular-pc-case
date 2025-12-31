import { writable, derived } from 'svelte/store';
import { defaultConfig } from './config/defaults';
import type { Geom3 } from '@jscad/modeling/src/geometries/types';

// Define the main configuration store
export const config = writable({ ...defaultConfig });

// Define the current view mode
export const viewMode = writable<'configure' | 'preview' | 'export'>('configure');

// Define the current tab in the configuration panel
export const configTab = writable<'dimensions' | 'components' | 'appearance' | 'mounting' | 'ventilation' | 'io'>('dimensions');

// Store for the generated geometry
export interface GeneratedGeometry {
  case?: Geom3;
  panels?: {
    front?: Geom3;
    back?: Geom3;
    top?: Geom3;
    bottom?: Geom3;
    left?: Geom3;
    right?: Geom3;
  };
  components?: {
    motherboard?: Geom3;
    psu?: Geom3;
    fans?: Geom3[];
    drives?: Geom3[];
  };
  isGenerating: boolean;
  lastUpdated: Date | null;
}

export const geometry = writable<GeneratedGeometry>({
  isGenerating: false,
  lastUpdated: null
});

// Store for UI state
export const uiState = writable({
  isSidebarOpen: true,
  isExporting: false,
  showGrid: true,
  showAxes: true,
  cameraPosition: { x: 0, y: 0, z: 500 },
  cameraTarget: { x: 0, y: 0, z: 0 },
  zoom: 1
});

// Store for export status
export const exportStatus = writable({
  inProgress: false,
  progress: 0,
  error: null as string | null,
  downloadUrl: null as string | null
});

// Derived store for the total case dimensions
export const caseDimensions = derived(
  config,
  $config => {
    const { width, height, depth } = $config.dimensions;
    return { width, height, depth };
  }
);

// Derived store for the selected motherboard
export const selectedMotherboard = derived(
  config,
  $config => {
    return $config.components.motherboard;
  }
);

// Derived store for the selected power supply
export const selectedPowerSupply = derived(
  config,
  $config => {
    return $config.components.powerSupply;
  }
);

// Derived store for the selected material
export const selectedMaterial = derived(
  config,
  $config => {
    return $config.components.material;
  }
);

// Derived store for the total fan count
export const totalFanCount = derived(
  config,
  $config => {
    const { frontFans, topFans, rearFans, bottomFans } = $config.components;
    return (frontFans?.length || 0) + 
           (topFans?.length || 0) + 
           (rearFans?.length || 0) + 
           (bottomFans?.length || 0);
  }
);

// Helper function to update a specific part of the configuration
export function updateConfig<K extends keyof typeof defaultConfig>(
  section: K,
  updates: Partial<typeof defaultConfig[K]>
) {
  config.update(current => {
    return {
      ...current,
      [section]: {
        ...current[section],
        ...updates
      }
    };
  });
}

// Reset the configuration to defaults
export function resetConfig() {
  config.set({ ...defaultConfig });
}

// Toggle the sidebar
export function toggleSidebar() {
  uiState.update(state => ({
    ...state,
    isSidebarOpen: !state.isSidebarOpen
  }));
}

// Set the camera position
export function setCameraPosition(x: number, y: number, z: number) {
  uiState.update(state => ({
    ...state,
    cameraPosition: { x, y, z }
  }));
}

// Set the camera target
export function setCameraTarget(x: number, y: number, z: number) {
  uiState.update(state => ({
    ...state,
    cameraTarget: { x, y, z }
  }));
}

// Set the zoom level
export function setZoom(zoom: number) {
  uiState.update(state => ({
    ...state,
    zoom
  }));
}

// Toggle grid visibility
export function toggleGrid() {
  uiState.update(state => ({
    ...state,
    showGrid: !state.showGrid
  }));
}

// Toggle axes visibility
export function toggleAxes() {
  uiState.update(state => ({
    ...state,
    showAxes: !state.showAxes
  }));
}

// Set the geometry generation status
export function setGeneratingStatus(isGenerating: boolean) {
  geometry.update(current => ({
    ...current,
    isGenerating
  }));
}

// Update the generated geometry
export function updateGeometry(newGeometry: Partial<GeneratedGeometry>) {
  geometry.update(current => ({
    ...current,
    ...newGeometry,
    lastUpdated: new Date()
  }));
}

// Set the export status
export function setExportStatus(status: Partial<{
  inProgress: boolean;
  progress: number;
  error: string | null;
  downloadUrl: string | null;
}>) {
  exportStatus.update(current => ({
    ...current,
    ...status
  }));
}