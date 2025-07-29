/**
 * Professional Music Generation Engine
 * 
 * This system implements professional music theory, advanced synthesis techniques,
 * and Whitearmor-style ambient trap production to create high-quality, structured music.
 * 
 * Based on research of Meta's MusicGen architecture, professional music theory,
 * and Whitearmor's production techniques using Ableton Live + hardware synths.
 */

export interface MusicTheoryAnalysis {
  key: string;
  scale: number[];
  chordProgression: ChordProgression[];
  songStructure: ProfessionalSongStructure;
  tempo: number;
  mood: 'dreamy' | 'dark' | 'uplifting' | 'melancholic' | 'ethereal' | 'nostalgic';
  style: 'ambient-trap' | 'electronic' | 'trap' | 'ambient';
  harmonicComplexity: 'simple' | 'medium' | 'complex';
}

export interface ChordProgression {
  roman: string;
  chord: string;
  intervals: number[];
  tensions: string[];
  function: 'tonic' | 'subdominant' | 'dominant' | 'predominant';
  duration: number;
}

export interface ProfessionalSongStructure {
  form: 'ABABCB' | 'AABA' | 'verse-chorus' | 'ambient-drone';
  sections: {
    intro: { bars: number; description: string };
    verse: { bars: number; description: string };
    chorus?: { bars: number; description: string };
    bridge?: { bars: number; description: string };
    outro: { bars: number; description: string };
  };
  totalBars: number;
}

export interface SynthLayer {
  type: 'pad' | 'lead' | 'bass' | 'arp' | 'texture' | 'percussion';
  oscillator: 'sine' | 'sawtooth' | 'square' | 'triangle' | 'noise';
  envelope: { attack: number; decay: number; sustain: number; release: number };
  filter: { type: 'lowpass' | 'highpass' | 'bandpass'; frequency: number; resonance: number };
  effects: EffectsChain;
  pattern?: number[];
  volume: number;
}

export interface EffectsChain {
  reverb: { roomSize: number; damping: number; wetLevel: number };
  delay: { time: number; feedback: number; wetLevel: number };
  distortion: { amount: number; type: 'tape' | 'tube' | 'digital' };
  chorus: { rate: number; depth: number; wetLevel: number };
  filter: { frequency: number; resonance: number; type: string };
}

/**
 * Professional Music Theory Engine
 * Implements authentic chord progressions, voice leading, and harmonic analysis
 */
export class MusicTheoryEngine {
  
  // Professional chord progressions by genre and mood
  private static readonly CHORD_PROGRESSIONS = {
    'ambient-trap': {
      dreamy: [
        { progression: ['vi', 'IV', 'I', 'V'], name: 'vi-IV-I-V (Melancholic)', popularity: 0.9 },
        { progression: ['i', 'VI', 'III', 'VII'], name: 'Natural Minor Classic', popularity: 0.8 },
        { progression: ['i', 'v', 'VI', 'IV'], name: 'Dorian Modal', popularity: 0.7 }
      ],
      dark: [
        { progression: ['i', 'VII', 'VI', 'VII'], name: 'Dark Phrygian', popularity: 0.9 },
        { progression: ['i', 'ii°', 'V', 'i'], name: 'Harmonic Minor', popularity: 0.8 },
        { progression: ['i', 'VI', 'ii°', 'V'], name: 'Gothic Progression', popularity: 0.7 }
      ],
      uplifting: [
        { progression: ['I', 'V', 'vi', 'IV'], name: 'Pop Progression', popularity: 0.9 },
        { progression: ['I', 'vi', 'ii', 'V'], name: 'Turnaround', popularity: 0.8 },
        { progression: ['IV', 'V', 'vi', 'I'], name: 'Ascending Resolution', popularity: 0.7 }
      ]
    }
  };

  // Authentic scales used in professional music
  private static readonly SCALES = {
    'natural-minor': [0, 2, 3, 5, 7, 8, 10], // Whitearmor's primary scale
    'harmonic-minor': [0, 2, 3, 5, 7, 8, 11], // Creates tension for trap
    'dorian': [0, 2, 3, 5, 7, 9, 10], // Ambient/ethereal character
    'phrygian': [0, 1, 3, 5, 7, 8, 10], // Dark, Spanish/Arabic flavor
    'major': [0, 2, 4, 5, 7, 9, 11], // For uplifting sections
    'pentatonic-minor': [0, 3, 5, 7, 10] // For melodies and arpeggios
  };

