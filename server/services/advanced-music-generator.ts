import { GenerationSettings } from "@shared/schema";

// Advanced ML-powered music generation using genetic algorithms and neural variation
export class AdvancedMusicGenerator {
  private population: MusicGenome[] = [];
  private generation = 0;
  private fitnessHistory: number[] = [];
  
  // Core genetic algorithm parameters
  private readonly POPULATION_SIZE = 20;
  private readonly MUTATION_RATE = 0.15;
  private readonly CROSSOVER_RATE = 0.7;
  private readonly ELITE_SIZE = 4; // Keep best 20% each generation
  
  // Music theory foundations
  private readonly WHITEARMOR_SCALES = {
    emNaturalMinor: [0, 2, 3, 5, 7, 8, 10], // E natural minor (signature scale)
    dorianMode: [0, 2, 3, 5, 7, 9, 10],     // Modal harmony
    aeolianMode: [0, 2, 3, 5, 7, 8, 10]     // Natural minor (aeolian)
  };
  
  private readonly CHORD_PROGRESSIONS = {
    signature: [
      { root: 0, type: 'minor', extensions: ['add9'] },      // Em(add9)
      { root: 5, type: 'minor', extensions: ['sus2'] },      // Am(sus2)
      { root: 8, type: 'major', extensions: ['add9'] },      // C(add9)
      { root: 3, type: 'major', extensions: ['sus4'] }       // G(sus4)
    ],
    variation1: [
      { root: 0, type: 'minor', extensions: [] },            // Em
      { root: 3, type: 'major', extensions: ['add9'] },      // G(add9)
      { root: 8, type: 'major', extensions: ['sus2'] },      // C(sus2)
      { root: 2, type: 'minor', extensions: ['add9'] }       // F#m(add9) - tritone sub
    ],
    variation2: [
      { root: 0, type: 'minor7', extensions: [] },           // Em7
      { root: 5, type: 'minor7', extensions: [] },           // Am7
      { root: 10, type: 'major7', extensions: [] },          // Bb maj7 - chromatic sub
      { root: 3, type: 'major', extensions: ['sus4'] }       // G(sus4)
    ]
  };
  
  private readonly TRITONE_SUBSTITUTIONS = {
    'C7': 'F#7', 'G7': 'Db7', 'D7': 'Ab7', 'A7': 'Eb7',
    'E7': 'Bb7', 'B7': 'F7', 'F#7': 'C7', 'Db7': 'G7',
    'Ab7': 'D7', 'Eb7': 'A7', 'Bb7': 'E7', 'F7': 'B7'
  };

  // Neural network-inspired melody generation
  private readonly MELODY_PATTERNS = {
    whitearmor: {
      intervals: [0, 2, 3, 5, 7],     // Pentatonic-based
      rhythms: [0.5, 0.25, 0.75, 1.0], // Syncopated patterns
      contour: 'arc',                  // Rise then fall
      density: 'sparse'                // Leave space for atmosphere
    },
    atmospheric: {
      intervals: [0, 3, 7, 10],       // Minor thirds and sevenths
      rhythms: [1.0, 1.5, 2.0],      // Slower, sustained notes
      contour: 'descending',          // Downward motion
      density: 'minimal'              // Very sparse
    }
  };

  constructor() {
    this.initializePopulation();
  }

  // Generate completely unique song using evolved genetics
  async generateSong(settings: GenerationSettings): Promise<AudioBuffer> {
    console.log(`Starting ML-powered generation (Generation ${this.generation + 1})`);
    
    // Evolve population based on settings preferences
    this.evolvePopulation(settings);
    
    // Select best genome from current generation
    const bestGenome = this.getBestGenome();
    
    // Generate song structure with variation
    const structure = this.generateVariedStructure(settings);
    
    // Create audio using evolved parameters
    const audioBuffer = await this.synthesizeFromGenome(bestGenome, structure, settings);
    
    // Update generation and fitness tracking
    this.generation++;
    this.logGenerationStats();
    
    return audioBuffer;
  }

  private initializePopulation(): void {
    this.population = [];
    
    for (let i = 0; i < this.POPULATION_SIZE; i++) {
      this.population.push({
        id: `genome_${i}`,
        chordProgression: this.randomChordProgression(),
        melodyPattern: this.randomMelodyPattern(),
        rhythmGenetics: this.randomRhythmGenetics(),
        basslineGenetics: this.randomBasslineGenetics(),
        effectsGenetics: this.randomEffectsGenetics(),
        structureGenetics: this.randomStructureGenetics(),
        fitness: 0,
        generation: 0
      });
    }
  }

