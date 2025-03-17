<script lang="ts">
  import svelteLogo from './assets/svelte.svg'
  import viteLogo from '/vite.svg'
  import Counter from './lib/Counter.svelte'
  import { Oscillator } from './components/oscillator';

  const oscillator = new Oscillator();
  
  
  let amplitude = oscillator.getAmplitude();
  let waveform = oscillator.getWaveform();
  let attack = 0;
  let decay = 0;
  let sustain = 0;
  let release = 0;

  function updateFrequency(event: Event) {
      const target = event.target as HTMLInputElement;
      
      
  }

  function updateAmplitude(event: Event) {
      const target = event.target as HTMLInputElement;
      amplitude = Number(target.value);
      oscillator.setAmplitude(amplitude);
  }

  function updateWaveform(event: Event) {
      const target = event.target as HTMLSelectElement;
      waveform = target.value;
      oscillator.setWaveform(waveform);
  }

  function updateADSR(event: Event) {
      oscillator.setADSR(attack, decay, sustain, release);
  }

  function play() {
      oscillator.play();
  }
</script>

<main>
  <h1>Oscillator Settings</h1>
  <div>
      <label>Frequency: <input type="range" min="20" max="2000" bind:value={frequency} on:input={updateFrequency} /></label>
      <span>{frequency} Hz</span>
  </div>
  <div>
      <label>Amplitude: <input type="range" min="0" max="1" step="0.01" bind:value={amplitude} on:input={updateAmplitude} /></label>
      <span>{amplitude}</span>
  </div>
  <div>
      <label>Waveform:
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
      <label>Attack: <input type="range" min="0" max="5" step="0.1" bind:value={attack} on:input={updateADSR} /></label>
      <span>{attack} s</span>
  </div>
  <div>
      <label>Decay: <input type="range" min="0" max="5" step="0.1" bind:value={decay} on:input={updateADSR} /></label>
      <span>{decay} s</span>
  </div>
  <div>
      <label>Sustain: <input type="range" min="0" max="1" step="0.01" bind:value={sustain} on:input={updateADSR} /></label>
      <span>{sustain}</span>
  </div>
  <div>
      <label>Release: <input type="range" min="0" max="5" step="0.1" bind:value={release} on:input={updateADSR} /></label>
      <span>{release} s</span>
  </div>
  <button on:click={play}>Play</button>
</main>

<style>
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
