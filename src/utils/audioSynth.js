/**
 * Audio Manager & Ambient Sound Generator
 * Plays soothing ambient lo-fi acoustic chords with subtle rain & vinyl crackle,
 * emulating the gentle mood of "Rainy Days on the Sidewalk - Mondo Gascaro".
 */

class LoFiSoundtrackManager {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.volume = 0.6;
    this.gainNode = null;
    this.timerId = null;
    this.crackleNode = null;
    this.rainNode = null;
    this.trackTitle = "Rainy Days on the Sidewalk — Mondo Gascaro";
    this.onStateChange = null;
  }

  init() {
    if (this.ctx) return;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    this.ctx = new AudioContext();
    this.gainNode = this.ctx.createGain();
    this.gainNode.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    this.gainNode.connect(this.ctx.destination);
  }

  setVolume(val) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.gainNode && this.ctx) {
      this.gainNode.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.05);
    }
    if (this.onStateChange) this.onStateChange(this.getState());
  }

  play() {
    this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    if (this.isPlaying) return;
    this.isPlaying = true;

    this.startVinylAndRain();
    this.startChordsLoop();

    if (this.onStateChange) this.onStateChange(this.getState());
  }

  pause() {
    if (!this.isPlaying) return;
    this.isPlaying = false;
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
    this.stopVinylAndRain();

    if (this.onStateChange) this.onStateChange(this.getState());
  }

  toggle() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  getState() {
    return {
      isPlaying: this.isPlaying,
      volume: this.volume,
      trackTitle: this.trackTitle,
    };
  }

  startVinylAndRain() {
    if (!this.ctx || !this.gainNode) return;

    // Generate vinyl crackle & soft rain noise
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      // Soft pink-like noise with sporadic pops
      const isPop = Math.random() < 0.001;
      const pop = isPop ? (Math.random() * 2 - 1) * 0.4 : 0;
      output[i] = (Math.random() * 2 - 1) * 0.03 + pop;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1400, this.ctx.currentTime);

    const rainGain = this.ctx.createGain();
    rainGain.gain.setValueAtTime(0.18, this.ctx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(rainGain);
    rainGain.connect(this.gainNode);

    whiteNoise.start();
    this.rainNode = whiteNoise;
  }

  stopVinylAndRain() {
    if (this.rainNode) {
      try {
        this.rainNode.stop();
        this.rainNode.disconnect();
      } catch {
        // ignore
      }
      this.rainNode = null;
    }
  }

  startChordsLoop() {
    // Elegant warm chord progressions (Fmaj7 - Em7 - Dm7 - Cmaj7 in soft acoustic frequency)
    const chordProgression = [
      [174.61, 220.00, 261.63, 329.63, 440.00], // Fmaj7 / F9
      [164.81, 196.00, 246.94, 293.66, 392.00], // Em7
      [146.83, 174.61, 220.00, 261.63, 349.23], // Dm7
      [130.81, 164.81, 196.00, 246.94, 329.63], // Cmaj7
      [146.83, 174.61, 220.00, 261.63, 392.00], // Dm9
      [196.00, 246.94, 293.66, 349.23, 440.00], // G9
    ];

    let chordIndex = 0;

    const playNextChord = () => {
      if (!this.isPlaying || !this.ctx) return;

      const chord = chordProgression[chordIndex];
      chordIndex = (chordIndex + 1) % chordProgression.length;

      // Play each note in the chord with gentle attack and warm decay
      chord.forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const noteGain = this.ctx.createGain();

        osc.type = i === 0 ? 'triangle' : 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        const startTime = this.ctx.currentTime + (i * 0.08); // subtle strumming delay
        const duration = 4.2;

        noteGain.gain.setValueAtTime(0.0001, startTime);
        noteGain.gain.exponentialRampToValueAtTime(0.05 / (i + 1), startTime + 0.3);
        noteGain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

        osc.connect(noteGain);
        noteGain.connect(this.gainNode);

        osc.start(startTime);
        osc.stop(startTime + duration + 0.1);
      });

      this.timerId = setTimeout(playNextChord, 3800);
    };

    playNextChord();
  }
}

export const soundTrack = new LoFiSoundtrackManager();