  private evolvePopulation(settings: GenerationSettings): void {
    // Evaluate fitness of current population
    this.evaluateFitness(settings);
    
    // Select elite individuals
    const elite = this.selectElite();
    
    // Generate new population through crossover and mutation
    const newPopulation: MusicGenome[] = [...elite];
    
    while (newPopulation.length < this.POPULATION_SIZE) {
      const parent1 = this.tournamentSelection();
      const parent2 = this.tournamentSelection();
      
      if (Math.random() < this.CROSSOVER_RATE) {
        const offspring = this.crossover(parent1, parent2);
        if (Math.random() < this.MUTATION_RATE) {
          this.mutate(offspring);
        }
        newPopulation.push(offspring);
      } else {
        newPopulation.push(this.mutate({...parent1}));
      }
    }
    
    this.population = newPopulation;
  }

  private evaluateFitness(settings: GenerationSettings): void {
    this.population.forEach(genome => {
      let fitness = 0;
      
      // Music theory compliance (30% of fitness)
      fitness += this.evaluateHarmonyCompliance(genome) * 0.3;
      
      // Musical style authenticity (25% of fitness)
      fitness += this.evaluateStyleAuthenticity(genome, settings) * 0.25;
      
      // Variation and uniqueness (25% of fitness)
      fitness += this.evaluateUniqueness(genome) * 0.25;
      
      // User preference alignment (20% of fitness)
      fitness += this.evaluateUserPreferences(genome, settings) * 0.2;
      
      genome.fitness = Math.max(0, Math.min(1, fitness));
    });
  }

  private evaluateHarmonyCompliance(genome: MusicGenome): number {
    let score = 0;
    
    // Check voice leading quality
    for (let i = 1; i < genome.chordProgression.length; i++) {
      const prev = genome.chordProgression[i - 1];
      const curr = genome.chordProgression[i];
      
      // Smooth voice leading (prefer step-wise motion)
      const intervalMovement = Math.abs(curr.root - prev.root);
      if (intervalMovement <= 2) score += 0.3; // Step-wise
      else if (intervalMovement <= 4) score += 0.2; // Skip
      else score += 0.1; // Leap
    }
    
    // Check for proper resolution
    const lastChord = genome.chordProgression[genome.chordProgression.length - 1];
    if (lastChord.root === 0) score += 0.2; // Resolves to Em (tonic)
    
    // Pentatonic compliance in melody
    const pentatonicNotes = new Set([0, 2, 3, 5, 7]);
    const melodyCompliance = genome.melodyPattern.intervals.filter(note => 
      pentatonicNotes.has(note % 12)
    ).length / genome.melodyPattern.intervals.length;
    score += melodyCompliance * 0.3;
    
    return score / 0.8; // Normalize to 0-1
  }

  private evaluateStyleAuthenticity(genome: MusicGenome, settings: GenerationSettings): number {
    let score = 0;
    
    // Sparse rhythm patterns (Whitearmor signature)
    const rhythmSparsity = 1 - (genome.rhythmGenetics.density / 100);
    score += rhythmSparsity * 0.3;
    
    // Heavy reverb preference
    if (genome.effectsGenetics.reverb > 60) score += 0.2;
    
    // Slow to medium tempo preference
    const tempoScore = settings.pace < 100 ? 0.3 : 0.1;
    score += tempoScore;
    
    // Modal harmony usage
    const modalChords = genome.chordProgression.filter(chord => 
      chord.extensions.length > 0
    ).length;
    score += (modalChords / genome.chordProgression.length) * 0.2;
    
    return score;
  }

  private evaluateUniqueness(genome: MusicGenome): number {
    let uniqueness = 1.0;
    
    // Compare against previous generations
    if (this.generation > 0) {
      // Penalize too much similarity to previous best
      const similarity = this.calculateGenomeSimilarity(genome, this.getBestGenome());
      uniqueness -= similarity * 0.5;
    }
    
    // Reward complex chord substitutions
    const substitutions = genome.chordProgression.filter(chord => 
      Object.values(this.TRITONE_SUBSTITUTIONS).includes(chord.type as any)
    ).length;
    uniqueness += (substitutions / genome.chordProgression.length) * 0.3;
    
    return Math.max(0, uniqueness);
  }

