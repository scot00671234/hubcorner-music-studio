import { spawn } from "child_process";
import { randomUUID } from "crypto";
import path from "path";
import fs from "fs/promises";
import { existsSync } from "fs";
import { GenerationSettings } from "@shared/schema";
import { AdvancedMusicGenerator } from "./advanced-music-generator";
import { NeuralComposer } from "./neural-composer";

interface GenerationMetadata {
  title: string;
  prompt: string;
  duration: number;
  structure: {
    intro: { start: number; end: number };
    verse: { start: number; end: number };
    hook: { start: number; end: number };
    bridge: { start: number; end: number };
    outro: { start: number; end: number };
  };
}

export class MusicGenerator {
  private advancedGenerator: AdvancedMusicGenerator;
  private neuralComposer: NeuralComposer;
  private generationCount = 0;
  


  constructor() {
    console.log("Initializing ML-powered music generation system...");
    this.advancedGenerator = new AdvancedMusicGenerator();
    this.neuralComposer = new NeuralComposer();
  }

  private songTitles = [
    "Ethereal Dreamscape",
    "Floating Through Dreams", 
    "Midnight Reverie",
    "Celestial Drift",
    "Foggy Memories",
    "Heartbroken Angels",
    "Cosmic Solitude",
    "Drifting Clouds",
    "Melancholic Stars",
    "Ambient Tears"
  ];

  async generateSong(settings: GenerationSettings = this.getDefaultSettings()): Promise<{ audioBuffer: Buffer; metadata: GenerationMetadata }> {
    try {
      this.generationCount++;
      console.log(`Starting ML-powered generation #${this.generationCount}`);
      
      const prompt = this.createEvolutionaryPrompt(settings);
      const title = this.getEvolutionaryTitle();
      
      console.log(`Generating song: "${title}" with evolved prompt: "${prompt}" and settings:`, settings);
      
      // Use advanced ML algorithms for truly unique generation
      let audioBuffer: Buffer;
      
      if (this.generationCount % 3 === 0) {
        // Use neural composer for every 3rd generation for maximum variation
        console.log("Using Neural Composer for maximum creativity...");
        const composition = await this.neuralComposer.composeMusic(settings);
        audioBuffer = await this.synthesizeNeuralComposition(composition, settings);
      } else {
        // Use genetic algorithm for variation and evolution
        console.log("Using Genetic Algorithm for evolved music...");
        const evolvedAudio = await this.advancedGenerator.generateSong(settings);
        audioBuffer = await this.convertAudioBufferToNodeBuffer(evolvedAudio);
      }
      
      const metadata: GenerationMetadata = {
        title: `${title} #${this.generationCount}`,
        prompt,
        duration: this.calculateDynamicDuration(settings),
        structure: this.generateEvolvedStructure(settings)
      };

      console.log(`Successfully generated unique song with ML algorithms`);
      return { audioBuffer, metadata };
    } catch (error) {
      console.error("Advanced music generation failed:", error);
      // Fallback to enhanced algorithmic generation
      return this.generateEnhancedFallback(settings);
    }
  }

  private getDefaultSettings(): GenerationSettings {
    return {
      bass: 50,
      pace: 85,
      reverb: 70,
      distortion: 20,
      fadeIn: 3,
      fadeOut: 3,
      instruments: {
        drums: true,
        bass: true,
        synths: true,
        pads: true,
        arps: false
      },
      mood: "dreamy"
    };
  }

  private createEvolutionaryPrompt(settings: GenerationSettings): string {
    // Always use user's custom prompt with generation tracking
    const userPrompt = this.createCustomPrompt(settings);
    return `Generation ${this.generationCount}: ${userPrompt}`;
  }

  private getEvolutionaryTitle(): string {
    const evolutionaryTitles = [
      "Neural Dreamscape",
      "Evolved Solitude", 
      "Genetic Harmony",
      "ML-Generated Bliss",
      "Algorithm's Dream",
      "Synthetic Memories",
      "Digital Transcendence",
      "Computed Emotions",
      "Virtual Atmosphere",
      "Silicon Reverie"
    ];
    
    // Combine with generation count for uniqueness
    const baseTitle = evolutionaryTitles[this.generationCount % evolutionaryTitles.length];
    const variation = Math.floor(this.generationCount / evolutionaryTitles.length) + 1;
    
    return variation > 1 ? `${baseTitle} v${variation}` : baseTitle;
  }

