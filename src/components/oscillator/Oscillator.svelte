<script lang="ts">
  import { Oscillator } from './oscillator';
  import { onMount } from 'svelte';
  import './oscillator.css';
  
  const oscillator = new Oscillator();
  
  // State variables
  let isPlaying = false;
  let note = 'C';
  let octave = 4;
  let amplitude = oscillator.getAmplitude();
  let waveform = oscillator.getWaveform();
  let attack = 0.1;
  let decay = 0.1;
  let sustain = 0.7;
  let release = 0.2;
  let duration = 1.0;

  // Tab management
  let activeTab = 'oscillator'; // 'oscillator' or 'adsr'
  
  // Console output
  let consoleOutput = [
    { prompt: '>', text: 'Synth initialized. Ready to play.' }
  ];
  
  // For ADSR visualization
  let adsrSvgPath = '';
  let adsrFillPath = '';
  
  const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

  // Update ADSR visualization when values change
  $: {
    updateADSRVisualization(attack, decay, sustain, release);
  }

  function logToConsole(text) {
    consoleOutput = [...consoleOutput, { prompt: '>', text }];
    // Limit console to last 10 items
    if (consoleOutput.length > 10) {
      consoleOutput = consoleOutput.slice(consoleOutput.length - 10);
    }
  }

  function setActiveTab(tab) {
    activeTab = tab;
  }

  function updateADSRVisualization(a, d, s, r) {
    // Calculate path points based on ADSR values
    // SVG dimensions are 300 width x 60 height
    const svgWidth = 300;
    const svgHeight = 60;
    const padding = 5;
    
    const totalTime = a + d + 1 + r; // 1 second is a placeholder for sustain display
    const timeScale = (svgWidth - padding * 2) / totalTime;
    
    // Calculate points for the path
    let startX = padding;
    let startY = svgHeight - padding;
    
    // Attack point
    let attackX = startX + (a * timeScale);
    let attackY = padding;
    
    // Decay point
    let decayX = attackX + (d * timeScale);
    let decayY = padding + ((1 - s) * (svgHeight - padding * 2));
    
    // Sustain points (horizontal line)
    let sustainEndX = decayX + (1 * timeScale); // 1 second sustain for visualization
    
    // Release end point
    let releaseX = sustainEndX + (r * timeScale);
    let releaseY = svgHeight - padding;
    
    // Create SVG path
    adsrSvgPath = `M ${startX},${startY} L ${attackX},${attackY} L ${decayX},${decayY} L ${sustainEndX},${decayY} L ${releaseX},${releaseY}`;
    
    // Add fill path (close the shape at the bottom)
    adsrFillPath = `${adsrSvgPath} L ${releaseX},${svgHeight - padding} L ${startX},${svgHeight - padding} Z`;
  }
  
  function updateNote(event: Event) {
    const target = event.target as HTMLSelectElement;
    note = target.value;
    oscillator.setNote(`${note}${octave}`);
    logToConsole(`Note set to ${note}${octave}`);
  }

  function updateOctave(event: Event) {
    const target = event.target as HTMLInputElement;
    octave = Number(target.value);
    oscillator.setNote(`${note}${octave}`);
    logToConsole(`Octave set to ${octave}`);
  }

  function updateAmplitude(event: Event) {
    const target = event.target as HTMLInputElement;
    amplitude = Number(target.value);
    oscillator.setAmplitude(amplitude);
    logToConsole(`Amplitude set to ${amplitude.toFixed(2)}`);
  }

  function updateWaveform(event: Event) {
    const target = event.target as HTMLSelectElement;
    waveform = target.value as OscillatorType;
    oscillator.setWaveform(waveform);
    logToConsole(`Waveform set to ${waveform}`);
  }

  function updateADSR() {
    oscillator.setADSR(attack, decay, sustain, release);
    updateADSRVisualization(attack, decay, sustain, release);
    logToConsole(`ADSR updated: A=${attack}s, D=${decay}s, S=${sustain}, R=${release}s`);
  }

  function togglePlay() {
    if (isPlaying) {
      oscillator.stop();
      isPlaying = false;
      logToConsole('Playback stopped');
    } else {
      oscillator.setNote(`${note}${octave}`);
      oscillator.setAmplitude(amplitude);
      oscillator.setWaveform(waveform);
      oscillator.setADSR(attack, decay, sustain, release);
      oscillator.setDuration(duration);
      oscillator.play();
      isPlaying = true;
      logToConsole(`Playing note ${note}${octave} with ${waveform} wave`);
      setTimeout(() => {
        isPlaying = false;
        logToConsole('Playback completed');
      }, (duration + release) * 1000);
    }
  }

  onMount(() => {
    updateADSRVisualization(attack, decay, sustain, release);
  });
</script>

