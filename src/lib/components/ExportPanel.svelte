<script lang="ts">
  import { config, exportStatus, setExportStatus } from '$lib/store';
  
  // Mock function for STL export - we'll implement the actual export later
  function exportSTL() {
    setExportStatus({ inProgress: true, progress: 0, error: null, downloadUrl: null });
    
    // Simulate export progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setExportStatus({ progress });
      
      if (progress >= 100) {
        clearInterval(interval);
        setExportStatus({ 
          inProgress: false, 
          progress: 100, 
          downloadUrl: '#' // This will be a real URL when implemented
        });
      }
    }, 300);
  }
</script>

<div class="export-panel">
  <h2>Export Options</h2>
  
  <section>
    <h3>File Format</h3>
    
    <div class="form-group">
      <label for="format">Format</label>
      <select id="format" bind:value={$config.export.format}>
        <option value="stl">STL (3D Printing)</option>
        <option value="step" disabled>STEP (Coming Soon)</option>
        <option value="dxf" disabled>DXF (Coming Soon)</option>
      </select>
    </div>
    
    <div class="form-group">
      <label for="quality">Quality</label>
      <select id="quality" bind:value={$config.export.quality}>
        <option value="low">Low (Fast)</option>
        <option value="medium">Medium</option>
        <option value="high">High (Slow)</option>
      </select>
    </div>
    
    <div class="form-group">
      <label for="units">Units</label>
      <select id="units" bind:value={$config.export.units}>
        <option value="mm">Millimeters (mm)</option>
        <option value="inch">Inches (in)</option>
      </select>
    </div>
  </section>
  
  <section>
    <h3>Export Options</h3>
    
    <div class="checkbox-group">
      <label>
        <input type="checkbox" checked disabled />
        Export as single STL file
      </label>
    </div>
    
    <div class="checkbox-group">
      <label>
        <input type="checkbox" />
        Export panels separately
      </label>
    </div>
    
    <div class="checkbox-group">
      <label>
        <input type="checkbox" />
        Include mounting hardware
      </label>
    </div>
  </section>
  
  <section class="export-actions">
    <button class="export-button" on:click={exportSTL} disabled={$exportStatus.inProgress}>
      {$exportStatus.inProgress ? 'Exporting...' : 'Export STL'}
    </button>
    
    {#if $exportStatus.inProgress}
      <div class="progress-bar">
        <div class="progress" style="width: {$exportStatus.progress}%"></div>
      </div>
      <div class="progress-text">{$exportStatus.progress}%</div>
    {/if}
    
    {#if $exportStatus.error}
      <div class="error-message">
        Error: {$exportStatus.error}
      </div>
    {/if}
    
    {#if $exportStatus.downloadUrl && !$exportStatus.inProgress}
      <div class="success-message">
        <p>Export completed successfully!</p>
        <a href={$exportStatus.downloadUrl} download="pc-case.stl" class="download-button">
          Download STL File
        </a>
      </div>
    {/if}
  </section>
  
  <section class="export-info">
    <h3>Manufacturing Notes</h3>
    <p>
      The exported STL files are ready for 3D printing or CNC machining. For best results:
    </p>
    <ul>
      <li>Use a 3D printer with a build volume of at least {$config.dimensions.width}mm × {$config.dimensions.height}mm × {$config.dimensions.depth}mm</li>
      <li>Recommended materials: PETG, ABS, or ASA for durability</li>
      <li>Print with at least 20% infill for structural integrity</li>
      <li>Consider using supports for overhangs</li>
    </ul>
  </section>
</div>

<style>
  .export-panel {
    background-color: white;
    border-radius: 8px;
    padding: 1.5rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }
  
  h2 {
    margin-top: 0;
    margin-bottom: 1.5rem;
    font-size: 1.5rem;
    font-weight: 600;
    color: #333;
  }
  
  h3 {
    margin-top: 0;
    margin-bottom: 1rem;
    font-size: 1.2rem;
    font-weight: 500;
    color: #444;
  }
  
  section {
    margin-bottom: 2rem;
  }
  
  .form-group {
    margin-bottom: 1rem;
    display: flex;
    align-items: center;
  }
  
  label {
    flex: 0 0 150px;
    font-weight: 500;
    color: #555;
  }
  
  select {
    flex: 1;
    max-width: 200px;
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    background-color: white;
  }
  
  .checkbox-group {
    margin-bottom: 0.75rem;
  }
  
  .checkbox-group label {
    display: flex;
    align-items: center;
    cursor: pointer;
  }
  
  .checkbox-group input {
    margin-right: 0.75rem;
  }
  
  .export-actions {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .export-button {
    background-color: #4CAF50;
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 4px;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  .export-button:hover {
    background-color: #45a049;
  }
  
  .export-button:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
  
  .progress-bar {
    width: 100%;
    height: 10px;
    background-color: #f0f0f0;
    border-radius: 5px;
    overflow: hidden;
  }
  
  .progress {
    height: 100%;
    background-color: #4CAF50;
    transition: width 0.3s ease;
  }
  
  .progress-text {
    font-size: 0.9rem;
    color: #666;
  }
  
  .error-message {
    color: #d32f2f;
    font-weight: 500;
    padding: 0.5rem;
    background-color: #ffebee;
    border-radius: 4px;
    width: 100%;
  }
  
  .success-message {
    color: #388e3c;
    padding: 0.5rem;
    background-color: #e8f5e9;
    border-radius: 4px;
    width: 100%;
  }
  
  .download-button {
    display: inline-block;
    background-color: #2196F3;
    color: white;
    text-decoration: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    margin-top: 0.5rem;
    font-weight: 500;
    transition: background-color 0.2s;
  }
  
  .download-button:hover {
    background-color: #1976D2;
  }
  
  .export-info {
    background-color: #f5f5f5;
    padding: 1rem;
    border-radius: 4px;
  }
  
  .export-info p {
    margin-top: 0;
  }
  
  .export-info ul {
    margin-bottom: 0;
  }
  
  .export-info li {
    margin-bottom: 0.5rem;
  }
</style>