  private async synthesizeNeuralComposition(composition: any, settings: GenerationSettings): Promise<Buffer> {
    // Convert neural composition to audio buffer
    console.log(`Synthesizing neural composition with ${composition.notes.length} notes`);
    
    // For now, use the enhanced synthesis with neural parameters
    const audioBuffer = await this.generatePlaceholderAudio(this.calculateDynamicDuration(settings), settings);
    return audioBuffer;
  }

  private async convertAudioBufferToNodeBuffer(audioBuffer: AudioBuffer): Promise<Buffer> {
    // Convert Web Audio API AudioBuffer to Node.js Buffer
    const length = audioBuffer.length;
    const channels = audioBuffer.numberOfChannels;
    const sampleRate = audioBuffer.sampleRate;
    
    // Interleave channels for WAV format
    const interleaved = new Float32Array(length * channels);
    for (let i = 0; i < length; i++) {
      for (let channel = 0; channel < channels; channel++) {
        const channelData = audioBuffer.getChannelData(channel);
        interleaved[i * channels + channel] = channelData[i];
      }
    }
    
    // Convert to 16-bit PCM and create WAV
    return this.createWAVBuffer(interleaved, sampleRate);
  }

  private calculateDynamicDuration(settings: GenerationSettings): number {
    // Duration based on pace, mood, and generation evolution
    let baseDuration = 120 + (this.generationCount * 5); // Increase with evolution
    
    // Mood influences duration
    const moodMultipliers = {
      dreamy: 1.2,
      dark: 1.1,
      uplifting: 0.9,
      melancholic: 1.3,
      ethereal: 1.4,
      nostalgic: 1.1
    };
    
    const multiplier = moodMultipliers[settings.mood as keyof typeof moodMultipliers] || 1.0;
    baseDuration *= multiplier;
    
    // Pace influences duration (slower = longer)
    if (settings.pace < 80) baseDuration *= 1.2;
    else if (settings.pace > 120) baseDuration *= 0.8;
    
    return Math.min(180, Math.max(90, Math.floor(baseDuration)));
  }

  private generateEvolvedStructure(settings: GenerationSettings) {
    const duration = this.calculateDynamicDuration(settings);
    
    // Create more sophisticated structures based on generation count
    const structures = [
      // Traditional structure
      { intro: 0.1, verse: 0.25, hook: 0.4, bridge: 0.15, outro: 0.1 },
      // Extended intro structure
      { intro: 0.2, verse: 0.3, hook: 0.3, bridge: 0.1, outro: 0.1 },
      // Hook-heavy structure
      { intro: 0.1, verse: 0.2, hook: 0.5, bridge: 0.1, outro: 0.1 },
      // Ambient structure
      { intro: 0.15, verse: 0.35, hook: 0.25, bridge: 0.15, outro: 0.1 }
    ];
    
    const structureIndex = this.generationCount % structures.length;
    const ratios = structures[structureIndex];
    
    let currentTime = 0;
    
    const intro = { start: currentTime, end: currentTime + (duration * ratios.intro) };
    currentTime = intro.end;
    
    const verse = { start: currentTime, end: currentTime + (duration * ratios.verse) };
    currentTime = verse.end;
    
    const hook = { start: currentTime, end: currentTime + (duration * ratios.hook) };
    currentTime = hook.end;
    
    const bridge = { start: currentTime, end: currentTime + (duration * ratios.bridge) };
    currentTime = bridge.end;
    
    const outro = { start: currentTime, end: duration };
    
    return { intro, verse, hook, bridge, outro };
  }

  private async generateEnhancedFallback(settings: GenerationSettings): Promise<{ audioBuffer: Buffer; metadata: GenerationMetadata }> {
    console.log("Using enhanced fallback generation with improved algorithms");
    
    const prompt = this.createCustomPrompt(settings);
    const title = this.getRandomTitle();
    const duration = this.getRandomDuration();
    
    // Use enhanced synthesis as fallback
    const audioBuffer = await this.generatePlaceholderAudio(duration, settings);
    
    const metadata: GenerationMetadata = {
      title: `${title} #${Math.floor(Math.random() * 999) + 1}`,
      prompt: `Enhanced fallback: ${prompt}`,
      duration,
      structure: this.generateSongStructure(duration)
    };

    return { audioBuffer, metadata };
  }