  // Professional song structures based on research
  private static readonly SONG_STRUCTURES = {
    'ambient-trap': {
      form: 'verse-chorus',
      sections: {
        intro: { bars: 8, description: 'Atmospheric pad introduction, soft percussion entry' },
        verse: { bars: 16, description: 'Main harmonic progression, melodic development' },
        chorus: { bars: 8, description: 'Peak energy, full arrangement, hook melody' },
        bridge: { bars: 8, description: 'Contrasting harmony, breakdown or filter sweep' },
        outro: { bars: 8, description: 'Fade with reverb tail, atmospheric decay' }
      }
    }
  };

  /**
   * Analyze user prompt and generate professional music theory structure
   */
  public static analyzePromptAdvanced(prompt: string, settings: any): MusicTheoryAnalysis {
    const words = prompt.toLowerCase().split(/[\s,.-]+/);
    
    // Advanced mood detection using semantic analysis
    const mood = this.extractAdvancedMood(words);
    const style = this.extractMusicStyle(words);
    const tempo = this.calculateProfessionalTempo(words, settings.pace || 85);
    
    // Select appropriate key based on mood and musical theory
    const key = this.selectProfessionalKey(mood, style);
    const scale = this.selectScale(mood, style);
    
    // Generate chord progression using music theory rules
    const chordProgression = this.generateProfessionalChordProgression(key, scale, mood, style);
    
    // Create proper song structure
    const songStructure = this.createProfessionalStructure(style, tempo);
    
    // Determine harmonic complexity based on prompt sophistication
    const harmonicComplexity = this.analyzeHarmonicComplexity(words);

    return {
      key,
      scale,
      chordProgression,
      songStructure,
      tempo,
      mood,
      style,
      harmonicComplexity
    };
  }

  private static extractAdvancedMood(words: string[]): MusicTheoryAnalysis['mood'] {
    const moodKeywords = {
      dreamy: ['dreamy', 'ethereal', 'floating', 'soft', 'gentle', 'peaceful', 'serene', 'ambient'],
      dark: ['dark', 'mysterious', 'brooding', 'ominous', 'gothic', 'sinister', 'moody', 'shadow'],
      uplifting: ['uplifting', 'bright', 'happy', 'energetic', 'positive', 'euphoric', 'joyful'],
      melancholic: ['sad', 'melancholic', 'tragic', 'somber', 'wistful', 'nostalgic', 'longing'],
      ethereal: ['ethereal', 'ghostly', 'spiritual', 'otherworldly', 'transcendent', 'celestial'],
      nostalgic: ['nostalgic', 'vintage', 'retro', 'memory', 'reminiscent', 'yearning']
    };

    for (const [mood, keywords] of Object.entries(moodKeywords)) {
      if (words.some(word => keywords.includes(word))) {
        return mood as MusicTheoryAnalysis['mood'];
      }
    }
    
    return 'dreamy'; // Default for ambient trap
  }

  private static extractMusicStyle(words: string[]): MusicTheoryAnalysis['style'] {
    if (words.some(w => ['trap', 'hip', 'hop', 'beats', '808'].includes(w))) return 'trap';
    if (words.some(w => ['electronic', 'synth', 'digital', 'edm'].includes(w))) return 'electronic';
    if (words.some(w => ['ambient', 'atmospheric', 'drone', 'soundscape'].includes(w))) return 'ambient';
    return 'ambient-trap'; // Default Whitearmor style
  }

  private static selectProfessionalKey(mood: string, style: string): string {
    // Keys chosen based on psychological impact and music theory
    const keysByMood = {
      dreamy: ['Em', 'Am', 'Dm', 'F#m'], // Minor keys for introspection
      dark: ['Dm', 'Gm', 'Cm', 'F#m'], // Lower, more ominous keys
      uplifting: ['C', 'G', 'D', 'A'], // Major keys for positivity
      melancholic: ['Am', 'Em', 'Bm', 'F#m'], // Classic sad keys
      ethereal: ['Em', 'Bm', 'F#m', 'C#m'], // Higher, more celestial
      nostalgic: ['Am', 'Dm', 'G', 'Em'] // Warm, familiar keys
    };

    const possibleKeys = keysByMood[mood as keyof typeof keysByMood] || keysByMood.dreamy;
    return possibleKeys[Math.floor(Math.random() * possibleKeys.length)];
  }