  private evaluateUserPreferences(genome: MusicGenome, settings: GenerationSettings): number {
    let score = 0;
    
    // Bass level alignment
    const bassAlignment = 1 - Math.abs(genome.basslineGenetics.level - settings.bass) / 100;
    score += bassAlignment * 0.3;
    
    // Reverb alignment  
    const reverbAlignment = 1 - Math.abs(genome.effectsGenetics.reverb - settings.reverb) / 100;
    score += reverbAlignment * 0.3;
    
    // Mood alignment
    const moodBonus = this.getMoodAlignment(genome, settings.mood);
    score += moodBonus * 0.4;
    
    return score;
  }

  private getMoodAlignment(genome: MusicGenome, mood: string): number {
    const moodMappings = {
      dreamy: { reverb: 80, pace: 70, density: 30 },
      dark: { reverb: 60, pace: 60, density: 40 },
      uplifting: { reverb: 70, pace: 90, density: 60 },
      melancholic: { reverb: 90, pace: 50, density: 20 },
      ethereal: { reverb: 95, pace: 65, density: 25 },
      nostalgic: { reverb: 85, pace: 75, density: 35 }
    };
    
    const target = moodMappings[mood as keyof typeof moodMappings];
    if (!target) return 0.5;
    
    const reverbMatch = 1 - Math.abs(genome.effectsGenetics.reverb - target.reverb) / 100;
    const densityMatch = 1 - Math.abs(genome.rhythmGenetics.density - target.density) / 100;
    
    return (reverbMatch + densityMatch) / 2;
  }

  private tournamentSelection(): MusicGenome {
    const tournamentSize = 3;
    let best = this.population[Math.floor(Math.random() * this.population.length)];
    
    for (let i = 1; i < tournamentSize; i++) {
      const candidate = this.population[Math.floor(Math.random() * this.population.length)];
      if (candidate.fitness > best.fitness) {
        best = candidate;
      }
    }
    
    return best;
  }

  private crossover(parent1: MusicGenome, parent2: MusicGenome): MusicGenome {
    const crossoverPoint = Math.floor(Math.random() * parent1.chordProgression.length);
    
    return {
      id: `genome_${Date.now()}_${Math.random()}`,
      chordProgression: [
        ...parent1.chordProgression.slice(0, crossoverPoint),
        ...parent2.chordProgression.slice(crossoverPoint)
      ],
      melodyPattern: Math.random() < 0.5 ? parent1.melodyPattern : parent2.melodyPattern,
      rhythmGenetics: this.blendRhythmGenetics(parent1.rhythmGenetics, parent2.rhythmGenetics),
      basslineGenetics: this.blendBasslineGenetics(parent1.basslineGenetics, parent2.basslineGenetics),
      effectsGenetics: this.blendEffectsGenetics(parent1.effectsGenetics, parent2.effectsGenetics),
      structureGenetics: Math.random() < 0.5 ? parent1.structureGenetics : parent2.structureGenetics,
      fitness: 0,
      generation: this.generation + 1
    };
  }

  private mutate(genome: MusicGenome): MusicGenome {
    // Chord progression mutation
    if (Math.random() < 0.3) {
      const randomIndex = Math.floor(Math.random() * genome.chordProgression.length);
      genome.chordProgression[randomIndex] = this.applyChordSubstitution(
        genome.chordProgression[randomIndex]
      );
    }
    
    // Melody pattern mutation
    if (Math.random() < 0.2) {
      genome.melodyPattern = this.mutateMelodyPattern(genome.melodyPattern);
    }
    
    // Effects mutation
    if (Math.random() < 0.4) {
      genome.effectsGenetics.reverb += (Math.random() - 0.5) * 20;
      genome.effectsGenetics.reverb = Math.max(0, Math.min(100, genome.effectsGenetics.reverb));
    }
    
    return genome;
  }

