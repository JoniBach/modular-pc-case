<script lang="ts">
  import { onMount } from 'svelte';
  import { uiState, geometry } from '$lib/store';
  import ThreeJSViewer from './ThreeJSViewer.svelte';
  
  // This component now serves as a wrapper for the ThreeJSViewer
  // We can add additional functionality here if needed
</script>

<div class="viewer-container">
  <ThreeJSViewer />
</div>

<style>
  .viewer-container {
    position: relative;
    width: 100%;
    height: 100%;
    background-color: #2a2a2a;
    overflow: hidden;
  }
</style>