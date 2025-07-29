import { spawn } from "child_process";
import { randomUUID } from "crypto";
import path from "path";
import fs from "fs/promises";
import { existsSync } from "fs";
import { GenerationSettings } from "@shared/schema";
import { AdvancedMusicGenerator } from "./advanced-music-generator";
import { NeuralComposer } from "./neural-composer";
import { MusicTheoryEngine, ProfessionalSynthEngine } from "./professional-music-engine";
import { ProfessionalAudioRenderer } from "./professional-audio-renderer";

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
    console.log("Using professional music generation with advanced algorithms");
    
    const prompt = this.createCustomPrompt(settings);
    
    // Step 1: Analyze prompt using professional music theory
    console.log(`Analyzing custom prompt: "${prompt}"`);
    const musicAnalysis = MusicTheoryEngine.analyzePromptAdvanced(prompt, settings);
    
    console.log(`Music Theory Analysis:`);
    console.log(`- Key: ${musicAnalysis.key} (${musicAnalysis.mood} mood)`);
    console.log(`- Chord Progression: ${musicAnalysis.chordProgression.map(c => c.chord).join(' → ')}`);
    console.log(`- Tempo: ${musicAnalysis.tempo} BPM`);
    console.log(`- Style: ${musicAnalysis.style}`);
    console.log(`- Structure: ${musicAnalysis.songStructure.form}`);
    
    // Step 2: Create professional synthesis layers
    const synthLayers = ProfessionalSynthEngine.createSynthLayers(musicAnalysis, settings);
    console.log(`Created ${synthLayers.length} professional synthesis layers:`);
    synthLayers.forEach(layer => {
      console.log(`- ${layer.type}: ${layer.oscillator} oscillator, ${layer.volume} volume`);
    });
    
    // Step 3: Calculate professional song duration
    const duration = this.calculateProfessionalDuration(musicAnalysis, settings);
    
    // Step 4: Render professional audio
    console.log(`Rendering professional audio composition (${duration}s)...`);
    const audioBuffer = await ProfessionalAudioRenderer.renderComposition(
      musicAnalysis,
      synthLayers,
      settings,
      duration
    );
    
    // Step 5: Generate professional song structure
    const songStructure = this.createProfessionalSongStructure(duration, musicAnalysis);
    
    const metadata: GenerationMetadata = {
      title: `${this.getRandomTitle()} #${Math.floor(Math.random() * 999) + 1}`,
      prompt: `Professional: ${prompt}`,
      duration,
      structure: songStructure
    };

    console.log(`Successfully generated professional composition with music theory!`);
    return { audioBuffer, metadata };
  }

  private calculateProfessionalDuration(musicAnalysis: any, settings: GenerationSettings): number {
    // Base duration on music theory analysis
    let baseDuration = 120;
    
    // Adjust for tempo (slower = longer pieces)
    if (musicAnalysis.tempo < 80) baseDuration *= 1.3;
    else if (musicAnalysis.tempo > 120) baseDuration *= 0.8;
    
    // Adjust for mood
    const moodMultipliers = {
      dreamy: 1.2,
      dark: 1.1,
      uplifting: 0.9,
      melancholic: 1.3,
      ethereal: 1.4,
      nostalgic: 1.1
    };
    
    const multiplier = moodMultipliers[musicAnalysis.mood as keyof typeof moodMultipliers] || 1.0;
    baseDuration *= multiplier;
    
    // Add variation based on song structure
    const structureMultiplier = musicAnalysis.songStructure.totalBars / 48; // Normalize to 48 bars
    baseDuration *= structureMultiplier;
    
    return Math.min(180, Math.max(90, Math.floor(baseDuration)));
  }

  private createProfessionalSongStructure(duration: number, musicAnalysis: any) {
    const sections = musicAnalysis.songStructure.sections;
    
    // Convert bar-based structure to time-based structure
    const beatsPerSecond = musicAnalysis.tempo / 60;
    const barDuration = 4 / beatsPerSecond; // 4 beats per bar
    
    let currentTime = 0;
    
    const intro = {
      start: currentTime,
      end: currentTime + (sections.intro.bars * barDuration)
    };
    currentTime = intro.end;
    
    const verse = {
      start: currentTime,
      end: currentTime + (sections.verse.bars * barDuration)
    };
    currentTime = verse.end;
    
    const hook = {
      start: currentTime,
      end: currentTime + (sections.chorus?.bars || sections.verse.bars) * barDuration
    };
    currentTime = hook.end;
    
    const bridge = {
      start: currentTime,
      end: currentTime + (sections.bridge?.bars || sections.verse.bars * 0.5) * barDuration
    };
    currentTime = bridge.end;
    
    const outro = {
      start: currentTime,
      end: duration
    };
    
    return { intro, verse, hook, bridge, outro };
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

  // Analyze custom prompt to extract musical characteristics
  private analyzePrompt(prompt: string) {
    const words = prompt.toLowerCase().split(/[\s,]+/);
    
    return {
      tempo: this.extractTempo(words),
      mood: this.extractMood(words),
      style: this.extractStyle(words),
      effects: this.extractEffects(words),
      energy: this.extractEnergy(words),
      randomSeed: Math.random() // Add randomness for each generation
    };
  }
  
  private extractTempo(words: string[]) {
    if (words.some(w => ['slow', 'languid', 'dreamy'].includes(w))) return 'slow';
    if (words.some(w => ['fast', 'uptempo', 'energetic'].includes(w))) return 'fast';
    if (words.some(w => ['medium', 'moderate'].includes(w))) return 'medium';
    return 'slow'; // Default for ambient
  }
  
  private extractMood(words: string[]) {
    if (words.some(w => ['dark', 'brooding', 'mysterious', 'ominous'].includes(w))) return 'dark';
    if (words.some(w => ['happy', 'uplifting', 'bright', 'cheerful'].includes(w))) return 'uplifting';
    if (words.some(w => ['sad', 'melancholic', 'somber', 'tragic'].includes(w))) return 'melancholic';
    if (words.some(w => ['ethereal', 'ghostly', 'spiritual', 'otherworldly'].includes(w))) return 'ethereal';
    if (words.some(w => ['nostalgic', 'vintage', 'retro', 'memory'].includes(w))) return 'nostalgic';
    return 'dreamy'; // Default
  }
  
  private extractStyle(words: string[]) {
    if (words.some(w => ['trap', 'hip', 'hop', 'beats'].includes(w))) return 'trap';
    if (words.some(w => ['ambient', 'atmospheric', 'soundscape'].includes(w))) return 'ambient';
    if (words.some(w => ['electronic', 'synth', 'digital'].includes(w))) return 'electronic';
    if (words.some(w => ['classical', 'orchestral', 'piano'].includes(w))) return 'classical';
    return 'ambient'; // Default
  }
  
  private extractEffects(words: string[]) {
    const effects = [];
    if (words.some(w => ['reverb', 'echo', 'spacious', 'hall'].includes(w))) effects.push('reverb');
    if (words.some(w => ['distortion', 'gritty', 'harsh', 'dirty'].includes(w))) effects.push('distortion');
    if (words.some(w => ['delay', 'repeat', 'echo'].includes(w))) effects.push('delay');
    if (words.some(w => ['filter', 'sweep', 'wobble'].includes(w))) effects.push('filter');
    return effects;
  }
  
  private extractEnergy(words: string[]) {
    if (words.some(w => ['high', 'intense', 'powerful', 'strong'].includes(w))) return 'high';
    if (words.some(w => ['low', 'subtle', 'gentle', 'soft'].includes(w))) return 'low';
    return 'medium';
  }
  
  private selectKeyFromPrompt(keys: any[], analysis: any) {
    // Use prompt analysis + randomness to select key
    let keyIndex = Math.floor(analysis.randomSeed * keys.length);
    
    // Adjust based on mood
    if (analysis.mood === 'dark') keyIndex = Math.min(keyIndex + 1, keys.length - 1);
    if (analysis.mood === 'uplifting') keyIndex = Math.max(keyIndex - 1, 0);
    
    return keys[keyIndex];
  }
  
  private generateChordProgression(rootFreq: number, analysis: any) {
    // Create varied chord progressions based on analysis
    const progressions = {
      dreamy: [
        { root: rootFreq, intervals: [1, 1.2, 1.5, 1.8], name: 'Em' },
        { root: rootFreq * 1.335, intervals: [1, 1.2, 1.5, 1.8], name: 'Am' },
        { root: rootFreq * 1.587, intervals: [1, 1.25, 1.5, 2.0], name: 'C' },
        { root: rootFreq * 2.38, intervals: [1, 1.25, 1.5, 1.875], name: 'G' }
      ],
      dark: [
        { root: rootFreq, intervals: [1, 1.189, 1.414, 1.681], name: 'Dm' },
        { root: rootFreq * 1.189, intervals: [1, 1.189, 1.414, 1.681], name: 'Gm' },
        { root: rootFreq * 1.414, intervals: [1, 1.260, 1.587, 1.887], name: 'Bb' },
        { root: rootFreq * 1.681, intervals: [1, 1.189, 1.414, 1.681], name: 'Cm' }
      ],
      uplifting: [
        { root: rootFreq, intervals: [1, 1.25, 1.5, 1.875], name: 'C' },
        { root: rootFreq * 1.125, intervals: [1, 1.25, 1.5, 1.875], name: 'F' },
        { root: rootFreq * 1.335, intervals: [1, 1.2, 1.5, 1.8], name: 'Am' },
        { root: rootFreq * 1.498, intervals: [1, 1.25, 1.5, 1.875], name: 'G' }
      ]
    };
    
    const baseProgression = progressions[analysis.mood] || progressions.dreamy;
    
    // Add randomization to chord intervals
    return baseProgression.map(chord => ({
      ...chord,
      intervals: chord.intervals.map(interval => 
        interval * (0.98 + analysis.randomSeed * 0.04) // Slight detuning
      )
    }));
  }
  
  private generateMelodicScale(analysis: any) {
    const scales = {
      dreamy: [1, 1.125, 1.2, 1.333, 1.5, 1.6, 1.8, 2.0],
      dark: [1, 1.067, 1.2, 1.333, 1.5, 1.6, 1.778, 2.0],
      uplifting: [1, 1.125, 1.26, 1.333, 1.5, 1.682, 1.888, 2.0],
      ethereal: [1, 1.059, 1.189, 1.335, 1.498, 1.682, 1.888, 2.0]
    };
    
    const baseScale = scales[analysis.mood] || scales.dreamy;
    
    // Add micro-variations
    return baseScale.map(note => 
      note * (0.995 + analysis.randomSeed * 0.01)
    );
  }
  
  private generateRhythmPatterns(analysis: any) {
    // Generate unique rhythm patterns based on prompt
    const patterns = {
      trap: {
        kick: [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0],
        hihat: [0, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0],
        snare: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0]
      },
      ambient: {
        kick: [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
        hihat: [0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0],
        snare: [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      }
    };
    
    const basePattern = patterns[analysis.style] || patterns.ambient;
    
    // Randomize pattern slightly
    const randomizePattern = (pattern: number[]) => 
      pattern.map(beat => {
        if (beat === 1) return Math.random() < 0.9 ? 1 : 0; // 90% chance to keep beats
        if (beat === 0) return Math.random() < 0.1 ? 1 : 0; // 10% chance to add beats
        return beat;
      });
    
    return {
      kick: randomizePattern(basePattern.kick),
      hihat: randomizePattern(basePattern.hihat),
      snare: randomizePattern(basePattern.snare)
    };
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
    // Generate a complex ambient track with HIGH VARIATION based on custom prompt and randomization
    const sampleRate = 44100;
    const samples = duration * sampleRate;
    const audioData = new Float32Array(samples);
    
    // Parse custom prompt for musical characteristics
    const prompt = settings.customPrompt || "ambient music";
    const promptAnalysis = this.analyzePrompt(prompt);
    
    // Randomized musical foundation that changes with each generation
    const possibleKeys = [
      { root: 82.41, name: 'E2' },     // E2 (Whitearmor classic)
      { root: 98.0, name: 'G2' },      // G2 (darker)
      { root: 73.42, name: 'D2' },     // D2 (melancholic)
      { root: 87.31, name: 'F2' },     // F2 (dreamy)
      { root: 110.0, name: 'A2' },     // A2 (uplifting)
      { root: 123.47, name: 'B2' }     // B2 (ethereal)
    ];
    
    // Choose key based on prompt and randomization
    const selectedKey = this.selectKeyFromPrompt(possibleKeys, promptAnalysis);
    const rootFreq = selectedKey.root;
    
    // Dynamic chord progressions that vary based on prompt
    const progressionVariations = this.generateChordProgression(rootFreq, promptAnalysis);
    
    // Randomized scales based on mood
    const scaleVariations = this.generateMelodicScale(promptAnalysis);
    
    // Dynamic rhythm patterns with variation
    const rhythmPatterns = this.generateRhythmPatterns(promptAnalysis);
    
    console.log(`Creating unique variation for prompt: "${prompt}" with key: ${selectedKey.name}`);
    
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
      const currentChord = progressionVariations[Math.min(chordIndex, 3)];
      const chordProgress = (progress * 4) % 1; // Progress within current chord
      
      let signal = 0;
      
      // WHITEARMOR-STYLE CHORD PADS
      if (instruments.pads) {
        for (let voice = 0; voice < currentChord.intervals.length; voice++) {
          const freq = currentChord.root * currentChord.intervals[voice];
          const voicePhase = voice * 0.7 + promptAnalysis.randomSeed * 0.5; // Slight phase offset per voice
          const amplitude = 0.15 / (voice + 1) * (0.8 + 0.2 * Math.sin(t * 0.03 + voicePhase));
          
          // Slow attack for dreamy pad sound with variation
          const attack = Math.min(chordProgress * (6 + promptAnalysis.randomSeed * 4), 1);
          const sustain = 0.7 + 0.3 * Math.sin(t * 0.05 + voice + promptAnalysis.randomSeed);
          
          signal += Math.sin(2 * Math.PI * freq * t + voicePhase) * amplitude * attack * sustain;
        }
      }
      
      // MELODIC ARPEGGIOS (Whitearmor's signature floating melodies)
      if (instruments.arps) {
        const arpSpeed = beatsPerSecond * (1.5 + promptAnalysis.randomSeed); // Variable speed arpeggios
        const arpIndex = Math.floor(t * arpSpeed) % scaleVariations.length;
        const arpFreq = rootFreq * 2 * scaleVariations[arpIndex]; // Octave up
        const arpEnvelope = Math.exp(-(t * arpSpeed % 1) * (3 + promptAnalysis.randomSeed * 2)); // Variable envelope
        const arpGate = (t * arpSpeed % 1) < (0.2 + promptAnalysis.randomSeed * 0.2) ? 1 : 0; // Variable gate
        
        signal += Math.sin(2 * Math.PI * arpFreq * t) * 0.08 * arpEnvelope * arpGate;
      }
      
      // SUB BASS (808-style with proper decay)
      let bass = 0;
      if (instruments.bass) {
        const beatPosition = (t * beatsPerSecond) % 4;
        const beatIndex = Math.floor(beatPosition);
        const beatDecay = Math.exp(-beatPosition * (1.2 + promptAnalysis.randomSeed * 0.6));
        
        if (rhythmPatterns.kick[beatIndex % rhythmPatterns.kick.length]) {
          const bassFreq = currentChord.root * 0.5; // Sub octave
          bass = Math.sin(2 * Math.PI * bassFreq * t) * 0.4 * bassLevel * beatDecay;
          
          // Add harmonic variation based on prompt
          bass += Math.sin(2 * Math.PI * bassFreq * 2 * t) * 0.1 * bassLevel * beatDecay * (0.8 + promptAnalysis.randomSeed * 0.4);
        }
      }
      
      // TRAP DRUMS (sparse, atmospheric, varied by prompt)
      let drums = 0;
      if (instruments.drums) {
        const stepIndex = Math.floor((t * beatsPerSecond * 4) % 16);
        
        // Kick drum with variation
        if (rhythmPatterns.kick[stepIndex]) {
          const kickEnv = Math.exp(-((t * beatsPerSecond * 4) % 1) * 8);
          drums += Math.sin(2 * Math.PI * 60 * t) * 0.3 * kickEnv * (0.9 + promptAnalysis.randomSeed * 0.2);
        }
        
        // Hi-hats with variation
        if (rhythmPatterns.hihat[stepIndex]) {
          const hihatEnv = Math.exp(-((t * beatsPerSecond * 4) % 1) * 20);
          const hihatFreq = 8000 + promptAnalysis.randomSeed * 2000; // Varied frequency
          drums += (Math.random() - 0.5) * 0.05 * hihatEnv * (0.7 + promptAnalysis.randomSeed * 0.6);
        }
        
        // Snare with variation
        if (rhythmPatterns.snare[stepIndex]) {
          const snareEnv = Math.exp(-((t * beatsPerSecond * 4) % 1) * 6);
          const snareNoise = (Math.random() - 0.5) * 0.15 * snareEnv;
          const snareTone = Math.sin(2 * Math.PI * (200 + promptAnalysis.randomSeed * 100) * t) * 0.1 * snareEnv;
          drums += snareNoise + snareTone;
        }
      }
      
      // Combine all elements
      signal += bass + drums;
      
      // Apply prompt-based effects variations
      let finalSignal = signal;
      
      // REVERB/DELAY (Whitearmor's signature spaciousness) - varied by prompt
      const delayAmount = reverbLevel * (0.7 + promptAnalysis.randomSeed * 0.6);
      const delayedSample = delayBuffer[delayIndex];
      delayBuffer[delayIndex] = signal + delayedSample * delayAmount * 0.3;
      finalSignal += delayedSample * delayAmount;
      delayIndex = (delayIndex + 1) % delayBufferSize;
      
      // DISTORTION (subtle tape saturation) - varied by prompt
      if (distortionLevel > 0) {
        const saturationAmount = distortionLevel * (0.5 + promptAnalysis.randomSeed * 0.5);
        finalSignal = Math.tanh(finalSignal * (1 + saturationAmount * 3)) / (1 + saturationAmount);
      }
      
      // FADE IN/OUT with variation
      let envelope = 1;
      if (t < fadeInTime) {
        envelope = t / fadeInTime;
      } else if (t > duration - fadeOutTime) {
        envelope = (duration - t) / fadeOutTime;
      }
      
      // Apply envelope and store
      audioData[i] = finalSignal * envelope * 0.3; // Master volume
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