<div class="terminal-container">
  <!-- Terminal Header with fake controls -->
  <div class="terminal-header">
    <div class="terminal-buttons">
      <div class="terminal-btn close"></div>
      <div class="terminal-btn minimize"></div>
      <div class="terminal-btn maximize"></div>
    </div>
    <h1 class="terminal-title">synth@oscillator:~$</h1>
  </div>
  
  <!-- Terminal Tabs -->
  <div class="terminal-tabs">
    <button 
      class="terminal-tab {activeTab === 'oscillator' ? 'active' : ''}" 
      on:click={() => setActiveTab('oscillator')}
    >
      <span class="keyword">class</span> <span class="function">Oscillator</span>
    </button>
    <button 
      class="terminal-tab {activeTab === 'adsr' ? 'active' : ''}" 
      on:click={() => setActiveTab('adsr')}
    >
      <span class="keyword">class</span> <span class="function">ADSR</span>
    </button>
    <button 
      class="terminal-tab {activeTab === 'console' ? 'active' : ''}" 
      on:click={() => setActiveTab('console')}
    >
      <span class="keyword">console</span>.<span class="function">log</span>()
    </button>
  </div>
  
  <div class="terminal-content">
    <!-- Oscillator Panel -->
    <div class="tab-panel {activeTab === 'oscillator' ? 'active' : ''}">
      <div class="control-row">
        <div class="control-label"><span class="keyword">const</span> note =</div>
        <div class="control-input">
          <select bind:value={note} on:change={updateNote}>
            {#each notes as n}
              <option value={n}>{n}</option>
            {/each}
          </select>
        </div>
      </div>

      <div class="control-row">
        <div class="control-label"><span class="keyword">const</span> octave =</div>
        <div class="control-input">
          <input 
            type="range" 
            min="0" 
            max="8" 
            step="1" 
            bind:value={octave} 
            on:input={updateOctave}
          />
          <div class="control-value"><span class="number">{octave}</span>;</div>
        </div>
      </div>

      <div class="control-row">
        <div class="control-label"><span class="keyword">const</span> amplitude =</div>
        <div class="control-input">
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.01" 
            bind:value={amplitude} 
            on:input={updateAmplitude}
          />
          <div class="control-value"><span class="number">{amplitude.toFixed(2)}</span>;</div>
        </div>
      </div>

      <div class="control-row">
        <div class="control-label"><span class="keyword">const</span> waveform =</div>
        <div class="control-input">
          <select bind:value={waveform} on:change={updateWaveform}>
            <option value="sine">sine</option>
            <option value="square">square</option>
            <option value="sawtooth">sawtooth</option>
            <option value="triangle">triangle</option>
          </select>
        </div>
      </div>

      <!-- Waveform visualization -->
      <div class="visualization">
        <div class="waveform-display waveform-{waveform}"></div>
      </div>
      
      <div class="control-row">
        <div class="control-label"><span class="keyword">const</span> duration =</div>
        <div class="control-input">
          <input 
            type="range" 
            min="0.1" 
            max="5" 
            step="0.1" 
            bind:value={duration}
          />
          <div class="control-value"><span class="number">{duration.toFixed(1)}</span>s;</div>
        </div>
      </div>
    </div>
    
    <!-- ADSR Panel -->
    <div class="tab-panel {activeTab === 'adsr' ? 'active' : ''}">
      <!-- ADSR Visualization -->
      <div class="visualization">
        <svg width="100%" height="100%" viewBox="0 0 300 60" preserveAspectRatio="none">
          <path d={adsrFillPath} class="adsr-fill" />
          <path d={adsrSvgPath} class="adsr-path" />
        </svg>
      </div>
      
      <div class="control-row">
        <div class="control-label"><span class="keyword">const</span> attack =</div>
        <div class="control-input">
          <input 
            type="range" 
            min="0" 
            max="5" 
            step="0.1" 
            bind:value={attack} 
            on:input={updateADSR}
          />
          <div class="control-value"><span class="number">{attack.toFixed(1)}</span>s;</div>
        </div>
      </div>
      
      <div class="control-row">
        <div class="control-label"><span class="keyword">const</span> decay =</div>
        <div class="control-input">
          <input 
            type="range" 
            min="0" 
            max="5" 
            step="0.1" 
            bind:value={decay} 
            on:input={updateADSR}
          />
          <div class="control-value"><span class="number">{decay.toFixed(1)}</span>s;</div>
        </div>
      </div>
      
      <div class="control-row">
        <div class="control-label"><span class="keyword">const</span> sustain =</div>
        <div class="control-input">
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.01" 
            bind:value={sustain} 
            on:input={updateADSR}
          />
          <div class="control-value"><span class="number">{sustain.toFixed(2)}</span>;</div>
        </div>
      </div>
      
      <div class="control-row">
        <div class="control-label"><span class="keyword">const</span> release =</div>
        <div class="control-input">
          <input 
            type="range" 
            min="0" 
            max="5" 
            step="0.1" 
            bind:value={release} 
            on:input={updateADSR}
          />
          <div class="control-value"><span class="number">{release.toFixed(1)}</span>s;</div>
        </div>
      </div>
    </div>
    
    <!-- Console Panel -->
    <div class="tab-panel {activeTab === 'console' ? 'active' : ''}">
      <div class="console-output">
        {#each consoleOutput as line}
          <div class="console-line">
            <span class="console-prompt">{line.prompt}</span>
            <span class="console-text">{line.text}</span>
          </div>
        {/each}
      </div>
    </div>
  </div>
  
  <!-- Play button visible in all tabs -->
  <button class="play-button {isPlaying ? 'playing' : ''}" on:click={togglePlay}>
    <span class="function">synth</span>.<span class="keyword">{isPlaying ? 'stop' : 'play'}</span>();
  </button>
</div>