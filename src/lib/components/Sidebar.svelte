<script lang="ts">
  import { configTab, uiState } from '$lib/store';
  
  function setConfigTab(tab: 'dimensions' | 'components' | 'appearance' | 'mounting' | 'ventilation' | 'io') {
    configTab.set(tab);
  }
</script>

<aside class:collapsed={!$uiState.isSidebarOpen}>
  <div class="sidebar-content">
    <nav>
      <ul>
        <li class:active={$configTab === 'dimensions'}>
          <button on:click={() => setConfigTab('dimensions')}>
            <span class="icon">📏</span>
            <span class="label">Dimensions</span>
          </button>
        </li>
        <li class:active={$configTab === 'components'}>
          <button on:click={() => setConfigTab('components')}>
            <span class="icon">🔌</span>
            <span class="label">Components</span>
          </button>
        </li>
        <li class:active={$configTab === 'appearance'}>
          <button on:click={() => setConfigTab('appearance')}>
            <span class="icon">🎨</span>
            <span class="label">Appearance</span>
          </button>
        </li>
        <li class:active={$configTab === 'mounting'}>
          <button on:click={() => setConfigTab('mounting')}>
            <span class="icon">🔧</span>
            <span class="label">Mounting</span>
          </button>
        </li>
        <li class:active={$configTab === 'ventilation'}>
          <button on:click={() => setConfigTab('ventilation')}>
            <span class="icon">💨</span>
            <span class="label">Ventilation</span>
          </button>
        </li>
        <li class:active={$configTab === 'io'}>
          <button on:click={() => setConfigTab('io')}>
            <span class="icon">🔌</span>
            <span class="label">I/O Ports</span>
          </button>
        </li>
      </ul>
    </nav>
  </div>
  
  <button class="toggle-button" on:click={() => uiState.update(s => ({ ...s, isSidebarOpen: !s.isSidebarOpen }))}>
    {$uiState.isSidebarOpen ? '◀' : '▶'}
  </button>
</aside>

<style>
  aside {
    width: 250px;
    background-color: #f0f0f0;
    border-right: 1px solid #ddd;
    transition: width 0.3s ease;
    position: relative;
    overflow: hidden;
  }
  
  aside.collapsed {
    width: 50px;
  }
  
  .sidebar-content {
    width: 250px;
    height: 100%;
    overflow-y: auto;
    padding: 1rem 0;
  }
  
  nav ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  nav li {
    margin-bottom: 0.5rem;
  }
  
  nav button {
    display: flex;
    align-items: center;
    width: 100%;
    padding: 0.75rem 1rem;
    background: none;
    border: none;
    text-align: left;
    cursor: pointer;
    border-radius: 4px;
    transition: background-color 0.2s;
  }
  
  nav button:hover {
    background-color: #e0e0e0;
  }
  
  nav li.active button {
    background-color: #ddd;
    font-weight: 500;
  }
  
  .icon {
    margin-right: 0.75rem;
    font-size: 1.2rem;
    width: 24px;
    text-align: center;
  }
  
  .toggle-button {
    position: absolute;
    top: 10px;
    right: 10px;
    background: #ddd;
    border: none;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 0.8rem;
    z-index: 10;
  }
  
  .toggle-button:hover {
    background-color: #ccc;
  }
  
  /* When sidebar is collapsed, only show icons */
  aside.collapsed .label {
    display: none;
  }
  
  aside.collapsed nav button {
    justify-content: center;
    padding: 0.75rem 0;
  }
  
  aside.collapsed .icon {
    margin-right: 0;
  }
</style>
