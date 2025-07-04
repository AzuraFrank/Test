class AudioEngine {
  constructor() {
    this.audioContext = null;
    this.sourceNode = null;
    this.gainNode = null;
    this.reverbNode = null;
    this.pitchShiftNode = null;
    this.analyzerNode = null;
    this.mediaRecorder = null;
    this.recordingChunks = [];
    this.isInitialized = false;
    this.currentStream = null;
    this.canvas = null;
    this.canvasContext = null;
    this.animationFrame = null;
  }

  async initialize() {
    if (this.isInitialized) return;

    try {
      // Initialize Web Audio API
      this.audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();

      // Create audio nodes
      this.gainNode = this.audioContext.createGain();
      this.analyzerNode = this.audioContext.createAnalyser();
      this.reverbNode = this.createReverbNode();

      // Connect nodes
      this.gainNode.connect(this.reverbNode);
      this.reverbNode.connect(this.analyzerNode);
      this.analyzerNode.connect(this.audioContext.destination);

      // Configure analyzer for visualization
      this.analyzerNode.fftSize = 256;
      this.analyzerNode.smoothingTimeConstant = 0.8;

      this.isInitialized = true;
    } catch (error) {
      console.error("Failed to initialize audio engine:", error);
      throw error;
    }
  }

  createReverbNode() {
    const convolver = this.audioContext.createConvolver();
    const impulseResponse = this.createImpulseResponse(2, 2, false);
    convolver.buffer = impulseResponse;
    return convolver;
  }

  createImpulseResponse(duration, decay, reverse) {
    const sampleRate = this.audioContext.sampleRate;
    const length = sampleRate * duration;
    const impulse = this.audioContext.createBuffer(2, length, sampleRate);

    for (let channel = 0; channel < 2; channel++) {
      const channelData = impulse.getChannelData(channel);
      for (let i = 0; i < length; i++) {
        const n = reverse ? length - i : i;
        channelData[i] =
          (Math.random() * 2 - 1) * Math.pow(1 - n / length, decay);
      }
    }
    return impulse;
  }

  async getMicrophoneAccess() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      this.currentStream = stream;
      return stream;
    } catch (error) {
      console.error("Microphone access denied:", error);
      throw error;
    }
  }

  async play(audioUrl = null) {
    await this.initialize();

    if (audioUrl) {
      // Load and play actual audio file
      try {
        const response = await fetch(audioUrl);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer =
          await this.audioContext.decodeAudioData(arrayBuffer);

        this.sourceNode = this.audioContext.createBufferSource();
        this.sourceNode.buffer = audioBuffer;

        // Connect source to our audio chain
        this.sourceNode.connect(this.gainNode);

        // Start playback
        this.sourceNode.start();

        // Set duration
        this.duration = audioBuffer.duration;
        this.startTime = this.audioContext.currentTime;

        // Start visualization
        this.startVisualization();

        return Promise.resolve();
      } catch (error) {
        console.warn("Failed to load audio file, using demo tone:", error);
        // Fallback to demo tone
        return this.playDemoTone();
      }
    } else {
      // Demo tone for songs without audio
      return this.playDemoTone();
    }
  }

  playDemoTone() {
    // Create a pleasant demo melody
    this.sourceNode = this.audioContext.createOscillator();
    this.sourceNode.frequency.setValueAtTime(
      440,
      this.audioContext.currentTime,
    );
    this.sourceNode.type = "sine";

    // Add some modulation for a more pleasant sound
    const modulator = this.audioContext.createOscillator();
    const modulatorGain = this.audioContext.createGain();
    modulator.frequency.value = 5;
    modulatorGain.gain.value = 50;

    modulator.connect(modulatorGain);
    modulatorGain.connect(this.sourceNode.frequency);

    // Connect source to our audio chain
    this.sourceNode.connect(this.gainNode);

    // Start the tone and modulation
    modulator.start();
    this.sourceNode.start();

    // Start visualization
    this.startVisualization();

    return Promise.resolve();
  }

  pause() {
    if (this.sourceNode) {
      this.sourceNode.stop();
      this.sourceNode = null;
    }
    this.stopVisualization();
  }

  setVolume(volume) {
    if (this.gainNode) {
      this.gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
    }
  }

  setPitch(semitones) {
    // Pitch shifting is complex in Web Audio API
    // This is a simplified implementation
    if (this.sourceNode && this.sourceNode.frequency) {
      const baseFrequency = 440;
      const newFrequency = baseFrequency * Math.pow(2, semitones / 12);
      this.sourceNode.frequency.setValueAtTime(
        newFrequency,
        this.audioContext.currentTime,
      );
    }
  }

  setReverb(amount) {
    if (this.reverbNode && this.gainNode) {
      // Create a dry/wet mix for reverb
      const dryGain = this.audioContext.createGain();
      const wetGain = this.audioContext.createGain();

      dryGain.gain.setValueAtTime(1 - amount, this.audioContext.currentTime);
      wetGain.gain.setValueAtTime(amount, this.audioContext.currentTime);
    }
  }

  setAutoTune(enabled) {
    // Auto-tune implementation would require more complex pitch detection and correction
    // This is a placeholder for the actual implementation
    console.log("Auto-tune", enabled ? "enabled" : "disabled");
  }

  async startRecording() {
    await this.initialize();
    const stream = await this.getMicrophoneAccess();

    // Set up MediaRecorder
    this.mediaRecorder = new MediaRecorder(stream, {
      mimeType: "audio/webm;codecs=opus",
    });

    this.recordingChunks = [];

    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        this.recordingChunks.push(event.data);
      }
    };

    this.mediaRecorder.start(100); // Collect data every 100ms

    // Also connect microphone to our audio processing chain for real-time effects
    const micSource = this.audioContext.createMediaStreamSource(stream);
    micSource.connect(this.gainNode);
  }

  async stopRecording() {
    return new Promise((resolve) => {
      if (this.mediaRecorder && this.mediaRecorder.state !== "inactive") {
        this.mediaRecorder.onstop = () => {
          const blob = new Blob(this.recordingChunks, { type: "audio/webm" });
          const audioUrl = URL.createObjectURL(blob);
          resolve({ blob, url: audioUrl });
        };

        this.mediaRecorder.stop();

        // Stop microphone stream
        if (this.currentStream) {
          this.currentStream.getTracks().forEach((track) => track.stop());
          this.currentStream = null;
        }
      }
    });
  }

  getCurrentTime() {
    if (!this.audioContext || !this.startTime) {
      return 0;
    }

    // Calculate elapsed time since playback started
    const elapsed = this.audioContext.currentTime - this.startTime;
    return Math.max(0, elapsed);
  }

  setupVisualization(canvas) {
    this.canvas = canvas;
    this.canvasContext = canvas.getContext("2d");
  }

  startVisualization() {
    if (!this.canvas || !this.analyzerNode) return;

    const bufferLength = this.analyzerNode.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      this.animationFrame = requestAnimationFrame(draw);

      this.analyzerNode.getByteFrequencyData(dataArray);

      const canvas = this.canvas;
      const ctx = this.canvasContext;
      const width = canvas.width;
      const height = canvas.height;

      // Clear canvas
      ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
      ctx.fillRect(0, 0, width, height);

      // Draw frequency bars
      const barWidth = (width / bufferLength) * 2.5;
      let barHeight;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        barHeight = (dataArray[i] / 255) * height * 0.8;

        // Create gradient for bars
        const gradient = ctx.createLinearGradient(
          0,
          height,
          0,
          height - barHeight,
        );
        gradient.addColorStop(0, "#ff6b6b");
        gradient.addColorStop(1, "#feca57");

        ctx.fillStyle = gradient;
        ctx.fillRect(x, height - barHeight, barWidth, barHeight);

        x += barWidth + 1;
      }

      // Draw waveform in center
      this.analyzerNode.getByteTimeDomainData(dataArray);
      ctx.lineWidth = 3;
      ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
      ctx.beginPath();

      const sliceWidth = width / bufferLength;
      let x2 = 0;

      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = (v * height) / 4 + height / 2;

        if (i === 0) {
          ctx.moveTo(x2, y);
        } else {
          ctx.lineTo(x2, y);
        }

        x2 += sliceWidth;
      }

      ctx.stroke();
    };

    draw();
  }

  stopVisualization() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
  }

  cleanup() {
    this.stopVisualization();

    if (this.sourceNode) {
      this.sourceNode.stop();
    }

    if (this.currentStream) {
      this.currentStream.getTracks().forEach((track) => track.stop());
    }

    if (this.audioContext && this.audioContext.state !== "closed") {
      this.audioContext.close();
    }
  }
}

export default AudioEngine;