  private applyChordSubstitution(chord: ChordInfo): ChordInfo {
    const substitutions = [
      // Tritone substitution
      () => {
        const tritoneRoot = (chord.root + 6) % 12;
        return { ...chord, root: tritoneRoot, type: 'dominant7' };
      },
      // Add extensions
      () => {
        const extensions = ['add9', 'sus2', 'sus4', 'add11'];
        const randomExt = extensions[Math.floor(Math.random() * extensions.length)];
        return { ...chord, extensions: [...chord.extensions, randomExt] };
      },
      // Modal substitution
      () => {
        const modalTypes = ['minor7', 'major7', 'minor9', 'major9'];
        const randomType = modalTypes[Math.floor(Math.random() * modalTypes.length)];
        return { ...chord, type: randomType };
      }
    ];
    
    const randomSub = substitutions[Math.floor(Math.random() * substitutions.length)];
    return randomSub();
  }

  private async synthesizeFromGenome(
    genome: MusicGenome, 
    structure: SongStructure, 
    settings: GenerationSettings
  ): Promise<AudioBuffer> {
    // AudioContext is not available in Node.js - this is client-side only
    // For server-side synthesis, we need to use a different approach
    throw new Error("AudioContext synthesis not available in server environment");
  }

  private async generateSection(
    genome: MusicGenome,
    section: SectionInfo,
    settings: GenerationSettings,
    audioContext: AudioContext
  ): Promise<AudioBuffer> {
    const sampleRate = audioContext.sampleRate;
    const samples = Math.floor(section.duration * sampleRate);
    const buffer = audioContext.createBuffer(2, samples, sampleRate);
    
    // Generate layers based on genetics
    if (settings.instruments.pads) {
      await this.generateChordPads(buffer, genome, section, audioContext);
    }
    
    if (settings.instruments.bass) {
      await this.generateEvolved808Bass(buffer, genome, section, audioContext);
    }
    
    if (settings.instruments.drums) {
      await this.generateGeneticDrums(buffer, genome, section, audioContext);
    }
    
    if (settings.instruments.arps) {
      await this.generateEvolvedArpeggios(buffer, genome, section, audioContext);
    }
    
    if (settings.instruments.synths) {
      await this.generateNeuralMelodies(buffer, genome, section, audioContext);
    }
    
    // Apply evolved effects processing
    this.applyGeneticEffects(buffer, genome, settings);
    
    return buffer;
  }

  private getBestGenome(): MusicGenome {
    return this.population.reduce((best, current) => 
      current.fitness > best.fitness ? current : best
    );
  }

  private generateVariedStructure(settings: GenerationSettings): SongStructure {
    // Generate unique structure based on current generation
    const baseStructures = [
      ['intro', 'verse', 'chorus', 'verse', 'chorus', 'bridge', 'chorus', 'outro'],
      ['intro', 'build', 'drop', 'breakdown', 'build', 'drop', 'outro'],
      ['intro', 'verse', 'pre-chorus', 'chorus', 'verse', 'pre-chorus', 'chorus', 'bridge', 'chorus', 'outro']
    ];
    
    const structureIndex = this.generation % baseStructures.length;
    const baseStructure = baseStructures[structureIndex];
    
    // Apply genetic variation to timing
    const sections = baseStructure.map((name, index) => ({
      name,
      startTime: index * 16, // Base 16-beat sections
      duration: this.getVariedSectionDuration(name, settings),
      intensity: this.calculateSectionIntensity(name, index, baseStructure.length)
    }));
    
    return { sections, totalDuration: sections.reduce((sum, s) => sum + s.duration, 0) };
  }

  private getVariedSectionDuration(sectionName: string, settings: GenerationSettings): number {
    const baseDurations = {
      intro: 16, verse: 32, chorus: 32, bridge: 16, outro: 16,
      build: 24, drop: 32, breakdown: 16, 'pre-chorus': 16
    };
    
    const base = baseDurations[sectionName as keyof typeof baseDurations] || 16;
    const variation = (Math.random() - 0.5) * 8; // ±4 beat variation
    const paceMultiplier = settings.pace / 85; // Normalize around 85 BPM
    
    return Math.max(8, base + variation) * paceMultiplier;
  }

  private calculateSectionIntensity(name: string, index: number, total: number): number {
    const intensityMap = {
      intro: 0.3, verse: 0.6, 'pre-chorus': 0.8, chorus: 1.0, 
      bridge: 0.7, outro: 0.2, build: 0.9, drop: 1.0, breakdown: 0.4
    };
    
    const baseIntensity = intensityMap[name as keyof typeof intensityMap] || 0.5;
    const progressionBoost = (index / total) * 0.2; // Gradual intensity increase
    
    return Math.min(1.0, baseIntensity + progressionBoost);
  }