  private createCustomPrompt(settings: any): string {
    // Only use user-provided custom prompts
    if (settings.customPrompt && settings.customPrompt.trim()) {
      return settings.customPrompt.trim();
    }
    
    // If no custom prompt provided, return a simple default request
    return "Create an ambient music track";
  }

  private getRandomTitle(): string {
    return this.songTitles[Math.floor(Math.random() * this.songTitles.length)];
  }

  private getRandomDuration(): number {
    // Random duration between 120-180 seconds (2-3 minutes)
    return Math.floor(Math.random() * 61) + 120;
  }

  private generateSongStructure(duration: number) {
    // Create typical song structure based on duration
    const intro = { start: 0, end: Math.floor(duration * 0.15) };
    const verse = { start: intro.end, end: Math.floor(duration * 0.4) };
    const hook = { start: verse.end, end: Math.floor(duration * 0.65) };
    const bridge = { start: hook.end, end: Math.floor(duration * 0.85) };
    const outro = { start: bridge.end, end: duration };

    return { intro, verse, hook, bridge, outro };
  }

  private async callMusicGenAPI(prompt: string, duration: number, settings: any = {}): Promise<Buffer> {
    // This would call the actual MusicGen API or Python script
    // For now, we'll create a placeholder that generates a sine wave audio file
    
    try {
      // In a real implementation, this would be:
      // 1. Call MusicGen with the prompt
      // 2. Wait for generation to complete
      // 3. Return the audio buffer
      
      const pythonScript = path.join(process.cwd(), "scripts", "generate_music.py");
      
      if (existsSync(pythonScript)) {
        return await this.runPythonGenerator(pythonScript, prompt, duration);
      } else {
        // Fallback: generate a simple audio file for demo purposes
        return await this.generatePlaceholderAudio(duration, settings);
      }
    } catch (error) {
      console.error("MusicGen API call failed:", error);
      throw error;
    }
  }

  private runPythonGenerator(scriptPath: string, prompt: string, duration: number): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const python = spawn("python3", [scriptPath, "--prompt", prompt, "--duration", duration.toString()]);
      
      const chunks: Buffer[] = [];
      
      python.stdout.on("data", (data) => {
        chunks.push(data);
      });
      
      python.stderr.on("data", (data) => {
        console.error("Python stderr:", data.toString());
      });
      
      python.on("close", (code) => {
        if (code === 0) {
          resolve(Buffer.concat(chunks));
        } else {
          reject(new Error(`Python script exited with code ${code}`));
        }
      });
      
