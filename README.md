# Modular PC Case Configurator

## Overview

This project is a web-based parametric configurator for designing a modular PC case. It allows users to interactively adjust dimensions, standards, and module options, preview the result in 3D, and export manufacturing-ready STL files — all directly in the browser.

The system is built around a **code-driven CAD pipeline**, not traditional feature-tree CAD. Geometry is generated procedurally using JavaScript, while the UI is implemented in Svelte.

This approach enables:

- Fully custom web configuration
- Deterministic, reproducible geometry
- Clear separation between design logic and UI
- Easy future migration to other CAD backends if needed

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/modular-pc-case.git
cd modular-pc-case

# Install dependencies
npm install

# Start the development server
npm run dev
```

### Usage

Once the development server is running, open your browser and navigate to `http://localhost:5173` (or the port shown in your terminal). You'll be presented with the configurator interface.

1. Use the top navigation to switch between **Configure**, **3D Preview**, and **Export** modes
2. In **Configure** mode, use the sidebar to navigate between different configuration categories
3. Adjust parameters using sliders, dropdowns, and checkboxes
4. Switch to **3D Preview** to see your design in real-time
5. Use **Export** to generate STL files for manufacturing

---

## Core Goals

- **Parametric, modular design** — Panels, frames, mounts, and sub-assemblies are composable
- **Browser-based** — No local CAD software required
- **Manufacturing-oriented** — Outputs watertight STL files suitable for CNC, laser cutting, or 3D printing
- **Extensible** — New standards (ATX, mATX, ITX), modules, and constraints can be added incrementally

---

## Key Design Philosophy

### Code is the CAD

Instead of sketches, planes, and constraints:

- Geometry is defined as pure functions
- Relationships are encoded via anchors and reference frames
- Assemblies are composed programmatically

This makes the model:

- Predictable
- Testable
- Easy to refactor
- Easy to drive from UI state

### Strict Separation of Concerns

The project is intentionally split into layers:

| Layer        | Responsibility                          |
| ------------ | --------------------------------------- |
| CAD layer    | Generate parametric geometry            |
| Config layer | Define standards, defaults, and rules   |
| UI layer     | User interaction and visualization      |
| Export layer | Convert geometry to files               |

> No UI logic exists in the CAD layer, and no geometry logic exists in the UI.

---

## Technology Stack

### Frontend

- **SvelteKit** – application framework and UI
- **TypeScript** – type safety and clarity
- **Three.js** (via Threlte) – 3D rendering

### CAD & Geometry

- **OpenJSCAD** (`@jscad/modeling`) – procedural solid modeling
- **@jscad/io** – STL export

### Why OpenJSCAD?

- Runs fully in JavaScript
- Works in the browser
- Parametric by nature
- Well-suited for modular, extruded mechanical parts

> **Note:** This project intentionally does not attempt to replicate feature-tree CAD (e.g. Onshape). Instead, it embraces procedural modeling.

---

## Project Architecture

```
src/
├─ cad/                    # Pure parametric CAD logic
│  ├─ primatives/          # Basic building blocks
│  │  ├─ panel.ts          # Panel primitive with holes and cutouts
│  │  ├─ holePattern.ts    # Hole patterns (grid, fan mounts)
│  │  └─ fillet.ts         # Rounded edges for panels
│  ├─ assemblies/          # Higher-level composed geometry
│  │  ├─ motherboard.ts    # Motherboard with standoffs
│  │  └─ case.ts           # Complete case assembly
│  ├─ anchors.ts           # Anchor & attachment helpers
│  └─ index.ts             # CAD exports
│
├─ lib/
│  ├─ components/          # Svelte UI components
│  │  ├─ Header.svelte     # Top navigation
│  │  ├─ Sidebar.svelte    # Configuration categories
│  │  ├─ Configurator.svelte # Configuration controls
│  │  ├─ Viewer3D.svelte   # 3D viewer wrapper
│  │  ├─ ThreeJSViewer.svelte # Three.js implementation
│  │  └─ ExportPanel.svelte # Export options and controls
│  ├─ config/              # Standards & defaults
│  │  ├─ standards.ts      # PC hardware standards
│  │  └─ defaults.ts       # Default configuration values
│  ├─ jscad/               # CAD ↔ rendering / export helpers
│  │  ├─ toMesh.ts         # Convert JSCAD to Three.js
│  │  ├─ exportSTL.ts      # STL export functionality
│  │  ├─ modelGenerator.ts # Generate Three.js models
│  │  └─ simplifiedCad.ts  # Simplified CAD components
│  ├─ types/               # TypeScript type definitions
│  └─ store.ts             # Application state
│
├─ routes/
│  └─ +page.svelte         # Main application layout
```

---

## The CAD Layer (`/cad`)

### Purpose

The CAD layer defines **what the product is**, independent of how it is displayed or configured.

### Characteristics

