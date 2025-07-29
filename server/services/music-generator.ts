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

  async generateSong(): Promise<{ audioBuffer: Buffer; metadata: GenerationMetadata }> {
    try {
      // For now, we'll use a Python script approach since MusicGen requires complex setup
      // In production, this would interface with MusicGen directly or via API
      
      const prompt = this.getRandomPrompt();
      const title = this.getRandomTitle();
      const duration = this.getRandomDuration();
      
      console.log(`Generating song: "${title}" with prompt: "${prompt}"`);
      
      // Generate using Python MusicGen script (would be implemented separately)
      const audioBuffer = await this.callMusicGenAPI(prompt, duration);
      
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

  private async callMusicGenAPI(prompt: string, duration: number): Promise<Buffer> {
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
        return await this.generatePlaceholderAudio(duration);
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

  private async generatePlaceholderAudio(duration: number): Promise<Buffer> {
    // Generate a simple WAV file with ambient sound for testing
    // This is a placeholder - in production, MusicGen would handle this
    
    const sampleRate = 44100;
    const samples = duration * sampleRate;
    const audioData = new Float32Array(samples);
    
    // Generate ambient-style audio with multiple sine waves and noise
    for (let i = 0; i < samples; i++) {
      const t = i / sampleRate;
      
      // Multiple sine waves for ambient effect
      const wave1 = Math.sin(2 * Math.PI * 220 * t) * 0.1; // A3
      const wave2 = Math.sin(2 * Math.PI * 330 * t) * 0.08; // E4
      const wave3 = Math.sin(2 * Math.PI * 440 * t) * 0.06; // A4
      
      // Add some noise for texture
      const noise = (Math.random() - 0.5) * 0.02;
      
      // Envelope to fade in/out
      const envelope = Math.min(t / 2, 1) * Math.min((duration - t) / 2, 1);
      
      audioData[i] = (wave1 + wave2 + wave3 + noise) * envelope;
    }
    
    // Convert to WAV format
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
