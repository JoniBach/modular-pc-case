# Modular PC Case Configurator

## Overview

This project is a web-based parametric configurator for designing a modular PC case. It allows users to interactively adjust dimensions, standards, and module options, preview the result in 3D, and export manufacturing-ready STL files — all directly in the browser.

The system is built around a **code-driven CAD pipeline**, not traditional feature-tree CAD. Geometry is generated procedurally using JavaScript, while the UI is implemented in Svelte.

This approach enables:

- Fully custom web configuration
- Deterministic, reproducible geometry
- Clear separation between design logic and UI
- Easy future migration to other CAD backends if needed

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
│  ├─ primitives/          # Basic building blocks (panels, holes, brackets)
│  ├─ assemblies/          # Higher-level composed geometry
│  ├─ anchors.ts           # Anchor & attachment helpers
│  └─ index.ts             # CAD exports
│
├─ lib/
│  ├─ config/              # Standards & defaults (ATX, PSU sizes, etc.)
│  ├─ jscad/               # CAD ↔ rendering / export helpers
│  └─ store.ts             # Application state
│
├─ routes/
│  └─ +page.svelte         # Main configurator UI
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

## The UI Layer (`/routes`)

The UI:

- Exposes configuration options (sliders, dropdowns, toggles)
- Stores state reactively
- Triggers CAD regeneration on change
- Displays the resulting geometry in 3D

Svelte's reactivity model maps naturally to parametric CAD:

> State changes → geometry regenerates → preview updates

---

## Rendering Pipeline

1. CAD functions generate OpenJSCAD geometry
2. Geometry is converted to Three.js `BufferGeometry`
3. Threlte renders the mesh in a `<Canvas>`
4. Lower-resolution meshes may be used for preview (future optimization)

---

## Export Pipeline

**Currently supported:**

- STL (client-side)

**Planned / possible future options:**

- Server-side STEP export
- DXF export for flat panels
- BOM / cut-list generation

---

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

---

## Intended Audience

This project is aimed at:

- Makers and DIY PC builders
- Developers interested in web-based CAD
- Engineers exploring procedural modeling
- Anyone building configurable physical products online

---

## Summary

This project treats **CAD as code**, not as a GUI artifact.

By combining:

- Procedural geometry (OpenJSCAD)
- Reactive UI (Svelte)
- Web-native rendering (Three.js)

…it creates a flexible foundation for a modern, web-first product configurator.