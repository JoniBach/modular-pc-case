<script lang="ts">
  import { onMount } from 'svelte';
  import { viewMode, configTab, uiState, config } from '$lib/store';
  import Configurator from '$lib/components/Configurator.svelte';
  import Viewer3D from '$lib/components/Viewer3D.svelte';
  import ExportPanel from '$lib/components/ExportPanel.svelte';
  import Header from '$lib/components/Header.svelte';
  import Sidebar from '$lib/components/Sidebar.svelte';

  let mounted = false;

  onMount(() => {
    mounted = true;
  });
</script>

<svelte:head>
  <title>Modular PC Case Configurator</title>
</svelte:head>

<div class="app">
  <Header />
  
  <main>
    <Sidebar />
    
    <div class="content">
      {#if $viewMode === 'configure'}
        <Configurator />
      {:else if $viewMode === 'preview'}
        <div class="preview-container">
          {#if mounted}
            <Viewer3D />
          {/if}
        </div>
      {:else if $viewMode === 'export'}
        <ExportPanel />
      {/if}
    </div>
  </main>
</div>

<style>
  .app {
    display: flex;
    flex-direction: column;
    height: 100vh;
    width: 100vw;
    overflow: hidden;
  }

  main {
    display: flex;
    flex: 1;
    overflow: hidden;
  }

  .content {
    flex: 1;
    overflow: auto;
    padding: 1rem;
    background-color: #f5f5f5;
  }

  .preview-container {
    width: 100%;
    height: 100%;
    background-color: #2a2a2a;
    border-radius: 4px;
    overflow: hidden;
  }
</style>