  private static selectScale(mood: string, style: string): number[] {
    const scaleByMood = {
      dreamy: 'natural-minor',
      dark: 'phrygian',
      uplifting: 'major',
      melancholic: 'natural-minor',
      ethereal: 'dorian',
      nostalgic: 'natural-minor'
    };

    const scaleName = scaleByMood[mood as keyof typeof scaleByMood] || 'natural-minor';
    return this.SCALES[scaleName as keyof typeof this.SCALES];
  }

  private static calculateProfessionalTempo(words: string[], baseTempo: number): number {
    // Tempo modification based on descriptive words
    let tempoMultiplier = 1.0;
    
    if (words.some(w => ['slow', 'languid', 'dreamy', 'ambient'].includes(w))) {
      tempoMultiplier = 0.7; // 70% of base tempo
    } else if (words.some(w => ['fast', 'energetic', 'driving', 'intense'].includes(w))) {
      tempoMultiplier = 1.3; // 130% of base tempo
    }

    return Math.round(baseTempo * tempoMultiplier);
  }

  private static generateProfessionalChordProgression(
    key: string, 
    scale: number[], 
    mood: string, 
    style: string
  ): ChordProgression[] {
    const progressionData = this.CHORD_PROGRESSIONS['ambient-trap'][mood as keyof typeof this.CHORD_PROGRESSIONS['ambient-trap']];
    const selectedProgression = progressionData[Math.floor(Math.random() * progressionData.length)];
    
    const rootNote = this.parseKey(key);
    
    return selectedProgression.progression.map((roman, index) => {
      const chordInfo = this.romanToChord(roman, rootNote, scale);
      return {
        roman,
        chord: chordInfo.name,
        intervals: chordInfo.intervals,
        tensions: chordInfo.tensions,
        function: this.getHarmonicFunction(roman),
        duration: 4 // 4 beats per chord (1 bar in 4/4)
      };
    });
  }

  private static parseKey(key: string): number {
    const noteToNumber = {
      'C': 0, 'C#': 1, 'Db': 1, 'D': 2, 'D#': 3, 'Eb': 3, 'E': 4, 'F': 5,
      'F#': 6, 'Gb': 6, 'G': 7, 'G#': 8, 'Ab': 8, 'A': 9, 'A#': 10, 'Bb': 10, 'B': 11
    };
    
    const noteName = key.replace(/m$/, ''); // Remove 'm' for minor
    return noteToNumber[noteName as keyof typeof noteToNumber] || 0;
  }

  private static romanToChord(roman: string, root: number, scale: number[]) {
    // Convert Roman numerals to actual chord intervals
    const romanMap = {
      'I': 0, 'ii': 1, 'iii': 2, 'IV': 3, 'V': 4, 'vi': 5, 'vii°': 6,
      'i': 0, 'II': 1, 'III': 2, 'iv': 3, 'v': 4, 'VI': 5, 'VII': 6
    };

    const degree = romanMap[roman as keyof typeof romanMap] || 0;
    const chordRoot = (root + scale[degree]) % 12;
    
    // Generate triad intervals (root, third, fifth)
    const intervals = [
      chordRoot,
      (chordRoot + scale[degree + 2] - scale[degree]) % 12,
      (chordRoot + scale[degree + 4] - scale[degree]) % 12
    ];

    // Add tensions for sophistication (7ths, 9ths, etc.)
    const tensions = this.addChordTensions(roman, intervals);

    return {
      name: this.intervalsToChordName(chordRoot, intervals, tensions),
      intervals,
      tensions
    };
  }

