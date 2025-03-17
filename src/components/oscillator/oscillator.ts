export class Oscillator {
    private audioContext: AudioContext;
    private oscillatorNode: OscillatorNode | null = null;
    private gainNode: GainNode;
    private note: string;  // e.g., "C4", "A#3"
    private octave: number;
    private midiNote: number; // MIDI note number (0-127)
    private amplitude: number;
    private detune: number;
    private waveform: OscillatorType;
    private attack: number;
    private decay: number;
    private sustain: number;
    private release: number;
    private noteDuration: number;

    // Map of note names to their base MIDI numbers (in octave 0)
    private static readonly NOTE_TO_MIDI = {
        'C': 0, 'C#': 1, 'Db': 1, 'D': 2, 'D#': 3, 'Eb': 3,
        'E': 4, 'F': 5, 'F#': 6, 'Gb': 6, 'G': 7, 'G#': 8,
        'Ab': 8, 'A': 9, 'A#': 10, 'Bb': 10, 'B': 11
    };

    constructor() {
        this.audioContext = new AudioContext();
        this.gainNode = this.audioContext.createGain();
        this.note = 'A4'; // Default to A440
        this.octave = 4;
        this.midiNote = 69; // A4 is MIDI note 69
        this.amplitude = 0.5;
        this.detune = 0;
        this.waveform = 'sine';
        this.attack = 0.1;
        this.decay = 0.1;
        this.sustain = 0.7;
        this.release = 0.2;
        this.noteDuration = 1.0;
        
        this.gainNode.connect(this.audioContext.destination);
        this.gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    }

    // Convert MIDI note number to frequency (A4 = 440Hz)
    private midiToFrequency(midiNote: number): number {
        return 440 * Math.pow(2, (midiNote - 69) / 12);
    }

    // Parse note string (e.g., "C#4") to MIDI number
    private noteToMidi(note: string): number {
        const match = note.match(/^([A-G][b#]?)(-?\d+)$/i);
        if (!match) throw new Error('Invalid note format');
        
        const noteName = match[1].toUpperCase();
        const octave = parseInt(match[2]);
        const baseNote = Oscillator.NOTE_TO_MIDI[noteName];
        
        if (baseNote === undefined) throw new Error('Invalid note name');
        
        return baseNote + (octave + 1) * 12; // +1 because MIDI octave -1 starts at C
    }

    setNote(note: string) {
        this.note = note;
        this.midiNote = this.noteToMidi(note);
        const frequency = this.midiToFrequency(this.midiNote);
        if (this.oscillatorNode) {
            this.oscillatorNode.frequency.value = frequency;
        }
    }

    setMidiNote(midiNote: number) {
        this.midiNote = Math.max(0, Math.min(127, midiNote));
        if (this.oscillatorNode) {
            this.oscillatorNode.frequency.value = this.midiToFrequency(this.midiNote);
        }
    }

    setAmplitude(amplitude: number) {
        this.amplitude = amplitude;
    }

    setWaveform(waveform: OscillatorType) {
        this.waveform = waveform;
        if (this.oscillatorNode) {
            this.oscillatorNode.type = waveform;
        }
    }

    setADSR(attack: number, decay: number, sustain: number, release: number) {
        this.attack = Math.max(0.001, attack);
        this.decay = Math.max(0.001, decay);
        this.sustain = Math.max(0, Math.min(1, sustain));
        this.release = Math.max(0.001, release);
    }

    setDuration(duration: number) {
        this.noteDuration = Math.max(0.001, duration);
    }

    play() {
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }

        this.stop();

        const now = this.audioContext.currentTime;
        
        this.oscillatorNode = this.audioContext.createOscillator();
        this.oscillatorNode.type = this.waveform;
        this.oscillatorNode.frequency.value = this.midiToFrequency(this.midiNote);
        this.oscillatorNode.detune.value = this.detune;
        this.oscillatorNode.connect(this.gainNode);

        this.gainNode.gain.cancelScheduledValues(now);
        this.gainNode.gain.setValueAtTime(0, now);

        const attackEnd = now + this.attack;
        const decayEnd = attackEnd + this.decay;
        const sustainEnd = now + this.noteDuration;
        const releaseEnd = sustainEnd + this.release;

        if (this.attack > 0) {
            this.gainNode.gain.linearRampToValueAtTime(this.amplitude, attackEnd);
        } else {
            this.gainNode.gain.setValueAtTime(this.amplitude, now);
        }

        if (this.decay > 0 && sustainEnd > attackEnd) {
            this.gainNode.gain.linearRampToValueAtTime(
                this.amplitude * this.sustain,
                Math.min(decayEnd, sustainEnd)
            );
        }

        if (sustainEnd > decayEnd) {
            this.gainNode.gain.setValueAtTime(
                this.amplitude * this.sustain,
                sustainEnd
            );
        }

        this.gainNode.gain.linearRampToValueAtTime(0, releaseEnd);

        this.oscillatorNode.start(now);
        this.oscillatorNode.stop(releaseEnd + 0.01);

        this.oscillatorNode.onended = () => {
            this.oscillatorNode = null;
            this.gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        };
    }

    stop() {
        if (this.oscillatorNode) {
            const now = this.audioContext.currentTime;
            this.gainNode.gain.cancelScheduledValues(now);
            this.gainNode.gain.setValueAtTime(this.gainNode.gain.value, now);
            this.gainNode.gain.linearRampToValueAtTime(0, now + 0.001);
            
            this.oscillatorNode.stop(now + 0.001);
            this.oscillatorNode = null;
        }
    }

    getNote() { return this.note; }
    getMidiNote() { return this.midiNote; }
    getAmplitude() { return this.amplitude; }
    getWaveform() { return this.waveform; }
}