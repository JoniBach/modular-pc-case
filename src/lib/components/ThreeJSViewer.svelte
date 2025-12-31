<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import * as THREE from 'three';
  import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
  import { uiState, geometry, config } from '$lib/store';
  import { createSimplifiedCase, createSimplifiedMotherboard, createSimplifiedPSU } from '$lib/jscad/simplifiedCad';
  
  let container: HTMLDivElement;
  let renderer: THREE.WebGLRenderer;
  let scene: THREE.Scene;
  let camera: THREE.PerspectiveCamera;
  let controls: OrbitControls;
  let animationFrameId: number;
  
  // References to objects in the scene
  let caseMesh: THREE.Mesh;
  let gridHelper: THREE.GridHelper;
  let axesHelper: THREE.AxesHelper;
  
  // Create the scene
  function initScene() {
    // Create scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x2a2a2a);
    
    // Create camera
    const width = container.clientWidth;
    const height = container.clientHeight;
    camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 2000);
    camera.position.set(0, 0, 500);
    
    // Create renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight1.position.set(10, 10, 10);
    scene.add(directionalLight1);
    
    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.4);
    directionalLight2.position.set(-10, -10, -10);
    scene.add(directionalLight2);
    
    // Add grid and axes helpers
    gridHelper = new THREE.GridHelper(1000, 100);
    scene.add(gridHelper);
    
    axesHelper = new THREE.AxesHelper(100);
    scene.add(axesHelper);
    
    // Add orbit controls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    
    // Handle window resize
    const resizeObserver = new ResizeObserver(() => {
      const width = container.clientWidth;
      const height = container.clientHeight;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    });
    
    resizeObserver.observe(container);
    
    // Create initial case model
    createCaseModel();
    
    // Start animation loop
    animate();
    
    return () => {
      resizeObserver.unobserve(container);
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }
  
  // Animation loop
  function animate() {
    animationFrameId = requestAnimationFrame(animate);
    
    // Update controls
    controls.update();
    
    // Update visibility based on UI state
    if (gridHelper) gridHelper.visible = $uiState.showGrid;
    if (axesHelper) axesHelper.visible = $uiState.showAxes;
    
    // Render scene
    renderer.render(scene, camera);
  }
  
  // References to component meshes
  let caseGroup: THREE.Group;
  let motherboardMesh: THREE.Mesh;
  let psuMesh: THREE.Mesh;
  
  // Create or update the case model
  function createCaseModel() {
    // Generate the case geometry based on current config
    try {
      // Remove existing meshes if they exist
      if (caseGroup) scene.remove(caseGroup);
      if (motherboardMesh) scene.remove(motherboardMesh);
      if (psuMesh) scene.remove(psuMesh);
      
      // Generate the case using our simplified CAD components
      caseGroup = createSimplifiedCase({
        width: $config.dimensions.width,
        height: $config.dimensions.height,
        depth: $config.dimensions.depth,
        panelThickness: $config.dimensions.panelThickness,
        cornerRadius: $config.dimensions.cornerRadius,
        material: $config.components.material
      });
      
      // Add the case to the scene
      scene.add(caseGroup);
      
      // Add motherboard
      motherboardMesh = createSimplifiedMotherboard($config.components.motherboard);
      // Position the motherboard inside the case
      motherboardMesh.position.set(
        0, // Centered on X
        0, // Centered on Y
        -$config.dimensions.depth / 4 // Positioned toward the back of the case
      );
      scene.add(motherboardMesh);
      
      // Add PSU
      psuMesh = createSimplifiedPSU($config.components.powerSupply);
      // Position the PSU inside the case
      psuMesh.position.set(
        -$config.dimensions.width / 4, // Positioned toward the left side
        $config.dimensions.depth / 4, // Positioned toward the front
        -$config.dimensions.height / 4 // Positioned toward the bottom
      );
      scene.add(psuMesh);
      
      // Update the geometry store
      geometry.update(g => ({
        ...g,
        isGenerating: false,
        lastUpdated: new Date()
      }));
      
    } catch (error) {
      console.error('Error generating case model:', error);
      
      // Create a placeholder cube if generation fails
      const cubeGeometry = new THREE.BoxGeometry(100, 100, 100);
      const material = new THREE.MeshStandardMaterial({
        color: 0xcccccc,
        metalness: 0.3,
        roughness: 0.7
      });
      
      // Remove existing meshes if they exist
      if (caseGroup) scene.remove(caseGroup);
      
      // Create and add new mesh as a fallback
      caseMesh = new THREE.Mesh(cubeGeometry, material);
      scene.add(caseMesh);
    }
  }
  
  // Reset the camera view
  function resetView() {
    if (camera && controls) {
      camera.position.set(0, 0, 500);
      camera.lookAt(0, 0, 0);
      controls.update();
    }
  }
  
  // Initialize when component mounts
  onMount(() => {
    if (container) {
      const cleanup = initScene();
      return cleanup;
    }
  });
  
  // Update the model when configuration changes
  $: if (scene && $config) {
    createCaseModel();
  }
</script>

<div class="viewer-container" bind:this={container}>
  <div class="controls">
    <button on:click={() => uiState.update(s => ({ ...s, showGrid: !s.showGrid }))}>
      {$uiState.showGrid ? 'Hide Grid' : 'Show Grid'}
    </button>
    <button on:click={() => uiState.update(s => ({ ...s, showAxes: !s.showAxes }))}>
      {$uiState.showAxes ? 'Hide Axes' : 'Show Axes'}
    </button>
    <button on:click={resetView}>
      Reset View
    </button>
  </div>
</div>

<style>
  .viewer-container {
    position: relative;
    width: 100%;
    height: 100%;
    background-color: #2a2a2a;
    overflow: hidden;
  }
  
  .controls {
    position: absolute;
    bottom: 20px;
    right: 20px;
    display: flex;
    gap: 10px;
    z-index: 10;
  }
  
  .controls button {
    background-color: rgba(255, 255, 255, 0.2);
    color: white;
    border: none;
    padding: 8px 12px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.9rem;
    transition: background-color 0.2s;
  }
  
  .controls button:hover {
    background-color: rgba(255, 255, 255, 0.3);
  }
</style>
