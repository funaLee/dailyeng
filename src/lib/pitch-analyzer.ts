/**
 * PitchAnalyzer - Real-time pitch detection using Web Audio API with autocorrelation
 * 
 * This utility class captures audio from the microphone and analyzes the fundamental
 * frequency (F0) of speech in real-time. The collected pitch data is used to calculate
 * intonation scores based on pitch variance.
 * 
 * Key Features:
 * - Uses AnalyserNode to capture time-domain audio data
 * - Implements autocorrelation algorithm to find fundamental frequency (F0)
 * - Runs in a requestAnimationFrame loop during recording
 * - Returns pitch statistics: avgPitch, pitchVariance, sampleCount
 * 
 * Algorithm Overview:
 * 1. Capture Float32Array of time-domain samples
 * 2. Apply autocorrelation to find periodicity  
 * 3. Convert period to frequency (F0 = sampleRate / period)
 * 4. Filter valid speech range (85Hz - 500Hz for human voice)
 * 5. Calculate standard deviation of all collected F0 values
 */

export interface PitchMetrics {
  avgPitch: number | null;
  variance: number | null;
  sampleCount: number;
}

export class PitchAnalyzer {
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private mediaStream: MediaStream | null = null;
  private sourceNode: MediaStreamAudioSourceNode | null = null;
  private animationFrameId: number | null = null;
  private isRunning: boolean = false;

  // Collected pitch samples in Hz
  private pitchSamples: number[] = [];

  // Human voice frequency range (Hz)
  private static readonly MIN_PITCH = 85;   // Low male voice
  private static readonly MAX_PITCH = 500;  // High female voice / children

  // Minimum RMS threshold to ignore silence
  private static readonly MIN_RMS_THRESHOLD = 0.01;

  /**
   * Start pitch analysis by accessing the microphone and setting up the audio pipeline
   */
  async start(): Promise<void> {
    if (this.isRunning) {
      console.warn('[PitchAnalyzer] Already running');
      return;
    }

    try {
      // Request microphone access
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      // Create audio context
      this.audioContext = new AudioContext();
      
      // Create analyser node with appropriate FFT size
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 2048; // Higher FFT size for better frequency resolution
      this.analyser.smoothingTimeConstant = 0;

      // Connect microphone to analyser
      this.sourceNode = this.audioContext.createMediaStreamSource(this.mediaStream);
      this.sourceNode.connect(this.analyser);

      // Reset samples
      this.pitchSamples = [];
      this.isRunning = true;

      // Start analysis loop
      this.analyze();

      console.log('[PitchAnalyzer] Started successfully');
    } catch (error) {
      console.error('[PitchAnalyzer] Failed to start:', error);
      this.cleanup();
      throw error;
    }
  }

  /**
   * Stop pitch analysis and return collected metrics
   */
  stop(): PitchMetrics {
    this.isRunning = false;

    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    this.cleanup();

    const metrics = this.calculateMetrics();
    console.log('[PitchAnalyzer] Stopped. Metrics:', metrics);

    return metrics;
  }

  /**
   * Main analysis loop - runs on each animation frame
   */
  private analyze(): void {
    if (!this.isRunning || !this.analyser || !this.audioContext) {
      return;
    }

    const bufferLength = this.analyser.fftSize;
    const buffer = new Float32Array(bufferLength);
    this.analyser.getFloatTimeDomainData(buffer);

    // Check for sufficient signal (not silence)
    const rms = this.calculateRMS(buffer);
    if (rms > PitchAnalyzer.MIN_RMS_THRESHOLD) {
      const pitch = this.detectPitch(buffer, this.audioContext.sampleRate);
      if (pitch !== null) {
        this.pitchSamples.push(pitch);
        // Log every 10th sample for debugging
        if (this.pitchSamples.length % 10 === 0) {
          console.log(`[PitchAnalyzer] Detected pitch: ${pitch.toFixed(1)} Hz (samples: ${this.pitchSamples.length})`);
        }
      }
    }

    // Continue loop
    this.animationFrameId = requestAnimationFrame(() => this.analyze());
  }

  /**
   * Calculate RMS (Root Mean Square) to detect audio level
   */
  private calculateRMS(buffer: Float32Array): number {
    let sum = 0;
    for (let i = 0; i < buffer.length; i++) {
      sum += buffer[i] * buffer[i];
    }
    return Math.sqrt(sum / buffer.length);
  }

  /**
   * Detect pitch using autocorrelation algorithm
   * Based on the YIN algorithm simplified version
   */
  private detectPitch(buffer: Float32Array, sampleRate: number): number | null {
    const bufferLength = buffer.length;
    
    // Autocorrelation
    const correlations = new Float32Array(bufferLength);
    
    for (let lag = 0; lag < bufferLength; lag++) {
      let sum = 0;
      for (let i = 0; i < bufferLength - lag; i++) {
        sum += buffer[i] * buffer[i + lag];
      }
      correlations[lag] = sum;
    }

    // Find the first significant peak after the zero lag
    // The period corresponds to the lag at this peak
    
    // Calculate the minimum and maximum lags based on frequency range
    const minLag = Math.floor(sampleRate / PitchAnalyzer.MAX_PITCH);
    const maxLag = Math.floor(sampleRate / PitchAnalyzer.MIN_PITCH);

    let maxCorrelation = 0;
    let bestLag = 0;

    // Skip the first few lags (they include the DC component)
    for (let lag = minLag; lag < Math.min(maxLag, bufferLength); lag++) {
      if (correlations[lag] > maxCorrelation) {
        maxCorrelation = correlations[lag];
        bestLag = lag;
      }
    }

    // Verify this is a significant peak
    if (maxCorrelation < correlations[0] * 0.3) {
      return null; // No clear periodicity found
    }

    // Parabolic interpolation for better precision
    let refinedLag = bestLag;
    if (bestLag > 0 && bestLag < bufferLength - 1) {
      const prev = correlations[bestLag - 1];
      const curr = correlations[bestLag];
      const next = correlations[bestLag + 1];
      refinedLag = bestLag + (prev - next) / (2 * (prev - 2 * curr + next));
    }

    // Convert lag to frequency
    const frequency = sampleRate / refinedLag;

    // Validate within human voice range
    if (frequency >= PitchAnalyzer.MIN_PITCH && frequency <= PitchAnalyzer.MAX_PITCH) {
      return frequency;
    }

    return null;
  }

  /**
   * Calculate pitch metrics from collected samples
   */
  private calculateMetrics(): PitchMetrics {
    const sampleCount = this.pitchSamples.length;

    if (sampleCount === 0) {
      return {
        avgPitch: null,
        variance: null,
        sampleCount: 0,
      };
    }

    // Calculate average pitch
    const sum = this.pitchSamples.reduce((acc, val) => acc + val, 0);
    const avgPitch = sum / sampleCount;

    // Calculate variance (standard deviation)
    let varianceSum = 0;
    for (const pitch of this.pitchSamples) {
      varianceSum += (pitch - avgPitch) ** 2;
    }
    const variance = Math.sqrt(varianceSum / sampleCount);

    return {
      avgPitch: Math.round(avgPitch * 100) / 100,
      variance: Math.round(variance * 100) / 100,
      sampleCount,
    };
  }

  /**
   * Clean up resources
   */
  private cleanup(): void {
    if (this.sourceNode) {
      this.sourceNode.disconnect();
      this.sourceNode = null;
    }

    if (this.analyser) {
      this.analyser.disconnect();
      this.analyser = null;
    }

    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }

    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
      this.mediaStream = null;
    }
  }
}