- No Svelte imports
- No DOM access
- No global state
- Pure functions only

### Pattern Used

Most CAD functions return:

```typescript
{
  geom: Geometry,
  anchors: { [name: string]: Vec3 }
}
```

This allows:

- Mate-like behavior
- Clean assembly logic
- Reusable sub-modules

### Anchors

Anchors act like mate connectors or reference points in traditional CAD:

- Named
- Predictable
- Relative to local geometry

Assemblies are built by aligning anchors rather than hard-coding positions.

### CAD Components

#### Primitives

1. **Panel (`panel.ts`)**
   - The fundamental building block of the case
   - Configurable width, height, and thickness
   - Support for holes, cutouts, and rounded corners
   - Generates anchors at corners and center points

2. **Hole Pattern (`holePattern.ts`)**
   - Creates patterns of holes for mounting components
   - Supports grid patterns for general use
   - Specialized patterns for fan mounts (120mm, 140mm)
   - Used for motherboard mounting, fan placement, etc.

3. **Fillet (`fillet.ts`)**
   - Creates rounded edges for panels
   - Improves aesthetics and safety
   - Configurable radius and position

#### Assemblies

1. **Motherboard (`motherboard.ts`)**
   - Creates a motherboard model with correct dimensions
   - Includes mounting holes based on form factor (ATX, microATX, miniITX)
   - Generates standoffs at appropriate positions
   - Optional IO shield
   - Provides anchors for component positioning

2. **Case (`case.ts`)**
   - Assembles panels into a complete case
   - Configurable dimensions, material, and features
   - Supports different panel types (solid, mesh, window)
   - Integrates internal components (motherboard, PSU)
   - Generates anchors for external connections

### Integration Flow

The integration of CAD components follows this flow:

1. **Configuration** - User sets parameters via the UI
2. **Generation** - CAD functions create geometry based on parameters
3. **Assembly** - Components are positioned using the anchor system
4. **Conversion** - JSCAD geometry is converted to Three.js format
5. **Rendering** - Three.js displays the model in the browser
6. **Export** - STL files are generated for manufacturing

This approach allows for a highly modular and extensible design system where components can be easily added, modified, or replaced without affecting the rest of the application.

---

## The Config Layer (`/lib/config`)

This layer defines:

- Industry standards (ATX, mATX, ITX)
- Known dimensions (PSU sizes, fan spacing)
- Default values

This keeps standards data out of geometry code, making it easier to:

- Add new form factors
- Validate user input
- Reuse the same CAD logic across configurations

---

## The UI Layer (`/lib/components` and `/routes`)

The UI layer is built with SvelteKit and consists of several key components:

### Main Components

1. **Header (`Header.svelte`)**
   - Top navigation bar
   - Switches between Configure, 3D Preview, and Export modes
   - Controls the main application flow

2. **Sidebar (`Sidebar.svelte`)**
   - Navigation for configuration categories
   - Collapsible for better space utilization
   - Categories include Dimensions, Components, Appearance, etc.

3. **Configurator (`Configurator.svelte`)**
   - Main configuration interface
   - Dynamic controls based on selected category
   - Includes sliders, dropdowns, checkboxes, and color pickers
   - Directly updates the application state

4. **Viewer3D (`Viewer3D.svelte` and `ThreeJSViewer.svelte`)**
   - 3D visualization of the case design
   - Interactive camera controls (orbit, pan, zoom)
   - Grid and axes helpers for orientation
   - Real-time updates as configuration changes

5. **ExportPanel (`ExportPanel.svelte`)**
   - Export options and controls
   - File format selection
   - Quality settings
   - Progress indication during export
   - Download links for generated files

### State Management

The application state is managed through Svelte stores (`store.ts`):

- **config** - Holds all configuration parameters
- **viewMode** - Tracks current view (configure, preview, export)
- **configTab** - Tracks active configuration category
- **geometry** - Stores generated geometry data
- **uiState** - UI-specific state (sidebar open/closed, grid visibility)
- **exportStatus** - Export progress and results

Svelte's reactivity model maps naturally to parametric CAD:

> State changes → geometry regenerates → preview updates

---

## Rendering Pipeline

The rendering pipeline converts CAD geometry to visual 3D models:

### Standard Pipeline

1. **CAD Generation**
   - CAD functions generate OpenJSCAD geometry (`Geom3` objects)
   - Geometry includes solid models with faces and vertices

2. **Conversion**
   - `toMesh.ts` converts JSCAD geometry to Three.js format
   - Extracts vertices, normals, and indices
   - Creates buffer data suitable for GPU rendering

3. **Material Application**
   - Materials are created based on configuration
   - Properties like color, transparency, metalness are applied
   - Different materials for different components (case, motherboard, PSU)

4. **Three.js Rendering**
   - Three.js creates meshes from geometry and materials
   - Scene is set up with lighting and camera
   - OrbitControls enable user interaction
   - Animation loop updates the view

