/**
 * Utilities for converting JSCAD geometries to Three.js meshes
 */
import type { Geom3 } from '@jscad/modeling/src/geometries/types';
import modelingPkg from '@jscad/modeling';
const { geometries } = modelingPkg;

// Define types for triangles
type Point = [number, number, number];
type Triangle = [Point, Point, Point];

/**
 * Creates a set of triangles for a placeholder cube
 * @returns Array of triangles forming a cube
 */
function createPlaceholderTriangles(): Triangle[] {
  return [
    // Front face
    [[-1, -1, 1], [1, -1, 1], [1, 1, 1]],
    [[-1, -1, 1], [1, 1, 1], [-1, 1, 1]],
    // Back face
    [[-1, -1, -1], [-1, 1, -1], [1, 1, -1]],
    [[-1, -1, -1], [1, 1, -1], [1, -1, -1]],
    // Top face
    [[-1, 1, -1], [-1, 1, 1], [1, 1, 1]],
    [[-1, 1, -1], [1, 1, 1], [1, 1, -1]],
    // Bottom face
    [[-1, -1, -1], [1, -1, -1], [1, -1, 1]],
    [[-1, -1, -1], [1, -1, 1], [-1, -1, 1]],
    // Right face
    [[1, -1, -1], [1, 1, -1], [1, 1, 1]],
    [[1, -1, -1], [1, 1, 1], [1, -1, 1]],
    // Left face
    [[-1, -1, -1], [-1, -1, 1], [-1, 1, 1]],
    [[-1, -1, -1], [-1, 1, 1], [-1, 1, -1]]
  ];
}

/**
 * Converts a JSCAD Geom3 to a format suitable for Three.js BufferGeometry
 * @param geometry The JSCAD geometry to convert
 * @returns Object with vertices, normals, and indices arrays
 */
export function geomToBufferData(geometry: Geom3): {
  vertices: number[];
  normals: number[];
  indices: number[];
} {
  // In a production environment, we would extract polygons from the JSCAD geometry
  // and triangulate them. For now, we'll use the geometry's properties if available
  // or fall back to a placeholder cube.
  
  // Arrays to store the buffer data
  const vertices: number[] = [];
  const normals: number[] = [];
  const indices: number[] = [];
  
  let triangles: Triangle[] = [];
  
  // Try to extract polygons from the geometry if it has them
  if (geometry && 'polygons' in geometry && Array.isArray(geometry.polygons)) {
    // Extract triangles from polygons
    try {
      // This is a simplified approach - in a real implementation we'd use
      // proper triangulation from JSCAD
      geometry.polygons.forEach(polygon => {
        if (polygon && 'vertices' in polygon && Array.isArray(polygon.vertices)) {
          // Simple triangulation for convex polygons
          for (let i = 1; i < polygon.vertices.length - 1; i++) {
            triangles.push([
              polygon.vertices[0] as Point,
              polygon.vertices[i] as Point,
              polygon.vertices[i + 1] as Point
            ]);
          }
        }
      });
    } catch (e) {
      console.warn('Failed to extract triangles from geometry:', e);
      // Fall back to placeholder
      triangles = createPlaceholderTriangles();
    }
  } else {
    // Fall back to placeholder if no polygons are available
    triangles = createPlaceholderTriangles();
  }
  
  // Process each triangle
  triangles.forEach((triangle: Triangle, triangleIndex: number) => {
    // Each triangle has 3 points
    const baseIndex = triangleIndex * 3;
    
    // Add the vertices
    for (let i = 0; i < 3; i++) {
      const point = triangle[i];
      vertices.push(point[0], point[1], point[2]);
    }
    
    // Calculate the normal for this triangle
    const a = triangle[0];
    const b = triangle[1];
    const c = triangle[2];
    
    // Calculate vectors from point a to b and a to c
    const ab = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
    const ac = [c[0] - a[0], c[1] - a[1], c[2] - a[2]];
    
    // Calculate the cross product to get the normal
    const normal = [
      ab[1] * ac[2] - ab[2] * ac[1],
      ab[2] * ac[0] - ab[0] * ac[2],
      ab[0] * ac[1] - ab[1] * ac[0]
    ];
    
    // Normalize the normal
    const length = Math.sqrt(normal[0] * normal[0] + normal[1] * normal[1] + normal[2] * normal[2]);
    if (length > 0) {
      normal[0] /= length;
      normal[1] /= length;
      normal[2] /= length;
    }
    
    // Add the normal for each vertex
    for (let i = 0; i < 3; i++) {
      normals.push(normal[0], normal[1], normal[2]);
    }
    
    // Add the indices
    indices.push(baseIndex, baseIndex + 1, baseIndex + 2);
  });
  
  return { vertices, normals, indices };
}

/**
 * Creates a simple placeholder mesh data for testing
 * @returns Object with vertices, normals, and indices arrays for a cube
 */
export function createPlaceholderMesh(): {
  vertices: number[];
  normals: number[];
  indices: number[];
} {
  // Define the vertices of a cube
  const vertices = [
    // Front face
    -1, -1, 1,
    1, -1, 1,
    1, 1, 1,
    -1, 1, 1,
    
    // Back face
    -1, -1, -1,
    -1, 1, -1,
    1, 1, -1,
    1, -1, -1,
    
    // Top face
    -1, 1, -1,
    -1, 1, 1,
    1, 1, 1,
    1, 1, -1,
    
    // Bottom face
    -1, -1, -1,
    1, -1, -1,
    1, -1, 1,
    -1, -1, 1,
    
    // Right face
    1, -1, -1,
    1, 1, -1,
    1, 1, 1,
    1, -1, 1,
    
    // Left face
    -1, -1, -1,
    -1, -1, 1,
    -1, 1, 1,
    -1, 1, -1
  ];
  
  // Define the normals
  const normals = [
    // Front face
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,
    0, 0, 1,
    
    // Back face
    0, 0, -1,
    0, 0, -1,
    0, 0, -1,
    0, 0, -1,
    
    // Top face
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,
    0, 1, 0,
    
    // Bottom face
    0, -1, 0,
    0, -1, 0,
    0, -1, 0,
    0, -1, 0,
    
    // Right face
    1, 0, 0,
    1, 0, 0,
    1, 0, 0,
    1, 0, 0,
    
    // Left face
    -1, 0, 0,
    -1, 0, 0,
    -1, 0, 0,
    -1, 0, 0
  ];
  
  // Define the indices (triangles)
  const indices = [
    0, 1, 2, 0, 2, 3,       // Front face
    4, 5, 6, 4, 6, 7,       // Back face
    8, 9, 10, 8, 10, 11,    // Top face
    12, 13, 14, 12, 14, 15, // Bottom face
    16, 17, 18, 16, 18, 19, // Right face
    20, 21, 22, 20, 22, 23  // Left face
  ];
  
  return { vertices, normals, indices };
}