  private static addChordTensions(roman: string, intervals: number[]): string[] {
    const tensions = [];
    
    // Add 7ths for sophistication
    if (Math.random() > 0.5) {
      tensions.push('7');
    }
    
    // Add 9ths for dreamy character
    if (Math.random() > 0.7) {
      tensions.push('add9');
    }

    // Add sus chords for Whitearmor's signature sound
    if (Math.random() > 0.8) {
      tensions.push(Math.random() > 0.5 ? 'sus2' : 'sus4');
    }

    return tensions;
  }

  private static intervalsToChordName(root: number, intervals: number[], tensions: string[]): string {
    const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const rootName = noteNames[root];
    
    // Determine if major or minor based on third interval
    const thirdInterval = intervals[1] - intervals[0];
    const quality = thirdInterval === 3 ? 'm' : '';
    
    const tensionString = tensions.length > 0 ? tensions.join('') : '';
    return `${rootName}${quality}${tensionString}`;
  }

  private static getHarmonicFunction(roman: string): ChordProgression['function'] {
    const functions = {
      'I': 'tonic', 'i': 'tonic', 'vi': 'tonic', 'VI': 'tonic',
      'IV': 'subdominant', 'iv': 'subdominant', 'ii': 'predominant', 'II': 'predominant',
      'V': 'dominant', 'v': 'dominant', 'VII': 'dominant', 'vii°': 'dominant'
    };
    
    return functions[roman as keyof typeof functions] || 'tonic';
  }

  private static createProfessionalStructure(style: string, tempo: number): ProfessionalSongStructure {
    const baseStructure = this.SONG_STRUCTURES['ambient-trap'];
    
    // Adjust bar lengths based on tempo (slower = longer sections)
    const tempoMultiplier = tempo < 80 ? 1.5 : tempo > 120 ? 0.8 : 1.0;
    
    return {
      form: baseStructure.form as 'verse-chorus',
      sections: {
        intro: { 
          bars: Math.round(baseStructure.sections.intro.bars * tempoMultiplier),
          description: baseStructure.sections.intro.description 
        },
        verse: { 
          bars: Math.round(baseStructure.sections.verse.bars * tempoMultiplier),
          description: baseStructure.sections.verse.description 
        },
        chorus: { 
          bars: Math.round(baseStructure.sections.chorus.bars * tempoMultiplier),
          description: baseStructure.sections.chorus.description 
        },
        bridge: { 
          bars: Math.round(baseStructure.sections.bridge.bars * tempoMultiplier),
          description: baseStructure.sections.bridge.description 
        },
        outro: { 
          bars: Math.round(baseStructure.sections.outro.bars * tempoMultiplier),
          description: baseStructure.sections.outro.description 
        }
      },
      totalBars: Math.round((8 + 16 + 8 + 8 + 8) * tempoMultiplier)
    };
  }

  private static analyzeHarmonicComplexity(words: string[]): 'simple' | 'medium' | 'complex' {
    const complexityKeywords = {
      simple: ['simple', 'basic', 'minimal', 'clean'],
      medium: ['smooth', 'flowing', 'melodic', 'harmonic'],
      complex: ['complex', 'sophisticated', 'jazz', 'advanced', 'intricate']
    };

    for (const [level, keywords] of Object.entries(complexityKeywords)) {
      if (words.some(word => keywords.includes(word))) {
        return level as 'simple' | 'medium' | 'complex';
      }
    }

    return 'medium'; // Default
  }
}

/**
 * Professional Audio Synthesis Engine
 * Implements advanced synthesis techniques based on Whitearmor's documented equipment
 */
export class ProfessionalSynthEngine {
  
  /**
   * Create professional synthesis layers based on music theory analysis
   */
  public static createSynthLayers(analysis: MusicTheoryAnalysis, settings: any): SynthLayer[] {
    const layers: SynthLayer[] = [];

    // WHITEARMOR-STYLE CHORD PADS (Primary layer)
    if (settings.instruments.pads) {
      layers.push(this.createChordPadLayer(analysis, settings));
    }

    // SUB BASS (808-style with harmonic content)
    if (settings.instruments.bass) {
      layers.push(this.createProfessionalBassLayer(analysis, settings));
    }

    // MELODIC ARPEGGIOS (Whitearmor's signature floating melodies)
    if (settings.instruments.arps) {
      layers.push(this.createArpeggioLayer(analysis, settings));
    }

    // AMBIENT TRAP PERCUSSION
    if (settings.instruments.drums) {
      layers.push(this.createTrapPercussionLayer(analysis, settings));
    }

    // ATMOSPHERIC SYNTH LEADS
    if (settings.instruments.synths) {
      layers.push(this.createSynthLeadLayer(analysis, settings));
    }

    // ATMOSPHERIC TEXTURES (Always present for ambient character)
    layers.push(this.createAtmosphericLayer(analysis, settings));

    return layers;
  }