### Simplified Pipeline

To address JSCAD import challenges, a simplified pipeline was implemented:

1. **Direct Three.js Creation**
   - `simplifiedCad.ts` creates Three.js geometries directly
   - Bypasses JSCAD conversion for better compatibility
   - Maintains visual fidelity for the configurator

2. **Component Generation**
   - Case panels are created with proper dimensions and positions
   - Internal components (motherboard, PSU) are generated
   - Materials are applied based on configuration

3. **Assembly**
   - Components are positioned within the case
   - Updates reactively when configuration changes

This dual approach ensures the application works reliably while maintaining the architectural separation between CAD logic and rendering.

---

## Export Pipeline

### STL Export

The application currently supports client-side STL export:

1. **User Configuration**
   - User selects export options (quality, units)
   - Initiates export process via the Export panel

2. **Geometry Processing**
   - Current case geometry is retrieved from the store
   - Optional processing (like simplification) may be applied

3. **STL Generation**
   - `exportSTL.ts` converts JSCAD geometry to STL format
   - Binary STL format is used for efficiency
   - Quality settings control the level of detail

4. **File Delivery**
   - Generated STL is packaged as a downloadable Blob
   - User receives a download link
   - File can be saved locally for manufacturing

### Future Export Options

Planned or possible future export options include:

- **STEP Export** - Industry-standard CAD format (may require server-side processing)
- **DXF Export** - For flat panels suitable for laser cutting
- **BOM Generation** - Bill of materials for ordering parts
- **Cut-List Generation** - For efficient material usage
- **Assembly Instructions** - Step-by-step guide for building

---

## Development Guide

### Adding New Components

To add a new component to the system:

1. **Create the CAD Component**
   - Add a new file in `/cad/primatives` or `/cad/assemblies`
   - Implement the component using OpenJSCAD functions
   - Return a `GeometryWithAnchors` object
   - Export the component in `/cad/index.ts`

2. **Update Configuration**
   - Add relevant standards in `/lib/config/standards.ts`
   - Add default values in `/lib/config/defaults.ts`
   - Update the store types if necessary

3. **Add UI Controls**
   - Add controls to the appropriate section in `Configurator.svelte`
   - Connect the controls to the store using `bind:value` and `updateConfig`

4. **Update the 3D Viewer**
   - Add the component to the case assembly in `case.ts`
   - Add a simplified version in `simplifiedCad.ts` if needed

### Modifying Existing Components

To modify an existing component:

1. Locate the component in the appropriate directory
2. Update the parameters, geometry, or anchors as needed
3. Test the changes in the 3D viewer
4. Verify that the export functionality still works

### Troubleshooting

**JSCAD Import Issues**

If you encounter issues with JSCAD imports:

```typescript
// Instead of this:
import { cuboid } from '@jscad/modeling/src/primitives';

// Use this:
import primitivesPkg from '@jscad/modeling/src/primitives';
const { cuboid } = primitivesPkg;
```

**Three.js Type Errors**

If you encounter Three.js type errors:

1. Ensure `@types/three` is installed
2. Check the type definitions in `/lib/types/three-extensions.d.ts`
3. Update the type definitions as needed

**Rendering Performance**

To improve rendering performance:

1. Simplify geometry for preview mode
2. Use lower polygon counts for non-critical components
3. Implement level-of-detail switching based on camera distance

## Current Limitations (By Design)

- No sketch constraints
- No feature tree
- No STEP export (client-side)
- No automatic filleting

These are trade-offs made in favor of:

- Simplicity
- Browser execution
- Explicit geometry control

---

## Future Directions

Possible extensions include:

- DXF import for panel profiles
- Server-side CAD backend (CadQuery / Onshape API)
- Assembly validation rules
- Preset configurations
- Manufacturing cost estimation
- Support for additional PC components (GPUs, cooling solutions)
- Advanced ventilation pattern generation
- Material cost calculator

---

## Intended Audience

This project is aimed at:

- Makers and DIY PC builders
- Developers interested in web-based CAD
- Engineers exploring procedural modeling
- Anyone building configurable physical products online

---

## Summary

The Modular PC Case Configurator demonstrates a powerful approach to web-based parametric design. By treating **CAD as code** rather than a GUI artifact, it achieves a level of flexibility and extensibility that traditional CAD systems struggle to match.

Key innovations include:

- **Anchor-based assembly** for intuitive component positioning
- **Strict separation of concerns** between CAD, configuration, and UI
- **Reactive rendering pipeline** that updates in real-time
- **Browser-based workflow** from design to manufacturing

By combining:

- Procedural geometry (OpenJSCAD)
- Reactive UI (Svelte)
- Web-native rendering (Three.js)

...the project creates a flexible foundation for modern, web-first product configurators that can be extended to many other domains beyond PC cases.