  // Helper methods for random genetics generation
  private randomChordProgression(): ChordInfo[] {
    const progressions = Object.values(this.CHORD_PROGRESSIONS);
    return progressions[Math.floor(Math.random() * progressions.length)];
  }

  private randomMelodyPattern(): MelodyGenetics {
    const patterns = Object.values(this.MELODY_PATTERNS);
    return patterns[Math.floor(Math.random() * patterns.length)];
  }

  private randomRhythmGenetics(): RhythmGenetics {
    return {
      density: Math.random() * 60 + 20, // 20-80% density
      swing: Math.random() * 0.3,       // 0-30% swing
      syncopation: Math.random() * 0.5, // 0-50% syncopation
      complexity: Math.random()         // 0-100% complexity
    };
  }

  private randomBasslineGenetics(): BasslineGenetics {
    return {
      level: Math.random() * 80 + 20,   // 20-100% level
      pattern: Math.random() < 0.5 ? 'root' : 'walking',
      octave: Math.floor(Math.random() * 2) + 1, // 1-2 octaves
      envelope: Math.random() * 0.3 + 0.1       // 0.1-0.4 sec attack
    };
  }

  private randomEffectsGenetics(): EffectsGenetics {
    return {
      reverb: Math.random() * 40 + 60,  // 60-100% (Whitearmor style)
      delay: Math.random() * 60 + 20,   // 20-80%
      distortion: Math.random() * 30,   // 0-30%
      filter: Math.random() * 50 + 25,  // 25-75%
      compression: Math.random() * 40 + 30 // 30-70%
    };
  }

  private randomStructureGenetics(): StructureGenetics {
    return {
      sectionVariation: Math.random() * 0.4 + 0.1, // 10-50% variation
      transitionStyle: Math.random() < 0.5 ? 'smooth' : 'cut',
      energyFlow: Math.random() < 0.7 ? 'building' : 'wave',
      complexity: Math.random() * 0.6 + 0.2        // 20-80% complexity
    };
  }

  // Additional helper methods would continue here...
  private logGenerationStats(): void {
    const bestFitness = this.getBestGenome().fitness;
    const avgFitness = this.population.reduce((sum, g) => sum + g.fitness, 0) / this.population.length;
    
    console.log(`Generation ${this.generation}: Best=${bestFitness.toFixed(3)}, Avg=${avgFitness.toFixed(3)}`);
    this.fitnessHistory.push(bestFitness);
  }

  // Placeholder methods for audio synthesis (implement based on existing system)
  private mixBuffers(target: AudioBuffer, source: AudioBuffer, startTime: number): void {
    // Implementation for mixing audio buffers
  }

  private calculateTotalDuration(structure: SongStructure): number {
    return structure.sections.reduce((sum, section) => sum + section.duration, 0);
  }

  private generateChordPads(buffer: AudioBuffer, genome: MusicGenome, section: SectionInfo, audioContext: AudioContext): Promise<void> {
    // Implementation for evolved chord pad generation
    return Promise.resolve();
  }

  private generateEvolved808Bass(buffer: AudioBuffer, genome: MusicGenome, section: SectionInfo, audioContext: AudioContext): Promise<void> {
    // Implementation for evolved bass generation
    return Promise.resolve();
  }

  private generateGeneticDrums(buffer: AudioBuffer, genome: MusicGenome, section: SectionInfo, audioContext: AudioContext): Promise<void> {
    // Implementation for genetic drum patterns
    return Promise.resolve();
  }

  private generateEvolvedArpeggios(buffer: AudioBuffer, genome: MusicGenome, section: SectionInfo, audioContext: AudioContext): Promise<void> {
    // Implementation for evolved arpeggio patterns
    return Promise.resolve();
  }

  private generateNeuralMelodies(buffer: AudioBuffer, genome: MusicGenome, section: SectionInfo, audioContext: AudioContext): Promise<void> {
    // Implementation for neural melody generation
    return Promise.resolve();
  }

  private applyGeneticEffects(buffer: AudioBuffer, genome: MusicGenome, settings: GenerationSettings): void {
    // Implementation for evolved effects processing
  }

