<script lang="ts">
  
    import { Oscillator } from './oscillator';
  
    const oscillator = new Oscillator();
    
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
  
    const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  
    function updateNote(event: Event) {
      const target = event.target as HTMLSelectElement;
      note = target.value;
      oscillator.setNote(`${note}${octave}`);
    }
  
    function updateOctave(event: Event) {
      const target = event.target as HTMLInputElement;
      octave = Number(target.value);
      oscillator.setNote(`${note}${octave}`);
    }
  
    function updateAmplitude(event: Event) {
      const target = event.target as HTMLInputElement;
      amplitude = Number(target.value);
      oscillator.setAmplitude(amplitude);
    }
  
    function updateWaveform(event: Event) {
      const target = event.target as HTMLSelectElement;
      waveform = target.value as OscillatorType;
      oscillator.setWaveform(waveform);
    }
  
    function updateADSR() {
      oscillator.setADSR(attack, decay, sustain, release);
    }
  
    function togglePlay() {
      if (isPlaying) {
        oscillator.stop();
        isPlaying = false;
      } else {
        oscillator.setNote(`${note}${octave}`);
        oscillator.setAmplitude(amplitude);
        oscillator.setWaveform(waveform);
        oscillator.setADSR(attack, decay, sustain, release);
        oscillator.setDuration(duration);
        oscillator.play();
        isPlaying = true;
        setTimeout(() => {
          isPlaying = false;
        }, (duration + release) * 1000);
      }
    }
  </script>
  
  <main>
    <h1>Oscillator Settings</h1>
    
    <div>
      <label>
        Note:
        <select bind:value={note} on:change={updateNote}>
          {#each notes as n}
            <option value={n}>{n}</option>
          {/each}
        </select>
      </label>
    </div>
  
    <div>
      <label>
        Octave:
        <input 
          type="range" 
          min="0" 
          max="8" 
          step="1" 
          bind:value={octave} 
          on:input={updateOctave}
        />
        <span>{octave}</span>
      </label>
    </div>
  
    <div>
      <label>
        Amplitude:
        <input 
          type="range" 
          min="0" 
          max="1" 
          step="0.01" 
          bind:value={amplitude} 
          on:input={updateAmplitude}
        />
        <span>{amplitude}</span>
      </label>
    </div>
  
    <div>
      <label>
        Waveform:
        <select bind:value={waveform} on:change={updateWaveform}>
          <option value="sine">Sine</option>
          <option value="square">Square</option>
          <option value="sawtooth">Sawtooth</option>
          <option value="triangle">Triangle</option>
        </select>
      </label>
    </div>
  
    <h1>ADSR Envelope Settings</h1>
    <div>
      <label>
        Attack:
        <input 
          type="range" 
          min="0" 
          max="5" 
          step="0.1" 
          bind:value={attack} 
          on:input={updateADSR}
        />
        <span>{attack} s</span>
      </label>
    </div>
    <div>
      <label>
        Decay:
        <input 
          type="range" 
          min="0" 
          max="5" 
          step="0.1" 
          bind:value={decay} 
          on:input={updateADSR}
        />
        <span>{decay} s</span>
      </label>
    </div>
    <div>
      <label>
        Sustain:
        <input 
          type="range" 
          min="0" 
          max="1" 
          step="0.01" 
          bind:value={sustain} 
          on:input={updateADSR}
        />
        <span>{sustain}</span>
      </label>
    </div>
    <div>
      <label>
        Release:
        <input 
          type="range" 
          min="0" 
          max="5" 
          step="0.1" 
          bind:value={release} 
          on:input={updateADSR}
        />
        <span>{release} s</span>
      </label>
    </div>
  
    <div>
      <label>
        Duration:
        <input 
          type="range" 
          min="0.1" 
          max="5" 
          step="0.1" 
          bind:value={duration}
        />
        <span>{duration} s</span>
      </label>
    </div>
  
    <button on:click={togglePlay}>
      {isPlaying ? 'Stop' : 'Play'}
    </button>
  </main>
  
  <style>
    main {
      padding: 1rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    
    .logo {
      height: 6em;
      padding: 1.5em;
      will-change: filter;
      transition: filter 300ms;
    }
    
    .logo:hover {
      filter: drop-shadow(0 0 2em #646cffaa);
    }
    
    .logo.svelte:hover {
      filter: drop-shadow(0 0 2em #ff3e00aa);
    }
    
    .read-the-docs {
      color: #888;
    }
  </style>