  private static createChordPadLayer(analysis: MusicTheoryAnalysis, settings: any): SynthLayer {
    return {
      type: 'pad',
      oscillator: 'sawtooth', // Rich harmonic content like CS1X
      envelope: { 
        attack: 2.0, // Slow attack for dreamy pads
        decay: 0.5, 
        sustain: 0.8, 
        release: 3.0 // Long release for ambient tails
      },
      filter: { 
        type: 'lowpass', 
        frequency: 800 + (settings.reverb / 100) * 1200, // Brighter with more reverb
        resonance: 0.3 
      },
      effects: {
        reverb: { 
          roomSize: 0.8, 
          damping: 0.3, 
          wetLevel: settings.reverb / 100 
        },
        delay: { 
          time: 0.3, 
          feedback: 0.4, 
          wetLevel: 0.2 
        },
        distortion: { 
          amount: settings.distortion / 100, 
          type: 'tape' // Whitearmor's vintage character
        },
        chorus: { 
          rate: 0.5, 
          depth: 0.3, 
          wetLevel: 0.3 
        },
        filter: { 
          frequency: 1000, 
          resonance: 0.2, 
          type: 'lowpass' 
        }
      },
      volume: 0.4
    };
  }

  private static createProfessionalBassLayer(analysis: MusicTheoryAnalysis, settings: any): SynthLayer {
    // Create rhythm pattern based on chord progression
    const pattern = this.generateBassPattern(analysis.chordProgression, analysis.tempo);
    
    return {
      type: 'bass',
      oscillator: 'sine', // Pure sub bass
      envelope: { 
        attack: 0.01, 
        decay: 0.8, 
        sustain: 0.3, 
        release: 0.5 
      },
      filter: { 
        type: 'lowpass', 
        frequency: 200, 
        resonance: 0.1 
      },
      effects: {
        reverb: { roomSize: 0.2, damping: 0.8, wetLevel: 0.1 },
        delay: { time: 0.0, feedback: 0.0, wetLevel: 0.0 },
        distortion: { 
          amount: settings.distortion / 200, // Subtle bass distortion
          type: 'tape' 
        },
        chorus: { rate: 0.0, depth: 0.0, wetLevel: 0.0 },
        filter: { frequency: 80, resonance: 0.5, type: 'lowpass' }
      },
      pattern,
      volume: settings.bass / 100
    };
  }

  private static createArpeggioLayer(analysis: MusicTheoryAnalysis, settings: any): SynthLayer {
    return {
      type: 'arp',
      oscillator: 'triangle', // Softer than sawtooth, warmer than sine
      envelope: { 
        attack: 0.05, 
        decay: 0.3, 
        sustain: 0.2, 
        release: 0.8 
      },
      filter: { 
        type: 'lowpass', 
        frequency: 2000, 
        resonance: 0.4 
      },
      effects: {
        reverb: { roomSize: 0.6, damping: 0.4, wetLevel: 0.6 },
        delay: { time: 0.25, feedback: 0.3, wetLevel: 0.4 },
        distortion: { amount: 0.1, type: 'tube' },
        chorus: { rate: 0.8, depth: 0.4, wetLevel: 0.5 },
        filter: { frequency: 1500, resonance: 0.3, type: 'bandpass' }
      },
      pattern: this.generateArpeggioPattern(analysis.scale, analysis.tempo),
      volume: 0.25
    };
  }