  private blendRhythmGenetics(parent1: RhythmGenetics, parent2: RhythmGenetics): RhythmGenetics {
    return {
      density: (parent1.density + parent2.density) / 2,
      swing: (parent1.swing + parent2.swing) / 2,
      syncopation: (parent1.syncopation + parent2.syncopation) / 2,
      complexity: (parent1.complexity + parent2.complexity) / 2
    };
  }

  private blendBasslineGenetics(parent1: BasslineGenetics, parent2: BasslineGenetics): BasslineGenetics {
    return {
      level: (parent1.level + parent2.level) / 2,
      pattern: Math.random() < 0.5 ? parent1.pattern : parent2.pattern,
      octave: Math.round((parent1.octave + parent2.octave) / 2),
      envelope: (parent1.envelope + parent2.envelope) / 2
    };
  }

  private blendEffectsGenetics(parent1: EffectsGenetics, parent2: EffectsGenetics): EffectsGenetics {
    return {
      reverb: (parent1.reverb + parent2.reverb) / 2,
      delay: (parent1.delay + parent2.delay) / 2,
      distortion: (parent1.distortion + parent2.distortion) / 2,
      filter: (parent1.filter + parent2.filter) / 2,
      compression: (parent1.compression + parent2.compression) / 2
    };
  }

  private calculateGenomeSimilarity(genome1: MusicGenome, genome2: MusicGenome): number {
    // Simple similarity calculation - could be enhanced
    let similarity = 0;
    
    // Compare chord progressions
    const chordSimilarity = genome1.chordProgression.reduce((sum, chord, index) => {
      if (index < genome2.chordProgression.length) {
        return sum + (genome2.chordProgression[index].root === chord.root ? 1 : 0);
      }
      return sum;
    }, 0) / Math.max(genome1.chordProgression.length, genome2.chordProgression.length);
    
    similarity += chordSimilarity * 0.4;
    
    // Compare effects genetics
    const effectsSimilarity = 1 - Math.abs(genome1.effectsGenetics.reverb - genome2.effectsGenetics.reverb) / 100;
    similarity += effectsSimilarity * 0.3;
    
    // Compare rhythm genetics
    const rhythmSimilarity = 1 - Math.abs(genome1.rhythmGenetics.density - genome2.rhythmGenetics.density) / 100;
    similarity += rhythmSimilarity * 0.3;
    
    return similarity;
  }

  private mutateMelodyPattern(pattern: MelodyGenetics): MelodyGenetics {
    const newPattern = { ...pattern };
    
    // Mutate intervals
    if (Math.random() < 0.5) {
      const randomIndex = Math.floor(Math.random() * newPattern.intervals.length);
      newPattern.intervals[randomIndex] = (newPattern.intervals[randomIndex] + Math.floor(Math.random() * 5) - 2) % 12;
    }
    
    return newPattern;
  }

  private selectElite(): MusicGenome[] {
    const sorted = [...this.population].sort((a, b) => b.fitness - a.fitness);
    return sorted.slice(0, this.ELITE_SIZE);
  }
}

// Type definitions for genetic algorithm
interface MusicGenome {
  id: string;
  chordProgression: ChordInfo[];
  melodyPattern: MelodyGenetics;
  rhythmGenetics: RhythmGenetics;
  basslineGenetics: BasslineGenetics;
  effectsGenetics: EffectsGenetics;
  structureGenetics: StructureGenetics;
  fitness: number;
  generation: number;
}

interface ChordInfo {
  root: number;
  type: string;
  extensions: string[];
}

interface MelodyGenetics {
  intervals: number[];
  rhythms: number[];
  contour: string;
  density: string;
}

interface RhythmGenetics {
  density: number;
  swing: number;
  syncopation: number;
  complexity: number;
}

interface BasslineGenetics {
  level: number;
  pattern: string;
  octave: number;
  envelope: number;
}

interface EffectsGenetics {
  reverb: number;
  delay: number;
  distortion: number;
  filter: number;
  compression: number;
}

interface StructureGenetics {
  sectionVariation: number;
  transitionStyle: string;
  energyFlow: string;
  complexity: number;
}

interface SongStructure {
  sections: SectionInfo[];
  totalDuration: number;
}

interface SectionInfo {
  name: string;
  startTime: number;
  duration: number;
  intensity: number;
}