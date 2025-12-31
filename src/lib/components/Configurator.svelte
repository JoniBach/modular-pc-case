<script lang="ts">
  import { configTab, config, updateConfig } from '$lib/store';
  import { 
    motherboardStandards, 
    powerSupplyStandards, 
    fanStandards, 
    materialOptions 
  } from '$lib/config/standards';
  
  // Helper function to create a range of numbers for sliders
  function range(start: number, end: number, step: number = 1): number[] {
    const result = [];
    for (let i = start; i <= end; i += step) {
      result.push(i);
    }
    return result;
  }
</script>

<div class="configurator">
  <h2>Case Configuration</h2>
  
  {#if $configTab === 'dimensions'}
    <section>
      <h3>Dimensions</h3>
      
      <div class="form-group">
        <label for="width">Width (mm)</label>
        <input 
          type="range" 
          id="width" 
          min="200" 
          max="500" 
          step="10" 
          bind:value={$config.dimensions.width}
          on:change={() => updateConfig('dimensions', { width: $config.dimensions.width })}
        />
        <span class="value">{$config.dimensions.width} mm</span>
      </div>
      
      <div class="form-group">
        <label for="height">Height (mm)</label>
        <input 
          type="range" 
          id="height" 
          min="200" 
          max="600" 
          step="10" 
          bind:value={$config.dimensions.height}
          on:change={() => updateConfig('dimensions', { height: $config.dimensions.height })}
        />
        <span class="value">{$config.dimensions.height} mm</span>
      </div>
      
      <div class="form-group">
        <label for="depth">Depth (mm)</label>
        <input 
          type="range" 
          id="depth" 
          min="200" 
          max="500" 
          step="10" 
          bind:value={$config.dimensions.depth}
          on:change={() => updateConfig('dimensions', { depth: $config.dimensions.depth })}
        />
        <span class="value">{$config.dimensions.depth} mm</span>
      </div>
      
      <div class="form-group">
        <label for="cornerRadius">Corner Radius (mm)</label>
        <input 
          type="range" 
          id="cornerRadius" 
          min="0" 
          max="10" 
          step="1" 
          bind:value={$config.dimensions.cornerRadius}
          on:change={() => updateConfig('dimensions', { cornerRadius: $config.dimensions.cornerRadius })}
        />
        <span class="value">{$config.dimensions.cornerRadius} mm</span>
      </div>
    </section>
  
  {:else if $configTab === 'components'}
    <section>
      <h3>Components</h3>
      
      <div class="form-group">
        <label for="motherboard">Motherboard</label>
        <select 
          id="motherboard" 
          bind:value={$config.components.motherboard}
          on:change={() => updateConfig('components', { motherboard: $config.components.motherboard })}
        >
          {#each Object.entries(motherboardStandards) as [key, board]}
            <option value={board.name}>{board.name}</option>
          {/each}
        </select>
      </div>
      
      <div class="form-group">
        <label for="powerSupply">Power Supply</label>
        <select 
          id="powerSupply" 
          bind:value={$config.components.powerSupply}
          on:change={() => updateConfig('components', { powerSupply: $config.components.powerSupply })}
        >
          {#each Object.entries(powerSupplyStandards) as [key, psu]}
            <option value={psu.name}>{psu.name}</option>
          {/each}
        </select>
      </div>
      
      <div class="form-group">
        <label for="material">Material</label>
        <select 
          id="material" 
          bind:value={$config.components.material}
          on:change={() => updateConfig('components', { material: $config.components.material })}
        >
          {#each Object.entries(materialOptions) as [key, material]}
            <option value={material.name}>{material.name}</option>
          {/each}
        </select>
      </div>
    </section>
  
  {:else if $configTab === 'appearance'}
    <section>
      <h3>Appearance</h3>
      
      <div class="form-group">
        <label for="color">Color</label>
        <input 
          type="color" 
          id="color" 
          bind:value={$config.appearance.color}
          on:change={() => updateConfig('appearance', { color: $config.appearance.color })}
        />
        <span class="value">{$config.appearance.color}</span>
      </div>
      
      <div class="form-group">
        <label for="sidePanel">Side Panel</label>
        <select 
          id="sidePanel" 
          bind:value={$config.appearance.sidePanel}
          on:change={() => updateConfig('appearance', { sidePanel: $config.appearance.sidePanel })}
        >
          <option value="solid">Solid</option>
          <option value="mesh">Mesh</option>
          <option value="window">Window</option>
        </select>
      </div>
      
      <div class="form-group">
        <label for="frontPanel">Front Panel</label>
        <select 
          id="frontPanel" 
          bind:value={$config.appearance.frontPanel}
          on:change={() => updateConfig('appearance', { frontPanel: $config.appearance.frontPanel })}
        >
          <option value="solid">Solid</option>
          <option value="mesh">Mesh</option>
          <option value="window">Window</option>
        </select>
      </div>
      
      <div class="form-group">
        <label for="topPanel">Top Panel</label>
        <select 
          id="topPanel" 
          bind:value={$config.appearance.topPanel}
          on:change={() => updateConfig('appearance', { topPanel: $config.appearance.topPanel })}
        >
          <option value="solid">Solid</option>
          <option value="mesh">Mesh</option>
          <option value="window">Window</option>
        </select>
      </div>
    </section>
  
  {:else if $configTab === 'mounting'}
    <section>
      <h3>Mounting Options</h3>
      
      <div class="form-group">
        <label for="motherboardMount">Motherboard Mounting</label>
        <select 
          id="motherboardMount" 
          bind:value={$config.mounting.motherboardMountType}
          on:change={() => updateConfig('mounting', { motherboardMountType: $config.mounting.motherboardMountType })}
        >
          <option value="standoff">Standoffs</option>
          <option value="direct">Direct Mount</option>
        </select>
      </div>
      
      <div class="form-group">
        <label for="psuMount">PSU Mounting</label>
        <select 
          id="psuMount" 
          bind:value={$config.mounting.psuMountType}
          on:change={() => updateConfig('mounting', { psuMountType: $config.mounting.psuMountType })}
        >
          <option value="bracket">Bracket</option>
          <option value="direct">Direct Mount</option>
        </select>
      </div>
      
      <div class="form-group">
        <label for="driveMount">Drive Mounting</label>
        <select 
          id="driveMount" 
          bind:value={$config.mounting.driveMountType}
          on:change={() => updateConfig('mounting', { driveMountType: $config.mounting.driveMountType })}
        >
          <option value="tray">Tray</option>
          <option value="direct">Direct Mount</option>
        </select>
      </div>
      
      <div class="form-group">
        <label for="fanMount">Fan Mounting</label>
        <select 
          id="fanMount" 
          bind:value={$config.mounting.fanMountType}
          on:change={() => updateConfig('mounting', { fanMountType: $config.mounting.fanMountType })}
        >
          <option value="bracket">Bracket</option>
          <option value="direct">Direct Mount</option>
        </select>
      </div>
    </section>
  
  {:else if $configTab === 'ventilation'}
    <section>
      <h3>Ventilation</h3>
      
      <div class="form-group checkbox">
        <label for="frontVent">
          <input 
            type="checkbox" 
            id="frontVent" 
            bind:checked={$config.ventilation.frontVentilation}
            on:change={() => updateConfig('ventilation', { frontVentilation: $config.ventilation.frontVentilation })}
          />
          Front Ventilation
        </label>
      </div>
      
      <div class="form-group checkbox">
        <label for="topVent">
          <input 
            type="checkbox" 
            id="topVent" 
            bind:checked={$config.ventilation.topVentilation}
            on:change={() => updateConfig('ventilation', { topVentilation: $config.ventilation.topVentilation })}
          />
          Top Ventilation
        </label>
      </div>
      
      <div class="form-group checkbox">
        <label for="rearVent">
          <input 
            type="checkbox" 
            id="rearVent" 
            bind:checked={$config.ventilation.rearVentilation}
            on:change={() => updateConfig('ventilation', { rearVentilation: $config.ventilation.rearVentilation })}
          />
          Rear Ventilation
        </label>
      </div>
      
      <div class="form-group checkbox">
        <label for="bottomVent">
          <input 
            type="checkbox" 
            id="bottomVent" 
            bind:checked={$config.ventilation.bottomVentilation}
            on:change={() => updateConfig('ventilation', { bottomVentilation: $config.ventilation.bottomVentilation })}
          />
          Bottom Ventilation
        </label>
      </div>
      
      <div class="form-group checkbox">
        <label for="sideVent">
          <input 
            type="checkbox" 
            id="sideVent" 
            bind:checked={$config.ventilation.sideVentilation}
            on:change={() => updateConfig('ventilation', { sideVentilation: $config.ventilation.sideVentilation })}
          />
          Side Ventilation
        </label>
      </div>
      
      <div class="form-group">
        <label for="ventHoleSize">Ventilation Hole Size (mm)</label>
        <input 
          type="range" 
          id="ventHoleSize" 
          min="1" 
          max="10" 
          step="0.5" 
          bind:value={$config.ventilation.ventilationHoleSize}
          on:change={() => updateConfig('ventilation', { ventilationHoleSize: $config.ventilation.ventilationHoleSize })}
        />
        <span class="value">{$config.ventilation.ventilationHoleSize} mm</span>
      </div>
      
      <div class="form-group">
        <label for="ventHoleSpacing">Ventilation Hole Spacing (mm)</label>
        <input 
          type="range" 
          id="ventHoleSpacing" 
          min="1" 
          max="5" 
          step="0.5" 
          bind:value={$config.ventilation.ventilationHoleSpacing}
          on:change={() => updateConfig('ventilation', { ventilationHoleSpacing: $config.ventilation.ventilationHoleSpacing })}
        />
        <span class="value">{$config.ventilation.ventilationHoleSpacing} mm</span>
      </div>
    </section>
  
  {:else if $configTab === 'io'}
    <section>
      <h3>I/O Ports</h3>
      
      <div class="form-group">
        <label for="usb2">USB 2.0 Ports</label>
        <input 
          type="number" 
          id="usb2" 
          min="0" 
          max="4" 
          bind:value={$config.io.frontPorts.usb2}
          on:change={() => updateConfig('io', { frontPorts: { ...$config.io.frontPorts, usb2: $config.io.frontPorts.usb2 } })}
        />
      </div>
      
      <div class="form-group">
        <label for="usb3">USB 3.0 Ports</label>
        <input 
          type="number" 
          id="usb3" 
          min="0" 
          max="4" 
          bind:value={$config.io.frontPorts.usb3}
          on:change={() => updateConfig('io', { frontPorts: { ...$config.io.frontPorts, usb3: $config.io.frontPorts.usb3 } })}
        />
      </div>
      
      <div class="form-group">
        <label for="usbC">USB-C Ports</label>
        <input 
          type="number" 
          id="usbC" 
          min="0" 
          max="2" 
          bind:value={$config.io.frontPorts.usbC}
          on:change={() => updateConfig('io', { frontPorts: { ...$config.io.frontPorts, usbC: $config.io.frontPorts.usbC } })}
        />
      </div>
      
      <div class="form-group checkbox">
        <label for="audio">
          <input 
            type="checkbox" 
            id="audio" 
            bind:checked={$config.io.frontPorts.audio}
            on:change={() => updateConfig('io', { frontPorts: { ...$config.io.frontPorts, audio: $config.io.frontPorts.audio } })}
          />
          Audio Jacks
        </label>
      </div>
      
      <div class="form-group checkbox">
        <label for="powerButton">
          <input 
            type="checkbox" 
            id="powerButton" 
            bind:checked={$config.io.frontPorts.powerButton}
            on:change={() => updateConfig('io', { frontPorts: { ...$config.io.frontPorts, powerButton: $config.io.frontPorts.powerButton } })}
          />
          Power Button
        </label>
      </div>
      
      <div class="form-group checkbox">
        <label for="resetButton">
          <input 
            type="checkbox" 
            id="resetButton" 
            bind:checked={$config.io.frontPorts.resetButton}
            on:change={() => updateConfig('io', { frontPorts: { ...$config.io.frontPorts, resetButton: $config.io.frontPorts.resetButton } })}
          />
          Reset Button
        </label>
      </div>
    </section>
  {/if}
</div>

<style>
  .configurator {
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
  
  input[type="range"] {
    flex: 1;
    margin-right: 1rem;
  }
  
  input[type="number"] {
    width: 60px;
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
  
  input[type="color"] {
    width: 40px;
    height: 40px;
    border: none;
    border-radius: 4px;
    margin-right: 1rem;
  }
  
  select {
    flex: 1;
    max-width: 200px;
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    background-color: white;
  }
  
  .value {
    flex: 0 0 60px;
    text-align: right;
    color: #666;
    font-variant-numeric: tabular-nums;
  }
  
  .checkbox {
    display: flex;
    align-items: center;
  }
  
  .checkbox label {
    display: flex;
    align-items: center;
    cursor: pointer;
  }
  
  .checkbox input {
    margin-right: 0.5rem;
  }
</style>
