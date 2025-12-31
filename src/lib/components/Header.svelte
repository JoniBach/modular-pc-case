<script lang="ts">
  import { viewMode } from '$lib/store';
  
  function setViewMode(mode: 'configure' | 'preview' | 'export') {
    viewMode.set(mode);
  }
</script>

<header>
  <div class="logo">
    <h1>Modular PC Case</h1>
  </div>
  
  <nav>
    <ul>
      <li class:active={$viewMode === 'configure'}>
        <button on:click={() => setViewMode('configure')}>Configure</button>
      </li>
      <li class:active={$viewMode === 'preview'}>
        <button on:click={() => setViewMode('preview')}>3D Preview</button>
      </li>
      <li class:active={$viewMode === 'export'}>
        <button on:click={() => setViewMode('export')}>Export</button>
      </li>
    </ul>
  </nav>
</header>

<style>
  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 1rem;
    height: 60px;
    background-color: #333;
    color: white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .logo h1 {
    font-size: 1.5rem;
    margin: 0;
    font-weight: 600;
  }
  
  nav ul {
    display: flex;
    list-style: none;
    margin: 0;
    padding: 0;
  }
  
  nav li {
    margin-left: 1rem;
  }
  
  nav button {
    background: none;
    border: none;
    color: #ccc;
    font-size: 1rem;
    cursor: pointer;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    transition: all 0.2s;
  }
  
  nav button:hover {
    color: white;
    background-color: rgba(255, 255, 255, 0.1);
  }
  
  nav li.active button {
    color: white;
    background-color: rgba(255, 255, 255, 0.2);
  }
</style>