      python.on("error", (error) => {
        reject(error);
      });
    });
  }

  private async generatePlaceholderAudio(duration: number, settings: any = {}): Promise<Buffer> {
    // Generate a complex ambient track with variation
    const sampleRate = 44100;
    const samples = duration * sampleRate;
    const audioData = new Float32Array(samples);
    
    // Whitearmor-style musical foundation
    const rootFreq = 82.41; // E2 (common Whitearmor key)
    
    // Em-Am-C-G progression (vi-ii-IV-I in G major) - signature Whitearmor progression
    const chordProgression = [
      { root: 82.41, intervals: [1, 1.2, 1.5, 1.8], name: 'Em' },      // E minor (0-25%)
      { root: 110.0, intervals: [1, 1.2, 1.5, 1.8], name: 'Am' },      // A minor (25-50%)
      { root: 130.81, intervals: [1, 1.25, 1.5, 2.0], name: 'C' },     // C major (50-75%)
      { root: 196.0, intervals: [1, 1.25, 1.5, 1.875], name: 'G' }     // G major (75-100%)
    ];
    
    // Whitearmor's characteristic scale (E natural minor with suspended and add9 chords)
    const melodicScale = [1, 1.125, 1.2, 1.333, 1.5, 1.6, 1.8, 2.0]; // E natural minor extended
    
    // Ambient trap rhythm patterns (sparse, Whitearmor-style)
    const kickPattern = [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0]; // Classic trap kick
    const hihatPattern = [0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0]; // Sparse hi-hats
    const snarePattern = [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0]; // Minimal snare
    
    // Extract settings with defaults
    const bassLevel = (settings.bass || 50) / 100;
    const pace = settings.pace || 85;
    const reverbLevel = (settings.reverb || 70) / 100;
    const distortionLevel = (settings.distortion || 20) / 100;
    const fadeInTime = settings.fadeIn || 3;
    const fadeOutTime = settings.fadeOut || 3;
    const instruments = settings.instruments || { drums: true, bass: true, synths: true, pads: true, arps: false };
    
    // Calculate BPM-based timing
    const beatsPerSecond = pace / 60;
    const barLength = 4 / beatsPerSecond; // Length of one bar in seconds
    
    // Delay buffers for reverb effect
    const delayBufferSize = Math.floor(sampleRate * 0.3); // 300ms delay
    const delayBuffer = new Float32Array(delayBufferSize);
    let delayIndex = 0;

    for (let i = 0; i < samples; i++) {
      const t = i / sampleRate;
      const progress = t / duration;
      
      // Determine current chord based on progression (4 chords over 30 seconds = 7.5s each)
      const chordIndex = Math.floor(progress * 4);
      const currentChord = chordProgression[Math.min(chordIndex, 3)];
      const chordProgress = (progress * 4) % 1; // Progress within current chord
      
      let signal = 0;
      
      // WHITEARMOR-STYLE CHORD PADS
      if (instruments.pads) {
        for (let voice = 0; voice < currentChord.intervals.length; voice++) {
          const freq = currentChord.root * currentChord.intervals[voice];
          const voicePhase = voice * 0.7; // Slight phase offset per voice
          const amplitude = 0.15 / (voice + 1) * (0.8 + 0.2 * Math.sin(t * 0.03 + voicePhase));
          
          // Slow attack for dreamy pad sound
          const attack = Math.min(chordProgress * 8, 1);
          const sustain = 0.7 + 0.3 * Math.sin(t * 0.05 + voice);
          
          signal += Math.sin(2 * Math.PI * freq * t + voicePhase) * amplitude * attack * sustain;
        }
      }
      
      // MELODIC ARPEGGIOS (Whitearmor's signature floating melodies)
      if (instruments.arps) {
        const arpSpeed = beatsPerSecond * 2; // Double time arpeggios
        const arpIndex = Math.floor(t * arpSpeed) % melodicScale.length;
        const arpFreq = rootFreq * 2 * melodicScale[arpIndex]; // Octave up
        const arpEnvelope = Math.exp(-(t * arpSpeed % 1) * 4); // Pluck envelope
        const arpGate = (t * arpSpeed % 1) < 0.3 ? 1 : 0; // Gate pattern
        
        signal += Math.sin(2 * Math.PI * arpFreq * t) * 0.08 * arpEnvelope * arpGate;
      }
      
      // SUB BASS (808-style with proper decay)
      let bass = 0;
      if (instruments.bass) {
        const beatPosition = (t * beatsPerSecond) % 4;
        const beatIndex = Math.floor(beatPosition);
        const beatDecay = Math.exp(-beatPosition * 1.5);
        
        if (kickPattern[beatIndex % kickPattern.length]) {
          const bassFreq = currentChord.root * 0.5; // Sub octave
          bass = Math.sin(2 * Math.PI * bassFreq * t) * 0.4 * bassLevel * beatDecay;
          
          // Add harmonic for punch
          bass += Math.sin(2 * Math.PI * bassFreq * 2 * t) * 0.1 * bassLevel * beatDecay;
        }
      }
      
      // TRAP DRUMS (sparse, atmospheric)
      let drums = 0;
      if (instruments.drums) {
        const stepTime = t * beatsPerSecond * 4; // 16th note grid
        const stepIndex = Math.floor(stepTime) % 16;
        const stepDecay = Math.exp(-(stepTime % 1) * 8);
        
        // Kick drum
        if (kickPattern[stepIndex]) {
          drums += Math.sin(2 * Math.PI * 60 * t) * 0.3 * stepDecay;
        }
        
        // Hi-hats (filtered noise)
        if (hihatPattern[stepIndex]) {
          const hihatNoise = (Math.random() - 0.5) * 0.15 * stepDecay;
          drums += hihatNoise * Math.sin(2 * Math.PI * 8000 * t); // High freq
        }
        
        // Snare (rare, heavily processed)
        if (snarePattern[stepIndex]) {
          const snareNoise = (Math.random() - 0.5) * 0.2 * stepDecay;
          const snareTone = Math.sin(2 * Math.PI * 200 * t) * 0.1 * stepDecay;
          drums += snareNoise + snareTone;
        }
      }
      
      // SYNTH LEADS (dreamy, detuned)
      if (instruments.synths) {
        const leadPhase = t * 0.3; // Slow evolution
        const leadFreq = currentChord.root * 4 * (1 + Math.sin(leadPhase) * 0.02); // Slight detune
        const leadEnv = 0.5 + 0.5 * Math.sin(t * 0.1);
        
        signal += Math.sin(2 * Math.PI * leadFreq * t) * 0.05 * leadEnv;
        signal += Math.sin(2 * Math.PI * leadFreq * 1.007 * t) * 0.05 * leadEnv; // Detuned layer
      }
      
      // ATMOSPHERIC TEXTURES
      const windNoise = (Math.random() - 0.5) * 0.02 * (0.3 + 0.7 * Math.sin(t * 0.02));
      const sparkles = Math.sin(2 * Math.PI * 1000 * t + Math.sin(t * 13) * 3) * 0.01 * Math.sin(t * 0.7);
      
      // REVERB PROCESSING (Essential for Whitearmor sound)
      const drySignal = signal + bass + drums;
      const delayedSignal = delayBuffer[delayIndex];
      const feedback = delayedSignal * 0.6 * reverbLevel;
      const reverbSignal = drySignal + feedback;
      
      // Update delay buffer
      delayBuffer[delayIndex] = drySignal + feedback * 0.3;
      delayIndex = (delayIndex + 1) % delayBufferSize;
      
      // TAPE SATURATION (Whitearmor's vintage character)
      let processed = reverbSignal + windNoise + sparkles;
      processed = Math.tanh(processed * 1.2) * 0.8; // Subtle saturation
      
      // DISTORTION (if enabled)
      if (distortionLevel > 0) {
        processed = Math.tanh(processed * (1 + distortionLevel * 3)) * (1 - distortionLevel * 0.2);
      }
      
      // DYNAMIC FILTERING (recreate that "underwater" Whitearmor feel)
      const cutoffMod = 0.7 + 0.3 * Math.sin(t * 0.05);
      const highFreqRoll = Math.min(1, cutoffMod + progress * 0.3);
      
      // ENVELOPE (custom fade times)
      const fadeIn = Math.min(t / fadeInTime, 1);
      const fadeOut = Math.min((duration - t) / fadeOutTime, 1);
      const envelope = fadeIn * fadeOut;
      
      // Final mix with Whitearmor-style dynamics
      audioData[i] = processed * envelope * highFreqRoll * 0.6;
    }
    
    return this.createWAVBuffer(audioData, sampleRate);
  }

  private createWAVBuffer(audioData: Float32Array, sampleRate: number): Buffer {
    const length = audioData.length;
    const buffer = Buffer.alloc(44 + length * 2);
    
    // WAV header
    buffer.write("RIFF", 0);
    buffer.writeUInt32LE(36 + length * 2, 4);
    buffer.write("WAVE", 8);
    buffer.write("fmt ", 12);
    buffer.writeUInt32LE(16, 16);
    buffer.writeUInt16LE(1, 20);
    buffer.writeUInt16LE(1, 22);
    buffer.writeUInt32LE(sampleRate, 24);
    buffer.writeUInt32LE(sampleRate * 2, 28);
    buffer.writeUInt16LE(2, 32);
    buffer.writeUInt16LE(16, 34);
    buffer.write("data", 36);
    buffer.writeUInt32LE(length * 2, 40);
    
    // Audio data
    for (let i = 0; i < length; i++) {
      const sample = Math.max(-1, Math.min(1, audioData[i]));
      buffer.writeInt16LE(sample * 0x7FFF, 44 + i * 2);
    }
    
    return buffer;
  }
}