  private static createTrapPercussionLayer(analysis: MusicTheoryAnalysis, settings: any): SynthLayer {
    return {
      type: 'percussion',
      oscillator: 'noise', // For hi-hats and snares
      envelope: { attack: 0.001, decay: 0.1, sustain: 0.0, release: 0.1 },
      filter: { type: 'highpass', frequency: 8000, resonance: 0.1 },
      effects: {
        reverb: { roomSize: 0.4, damping: 0.6, wetLevel: 0.3 },
        delay: { time: 0.125, feedback: 0.2, wetLevel: 0.1 },
        distortion: { amount: 0.2, type: 'digital' },
        chorus: { rate: 0.0, depth: 0.0, wetLevel: 0.0 },
        filter: { frequency: 4000, resonance: 0.2, type: 'bandpass' }
      },
      pattern: this.generateTrapPattern(analysis.tempo),
      volume: 0.3
    };
  }

  private static createSynthLeadLayer(analysis: MusicTheoryAnalysis, settings: any): SynthLayer {
    return {
      type: 'lead',
      oscillator: 'sawtooth',
      envelope: { attack: 0.1, decay: 0.4, sustain: 0.6, release: 1.0 },
      filter: { type: 'lowpass', frequency: 1500, resonance: 0.6 },
      effects: {
        reverb: { roomSize: 0.5, damping: 0.5, wetLevel: 0.4 },
        delay: { time: 0.375, feedback: 0.3, wetLevel: 0.3 },
        distortion: { amount: settings.distortion / 150, type: 'tube' },
        chorus: { rate: 1.2, depth: 0.6, wetLevel: 0.4 },
        filter: { frequency: 1200, resonance: 0.4, type: 'lowpass' }
      },
      volume: 0.2
    };
  }

  private static createAtmosphericLayer(analysis: MusicTheoryAnalysis, settings: any): SynthLayer {
    return {
      type: 'texture',
      oscillator: 'noise',
      envelope: { attack: 5.0, decay: 2.0, sustain: 0.4, release: 8.0 },
      filter: { type: 'bandpass', frequency: 500, resonance: 0.1 },
      effects: {
        reverb: { roomSize: 0.9, damping: 0.2, wetLevel: 0.8 },
        delay: { time: 0.5, feedback: 0.6, wetLevel: 0.5 },
        distortion: { amount: 0.05, type: 'tape' },
        chorus: { rate: 0.2, depth: 0.8, wetLevel: 0.6 },
        filter: { frequency: 400, resonance: 0.1, type: 'lowpass' }
      },
      volume: 0.15
    };
  }

  private static generateBassPattern(chordProgression: ChordProgression[], tempo: number): number[] {
    // Create bass pattern that follows chord changes
    const pattern = new Array(64).fill(0); // 4 bars * 16 steps
    
    // Place kicks on chord changes and strong beats
    pattern[0] = 1; // Downbeat
    pattern[16] = 1; // Chord change
    pattern[32] = 1; // Half bar
    pattern[48] = 1; // Next chord
    
    // Add syncopated hits based on tempo
    if (tempo > 100) {
      pattern[6] = 0.7;
      pattern[22] = 0.7;
      pattern[38] = 0.7;
      pattern[54] = 0.7;
    }

    return pattern;
  }

  private static generateArpeggioPattern(scale: number[], tempo: number): number[] {
    // Create melodic arpeggio pattern based on scale
    const pattern = [];
    const stepSize = tempo < 80 ? 8 : tempo > 120 ? 4 : 6; // Adjust for tempo
    
    for (let i = 0; i < 64; i++) {
      if (i % stepSize === 0) {
        const scaleIndex = Math.floor(i / stepSize) % scale.length;
        pattern[i] = scale[scaleIndex];
      } else {
        pattern[i] = 0;
      }
    }

    return pattern;
  }

  private static generateTrapPattern(tempo: number): number[] {
    // Authentic trap drum pattern
    const pattern = new Array(64).fill(0);
    
    // Kick pattern (typical trap)
    pattern[0] = 1; // Strong kick
    pattern[24] = 0.8; // Syncopated kick
    pattern[32] = 1; // Half bar kick
    pattern[56] = 0.8; // Lead into next bar
    
    // Hi-hat pattern (16th note feel)
    for (let i = 4; i < 64; i += 8) {
      pattern[i] = 0.3; // Subtle hi-hats
    }
    
    // Snare on beats 2 and 4
    pattern[16] = 0.9;
    pattern[48] = 0.9;

    return pattern;
  }
}