import { spawn } from "child_process";
import { randomUUID } from "crypto";
import path from "path";
import fs from "fs/promises";
import { existsSync } from "fs";

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
  private whiteArmorPrompts = [
    "dreamy ambient trap beat, heavy reverb, slow BPM, ethereal atmosphere",
    "floating soundscape, distorted vocals, pitch-shifted elements, lo-fi texture",
    "celestial ambient music, reverb-heavy, emotional, off-grid timing",
    "ethereal trap, filtered sounds, tape wobble, nostalgic atmosphere",
    "ambient dreamscape, reversed delays, shimmer reverb, melancholic mood",
    "floating beats, pitch-bent synths, heavy atmosphere, emotional depth",
    "dreamy trap production, unsynced delays, filtered ambience, heartbroken",
    "celestial soundscape, foggy atmosphere, reversed elements, ethereal mood"
  ];

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

  async generateSong(settings: any = {}): Promise<{ audioBuffer: Buffer; metadata: GenerationMetadata }> {
    try {
      // For now, we'll use a Python script approach since MusicGen requires complex setup
      // In production, this would interface with MusicGen directly or via API
      
      const prompt = this.createCustomPrompt(settings);
      const title = this.getRandomTitle();
      const duration = this.getRandomDuration();
      
      console.log(`Generating song: "${title}" with prompt: "${prompt}" and settings:`, settings);
      
      // Generate using Python MusicGen script (would be implemented separately)
      const audioBuffer = await this.callMusicGenAPI(prompt, duration, settings);
      
      const metadata: GenerationMetadata = {
        title: `${title} #${Math.floor(Math.random() * 999) + 1}`,
        prompt,
        duration,
        structure: this.generateSongStructure(duration)
      };

      return { audioBuffer, metadata };
    } catch (error) {
      console.error("Music generation failed:", error);
      throw new Error("Failed to generate music");
    }
  }

  private getRandomPrompt(): string {
    return this.whiteArmorPrompts[Math.floor(Math.random() * this.whiteArmorPrompts.length)];
  }

  private createCustomPrompt(settings: any): string {
    let basePrompt = this.getRandomPrompt();
    
    if (settings.mood) {
      const moodMap: { [key: string]: string } = {
        "dreamy": "dreamy, floating, ethereal",
        "dark": "dark, brooding, mysterious",
        "uplifting": "uplifting, celestial, hopeful",
        "melancholic": "melancholic, heartbroken, nostalgic",
        "ethereal": "ethereal, ghostly, otherworldly",
        "nostalgic": "nostalgic, vintage, lo-fi"
      };
      basePrompt = `${moodMap[settings.mood] || "dreamy"} ambient trap beat`;
    }
    
    if (settings.pace) {
      if (settings.pace < 80) {
        basePrompt += ", very slow BPM, languid tempo";
      } else if (settings.pace > 120) {
        basePrompt += ", uptempo, energetic rhythm";
      } else {
        basePrompt += ", slow BPM, relaxed pace";
      }
    }
    
    if (settings.reverb > 70) {
      basePrompt += ", heavy reverb, spacious atmosphere";
    } else if (settings.reverb < 30) {
      basePrompt += ", dry sound, intimate space";
    }
    
    if (settings.distortion > 50) {
      basePrompt += ", distorted, gritty texture";
    }
    
    return basePrompt;
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
    
    // Key and scale for musical coherence
    const baseFreq = 110; // A2
    const scale = [1, 1.125, 1.25, 1.5, 1.6875, 2]; // Pentatonic ratios
    
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
    
    for (let i = 0; i < samples; i++) {
      const t = i / sampleRate;
      const progress = t / duration;
      
      // Create evolving harmonies
      let signal = 0;
      
      // Bass foundation - controlled by bass setting
      let bass = 0;
      if (instruments.bass) {
        const bassFreq = baseFreq * (1 + Math.sin(t * 0.1) * 0.1);
        bass = Math.sin(2 * Math.PI * bassFreq * t) * 0.3 * bassLevel * (0.5 + 0.5 * Math.sin(t * 0.05));
      }
      
      // Synth layers - controlled by synths setting
      if (instruments.synths) {
        for (let h = 0; h < scale.length; h++) {
          const freq = baseFreq * scale[h] * (1 + Math.sin(t * 0.3 + h) * 0.01);
          const amplitude = 0.1 / (h + 1) * (0.7 + 0.3 * Math.sin(t * 0.07 + h * 1.3));
          const phase = Math.sin(t * 0.2 + h * 0.8) * 0.1;
          signal += Math.sin(2 * Math.PI * freq * t + phase) * amplitude;
        }
      }
      
      // Ambient pads - controlled by pads setting
      let pad = 0;
      if (instruments.pads) {
        const padFreq = baseFreq * 2 * (1 + Math.sin(t * 0.15) * 0.05);
        pad = Math.sin(2 * Math.PI * padFreq * t) * 0.08 * Math.sin(t * 0.03) * Math.sin(t * 0.03);
      }
      
      // Rhythmic elements - controlled by drums setting and pace
      let kick = 0, hihat = 0;
      if (instruments.drums) {
        const beatPattern = Math.floor(t * beatsPerSecond) % 4;
        const beatTime = (t * beatsPerSecond) % 1;
        kick = beatPattern === 0 ? Math.exp(-beatTime * 8) * Math.sin(t * 120) * 0.1 : 0;
        hihat = (beatPattern === 1 || beatPattern === 3) ? 
          Math.exp(-beatTime * 15) * (Math.random() - 0.5) * 0.03 : 0;
      }
      
      // Arpeggiated elements - controlled by arps setting
      let arp = 0;
      if (instruments.arps) {
        const arpPattern = Math.floor(t * beatsPerSecond * 4) % 8;
        const arpFreq = baseFreq * scale[arpPattern % scale.length] * 2;
        arp = Math.sin(2 * Math.PI * arpFreq * t) * 0.05 * Math.exp(-(t * beatsPerSecond * 4 % 1) * 3);
      }
      
      // Ethereal textures
      const texture1 = Math.sin(2 * Math.PI * baseFreq * 3 * t + Math.sin(t * 0.4) * 2) * 0.04;
      const texture2 = Math.sin(2 * Math.PI * baseFreq * 5 * t + Math.cos(t * 0.6) * 1.5) * 0.03;
      
      // Atmospheric noise
      const noise = (Math.random() - 0.5) * 0.01 * (0.5 + 0.5 * Math.sin(t * 0.08));
      
      // Custom fade envelope
      const fadeIn = Math.min(t / fadeInTime, 1);
      const fadeOut = Math.min((duration - t) / fadeOutTime, 1);
      const envelope = fadeIn * fadeOut;
      
      // Reverb simulation (simple delay and feedback)
      const reverbDelay = Math.sin(2 * Math.PI * baseFreq * (t - 0.1)) * 0.3 * reverbLevel;
      
      // Dynamic filtering - higher frequencies fade in later
      const filterEnv = Math.max(0, Math.min(1, (progress - 0.2) * 2));
      const highFreqMult = 0.3 + 0.7 * filterEnv;
      
      // Combine all elements
      let mixed = (bass + signal + pad * highFreqMult + kick + hihat + arp +
                  texture1 * highFreqMult + texture2 * highFreqMult + noise + reverbDelay) * envelope;
      
      // Apply distortion if enabled
      if (distortionLevel > 0) {
        mixed = Math.tanh(mixed * (1 + distortionLevel * 2)) * (1 - distortionLevel * 0.3);
      }
      
      // Soft compression/limiting
      audioData[i] = Math.tanh(mixed * 1.5) * 0.7;
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
