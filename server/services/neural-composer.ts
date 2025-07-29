// Neural network-inspired composition system for advanced melody and harmony generation
// Implements NEAT-style architecture evolution and neural pattern learning

import { GenerationSettings } from "@shared/schema";

export class NeuralComposer {
  private networks: ComposerNetwork[] = [];
  private generation = 0;
  private bestFitness = 0;
  
  // NEAT-inspired parameters
  private readonly INNOVATION_NUMBER = new Map<string, number>();
  private readonly SPECIES_THRESHOLD = 0.6;
  private readonly MUTATION_RATES = {
    ADD_NODE: 0.03,
    ADD_CONNECTION: 0.05,
    WEIGHT_MUTATION: 0.8,
    WEIGHT_PERTURBATION: 0.9
  };

  // Music-specific neural patterns
  private readonly MUSICAL_FEATURES = {
    harmonic: ['consonance', 'dissonance', 'resolution', 'tension'],
    rhythmic: ['pulse', 'syncopation', 'groove', 'swing'],
    melodic: ['contour', 'interval', 'phrasing', 'ornamentation'],
    structural: ['repetition', 'variation', 'development', 'climax']
  };

  constructor() {
    this.initializePopulation();
  }

  // Generate neural-composed music based on evolved networks
  async composeMusic(settings: GenerationSettings): Promise<CompositionResult> {
    console.log(`Neural composition generation ${this.generation + 1}`);
    
    // Evolve networks based on musical fitness
    this.evolveNetworks(settings);
    
    // Select best performing network
    const bestNetwork = this.getBestNetwork();
    
    // Generate composition using neural patterns
    const composition = await this.generateComposition(bestNetwork, settings);
    
    this.generation++;
    return composition;
  }

  private initializePopulation(): void {
    // Create initial minimal networks
    for (let i = 0; i < 50; i++) {
      const network = this.createMinimalNetwork();
      this.networks.push(network);
    }
  }

  private createMinimalNetwork(): ComposerNetwork {
    const inputs = [
      'time_position',     // 0.0-1.0 position in song
      'harmonic_context',  // Current chord tension (0.0-1.0)
      'rhythmic_position', // Beat position (0.0-1.0)
      'energy_level',      // Section energy (0.0-1.0)
      'previous_note',     // Previous note pitch (0.0-1.0)
      'user_bass_pref',    // User bass preference (0.0-1.0)
      'user_reverb_pref',  // User reverb preference (0.0-1.0)
      'mood_vector'        // Mood encoding (0.0-1.0)
    ];
    
    const outputs = [
      'note_pitch',        // Next note pitch (0.0-1.0)
      'note_velocity',     // Note velocity (0.0-1.0)
      'note_duration',     // Note duration (0.0-1.0)
      'harmonic_weight',   // Harmonic importance (0.0-1.0)
      'rhythmic_complexity' // Rhythmic complexity (0.0-1.0)
    ];

    const nodes: NetworkNode[] = [];
    const connections: NetworkConnection[] = [];
    
    // Create input nodes
    inputs.forEach((type, index) => {
      nodes.push({
        id: index,
        type: 'input',
        activation: 0,
        bias: 0,
        nodeType: type
      });
    });
    
    // Create output nodes
    outputs.forEach((type, index) => {
      const nodeId = inputs.length + index;
      nodes.push({
        id: nodeId,
        type: 'output',
        activation: 0,
        bias: Math.random() * 2 - 1, // Random bias -1 to 1
        nodeType: type
      });
    });
    
    // Create minimal connections (each input to each output)
    for (let i = 0; i < inputs.length; i++) {
      for (let j = 0; j < outputs.length; j++) {
        const outputId = inputs.length + j;
        connections.push({
          innovationNumber: this.getInnovationNumber(i, outputId),
          inputNode: i,
          outputNode: outputId,
          weight: Math.random() * 2 - 1, // Random weight -1 to 1
          enabled: true
        });
      }
    }

    return {
      id: `network_${Math.random().toString(36).substr(2, 9)}`,
      nodes,
      connections,
      fitness: 0,
      species: 0,
      generation: this.generation
    };
  }

  private evolveNetworks(settings: GenerationSettings): void {
    // Evaluate fitness of all networks
    this.evaluateNetworkFitness(settings);
    
    // Speciate networks (group similar ones)
    this.speciateNetworks();
    
    // Select parents and create offspring
    const newPopulation: ComposerNetwork[] = [];
    
    // Keep elite from each species
    const species = this.groupNetworksBySpecies();
    Object.values(species).forEach(speciesNetworks => {
      if (speciesNetworks.length > 0) {
        const best = speciesNetworks.reduce((a, b) => a.fitness > b.fitness ? a : b);
        newPopulation.push(this.cloneNetwork(best));
      }
    });
    
    // Fill remaining population with offspring
    while (newPopulation.length < 50) {
      const parent1 = this.selectParent();
      const parent2 = this.selectParent();
      
      let offspring = this.crossover(parent1, parent2);
      offspring = this.mutate(offspring);
      
      newPopulation.push(offspring);
    }
    
    this.networks = newPopulation;
  }

  private evaluateNetworkFitness(settings: GenerationSettings): void {
    this.networks.forEach(network => {
      let fitness = 0;
      
      // Test network on multiple musical scenarios
      const testScenarios = this.generateTestScenarios(settings);
      
      testScenarios.forEach(scenario => {
        const output = this.activateNetwork(network, scenario.inputs);
        fitness += this.evaluateMusicalOutput(output, scenario.expected, settings);
      });
      
      network.fitness = fitness / testScenarios.length;
    });
  }

  private generateTestScenarios(settings: GenerationSettings): TestScenario[] {
    const scenarios: TestScenario[] = [];
    
    // Chord progression scenarios
    const chordProgressions = [
      [0, 5, 8, 3], // Em-Am-C-G (signature Whitearmor)
      [0, 3, 8, 5], // Em-G-C-Am (variation)
      [7, 0, 5, 3]  // D-Em-Am-G (modal)
    ];
    
    chordProgressions.forEach(progression => {
      progression.forEach((chord, position) => {
        scenarios.push({
          inputs: {
            time_position: position / progression.length,
            harmonic_context: this.getChordTension(chord),
            rhythmic_position: 0.0, // On beat
            energy_level: settings.pace / 180,
            previous_note: chord / 12,
            user_bass_pref: settings.bass / 100,
            user_reverb_pref: settings.reverb / 100,
            mood_vector: this.encodeMood(settings.mood)
          },
          expected: {
            note_pitch: chord / 12,
            note_velocity: 0.7,
            note_duration: 0.5,
            harmonic_weight: 0.8,
            rhythmic_complexity: 0.3
          }
        });
      });
    });
    
    // Add syncopated rhythm scenarios
    for (let beat = 0; beat < 8; beat++) {
      const isOffBeat = beat % 2 === 1;
      scenarios.push({
        inputs: {
          time_position: beat / 8,
          harmonic_context: 0.5,
          rhythmic_position: (beat % 4) / 4,
          energy_level: settings.pace / 180,
          previous_note: 0.33,
          user_bass_pref: settings.bass / 100,
          user_reverb_pref: settings.reverb / 100,
          mood_vector: this.encodeMood(settings.mood)
        },
        expected: {
          note_pitch: isOffBeat ? 0.4 : 0.33, // Syncopation
          note_velocity: isOffBeat ? 0.5 : 0.8,
          note_duration: isOffBeat ? 0.25 : 0.5,
          harmonic_weight: 0.6,
          rhythmic_complexity: isOffBeat ? 0.9 : 0.3
        }
      });
    }
    
    return scenarios;
  }

  private activateNetwork(network: ComposerNetwork, inputs: Record<string, number>): Record<string, number> {
    // Reset all activations
    network.nodes.forEach(node => node.activation = 0);
    
    // Set input activations
    network.nodes.forEach(node => {
      if (node.type === 'input' && inputs[node.nodeType]) {
        node.activation = inputs[node.nodeType];
      }
    });
    
    // Process network (simplified feed-forward for now)
    const maxDepth = 10; // Prevent infinite loops
    for (let depth = 0; depth < maxDepth; depth++) {
      let changed = false;
      
      network.connections.forEach(conn => {
        if (!conn.enabled) return;
        
        const inputNode = network.nodes.find(n => n.id === conn.inputNode);
        const outputNode = network.nodes.find(n => n.id === conn.outputNode);
        
        if (inputNode && outputNode && outputNode.type !== 'input') {
          const signal = inputNode.activation * conn.weight;
          const newActivation = this.activate(outputNode.bias + signal);
          
          if (Math.abs(newActivation - outputNode.activation) > 0.001) {
            outputNode.activation = newActivation;
            changed = true;
          }
        }
      });
      
      if (!changed) break;
    }
    
    // Extract outputs
    const outputs: Record<string, number> = {};
    network.nodes.forEach(node => {
      if (node.type === 'output') {
        outputs[node.nodeType] = node.activation;
      }
    });
    
    return outputs;
  }

  private activate(value: number): number {
    // Sigmoid activation function
    return 1 / (1 + Math.exp(-value));
  }

  private evaluateMusicalOutput(
    output: Record<string, number>, 
    expected: Record<string, number>,
    settings: GenerationSettings
  ): number {
    let score = 0;
    
    // Evaluate pitch accuracy (with some tolerance for creativity)
    const pitchError = Math.abs(output.note_pitch - expected.note_pitch);
    score += Math.max(0, 1 - pitchError * 2) * 0.3;
    
    // Evaluate rhythmic appropriateness
    const rhythmScore = this.evaluateRhythmicFit(output, expected, settings);
    score += rhythmScore * 0.25;
    
    // Evaluate harmonic context awareness
    const harmonicScore = this.evaluateHarmonicContext(output, expected);
    score += harmonicScore * 0.25;
    
    // Evaluate user preference alignment
    const preferenceScore = this.evaluateUserPreferences(output, settings);
    score += preferenceScore * 0.2;
    
    return Math.max(0, Math.min(1, score));
  }

  private evaluateRhythmicFit(
    output: Record<string, number>,
    expected: Record<string, number>,
    settings: GenerationSettings
  ): number {
    let score = 0;
    
    // Check if complexity matches pace/mood
    const expectedComplexity = settings.pace > 120 ? 0.7 : 0.4;
    const complexityError = Math.abs(output.rhythmic_complexity - expectedComplexity);
    score += Math.max(0, 1 - complexityError) * 0.6;
    
    // Check velocity appropriateness
    const velocityError = Math.abs(output.note_velocity - expected.note_velocity);
    score += Math.max(0, 1 - velocityError * 1.5) * 0.4;
    
    return score;
  }

  private evaluateHarmonicContext(
    output: Record<string, number>,
    expected: Record<string, number>
  ): number {
    const harmonicError = Math.abs(output.harmonic_weight - expected.harmonic_weight);
    return Math.max(0, 1 - harmonicError * 1.5);
  }

  private evaluateUserPreferences(
    output: Record<string, number>,
    settings: GenerationSettings
  ): number {
    let score = 0;
    
    // Heavy bass preference should influence note selection
    if (settings.bass > 70 && output.note_pitch < 0.3) {
      score += 0.5; // Reward low notes when bass is high
    }
    
    // High reverb should encourage sustained notes
    if (settings.reverb > 70 && output.note_duration > 0.6) {
      score += 0.5; // Reward long notes when reverb is high
    }
    
    return score;
  }

  private encodeMood(mood: string): number {
    const moodEncodings = {
      dreamy: 0.2,
      dark: 0.8,
      uplifting: 0.1,
      melancholic: 0.7,
      ethereal: 0.15,
      nostalgic: 0.6
    };
    
    return moodEncodings[mood as keyof typeof moodEncodings] || 0.5;
  }

  private getChordTension(chord: number): number {
    // Map chord to tension level (0 = stable, 1 = high tension)
    const tensionMap = {
      0: 0.2,  // Em (tonic, stable)
      3: 0.7,  // G (dominant function, tension)
      5: 0.4,  // Am (subdominant, mild tension)
      8: 0.1   // C (major resolution, very stable)
    };
    
    return tensionMap[chord as keyof typeof tensionMap] || 0.5;
  }

  private async generateComposition(
    network: ComposerNetwork, 
    settings: GenerationSettings
  ): Promise<CompositionResult> {
    const composition: CompositionNote[] = [];
    const duration = 120; // 2 minutes
    const timeStep = 0.25; // 16th note resolution
    
    let currentTime = 0;
    let previousNote = 0.33; // Start on E (root)
    
    // Generate chord progression for context
    const chordProgression = [0, 5, 8, 3]; // Em-Am-C-G
    const chordDuration = 8; // 8 beats per chord
    
    while (currentTime < duration) {
      // Determine current harmonic context
      const chordIndex = Math.floor(currentTime / chordDuration) % chordProgression.length;
      const currentChord = chordProgression[chordIndex];
      const beatPosition = (currentTime % 4) / 4;
      
      // Prepare network inputs
      const inputs = {
        time_position: currentTime / duration,
        harmonic_context: this.getChordTension(currentChord),
        rhythmic_position: beatPosition,
        energy_level: this.calculateEnergyLevel(currentTime, duration, settings),
        previous_note: previousNote,
        user_bass_pref: settings.bass / 100,
        user_reverb_pref: settings.reverb / 100,
        mood_vector: this.encodeMood(settings.mood)
      };
      
      // Get network output
      const output = this.activateNetwork(network, inputs);
      
      // Convert neural output to musical parameters
      if (output.note_velocity > 0.1) { // Only add note if velocity is significant
        const note: CompositionNote = {
          time: currentTime,
          pitch: this.quantizePitch(output.note_pitch, currentChord),
          velocity: Math.max(0.1, Math.min(1.0, output.note_velocity)),
          duration: Math.max(0.125, output.note_duration * 2),
          harmonic_weight: output.harmonic_weight,
          layer: this.determineInstrumentLayer(output, settings)
        };
        
        composition.push(note);
        previousNote = note.pitch;
      }
      
      currentTime += timeStep;
    }
    
    return {
      notes: composition,
      fitness: network.fitness,
      generation: this.generation,
      networkComplexity: network.connections.length
    };
  }

  private quantizePitch(neuralPitch: number, chordRoot: number): number {
    // Quantize neural output to musically appropriate pitches
    const scale = [0, 2, 3, 5, 7, 8, 10]; // Natural minor scale
    const octaves = [2, 3, 4, 5]; // Available octaves
    
    const scaleIndex = Math.floor(neuralPitch * scale.length);
    const octaveIndex = Math.floor(neuralPitch * octaves.length) % octaves.length;
    
    const scaleDegree = scale[scaleIndex % scale.length];
    const octave = octaves[octaveIndex];
    
    return (chordRoot + scaleDegree) / 12 + octave;
  }

  private calculateEnergyLevel(currentTime: number, totalDuration: number, settings: GenerationSettings): number {
    // Create energy curve based on song structure
    const progress = currentTime / totalDuration;
    
    if (progress < 0.2) return 0.3; // Intro
    if (progress < 0.4) return 0.6; // Verse
    if (progress < 0.6) return 1.0; // Chorus
    if (progress < 0.8) return 0.7; // Bridge
    return 0.4; // Outro
  }

  private determineInstrumentLayer(output: Record<string, number>, settings: GenerationSettings): string {
    if (output.note_pitch < 0.3) return 'bass';
    if (output.rhythmic_complexity > 0.7) return 'drums';
    if (output.harmonic_weight > 0.7) return 'pads';
    if (output.note_duration < 0.3) return 'arpeggios';
    return 'melody';
  }

  // NEAT-style genetic operators
  private crossover(parent1: ComposerNetwork, parent2: ComposerNetwork): ComposerNetwork {
    const offspring: ComposerNetwork = {
      id: `network_${Math.random().toString(36).substr(2, 9)}`,
      nodes: [],
      connections: [],
      fitness: 0,
      species: 0,
      generation: this.generation + 1
    };
    
    // Inherit nodes from both parents
    const allNodeIds = new Set([
      ...parent1.nodes.map(n => n.id),
      ...parent2.nodes.map(n => n.id)
    ]);
    
    allNodeIds.forEach(nodeId => {
      const node1 = parent1.nodes.find(n => n.id === nodeId);
      const node2 = parent2.nodes.find(n => n.id === nodeId);
      
      if (node1 && node2) {
        // Both parents have this node - blend properties
        offspring.nodes.push({
          id: nodeId,
          type: node1.type,
          activation: 0,
          bias: (node1.bias + node2.bias) / 2,
          nodeType: node1.nodeType
        });
      } else if (node1) {
        offspring.nodes.push({...node1, activation: 0});
      } else if (node2) {
        offspring.nodes.push({...node2, activation: 0});
      }
    });
    
    // Inherit connections using NEAT crossover rules
    const allInnovations = new Set([
      ...parent1.connections.map(c => c.innovationNumber),
      ...parent2.connections.map(c => c.innovationNumber)
    ]);
    
    allInnovations.forEach(innovation => {
      const conn1 = parent1.connections.find(c => c.innovationNumber === innovation);
      const conn2 = parent2.connections.find(c => c.innovationNumber === innovation);
      
      if (conn1 && conn2) {
        // Matching genes - inherit from fitter parent or blend
        const chosenParent = parent1.fitness >= parent2.fitness ? parent1 : parent2;
        const chosenConn = chosenParent === parent1 ? conn1 : conn2;
        offspring.connections.push({...chosenConn});
      } else {
        // Disjoint or excess genes - inherit from fitter parent
        const chosenConn = parent1.fitness >= parent2.fitness ? conn1 : conn2;
        if (chosenConn) {
          offspring.connections.push({...chosenConn});
        }
      }
    });
    
    return offspring;
  }

  private mutate(network: ComposerNetwork): ComposerNetwork {
    const mutated = this.cloneNetwork(network);
    
    // Weight mutation
    if (Math.random() < this.MUTATION_RATES.WEIGHT_MUTATION) {
      mutated.connections.forEach(conn => {
        if (Math.random() < this.MUTATION_RATES.WEIGHT_PERTURBATION) {
          // Small perturbation
          conn.weight += (Math.random() - 0.5) * 0.1;
        } else {
          // Complete replacement
          conn.weight = Math.random() * 2 - 1;
        }
      });
    }
    
    // Add connection mutation
    if (Math.random() < this.MUTATION_RATES.ADD_CONNECTION) {
      this.addConnectionMutation(mutated);
    }
    
    // Add node mutation
    if (Math.random() < this.MUTATION_RATES.ADD_NODE) {
      this.addNodeMutation(mutated);
    }
    
    return mutated;
  }

  // Additional helper methods for NEAT operations
  private getInnovationNumber(inputId: number, outputId: number): number {
    const key = `${inputId}-${outputId}`;
    if (!this.INNOVATION_NUMBER.has(key)) {
      this.INNOVATION_NUMBER.set(key, this.INNOVATION_NUMBER.size);
    }
    return this.INNOVATION_NUMBER.get(key)!;
  }

  private getBestNetwork(): ComposerNetwork {
    return this.networks.reduce((best, current) => 
      current.fitness > best.fitness ? current : best
    );
  }

  private selectParent(): ComposerNetwork {
    // Tournament selection
    const tournamentSize = 3;
    let best = this.networks[Math.floor(Math.random() * this.networks.length)];
    
    for (let i = 1; i < tournamentSize; i++) {
      const candidate = this.networks[Math.floor(Math.random() * this.networks.length)];
      if (candidate.fitness > best.fitness) {
        best = candidate;
      }
    }
    
    return best;
  }

  private cloneNetwork(network: ComposerNetwork): ComposerNetwork {
    return {
      id: `network_${Math.random().toString(36).substr(2, 9)}`,
      nodes: network.nodes.map(n => ({...n})),
      connections: network.connections.map(c => ({...c})),
      fitness: 0,
      species: network.species,
      generation: this.generation + 1
    };
  }

  private speciateNetworks(): void {
    // Simplified speciation based on structural similarity
    this.networks.forEach(network => {
      network.species = Math.floor(network.connections.length / 10);
    });
  }

  private groupNetworksBySpecies(): Record<number, ComposerNetwork[]> {
    const species: Record<number, ComposerNetwork[]> = {};
    
    this.networks.forEach(network => {
      if (!species[network.species]) {
        species[network.species] = [];
      }
      species[network.species].push(network);
    });
    
    return species;
  }

  private addConnectionMutation(network: ComposerNetwork): void {
    // Find two unconnected nodes and connect them
    const availableInputs = network.nodes.filter(n => n.type !== 'output');
    const availableOutputs = network.nodes.filter(n => n.type !== 'input');
    
    if (availableInputs.length === 0 || availableOutputs.length === 0) return;
    
    const inputNode = availableInputs[Math.floor(Math.random() * availableInputs.length)];
    const outputNode = availableOutputs[Math.floor(Math.random() * availableOutputs.length)];
    
    // Check if connection already exists
    const existingConnection = network.connections.find(c => 
      c.inputNode === inputNode.id && c.outputNode === outputNode.id
    );
    
    if (!existingConnection) {
      network.connections.push({
        innovationNumber: this.getInnovationNumber(inputNode.id, outputNode.id),
        inputNode: inputNode.id,
        outputNode: outputNode.id,
        weight: Math.random() * 2 - 1,
        enabled: true
      });
    }
  }

  private addNodeMutation(network: ComposerNetwork): void {
    // Split an existing connection by adding a node
    if (network.connections.length === 0) return;
    
    const connectionToSplit = network.connections[Math.floor(Math.random() * network.connections.length)];
    connectionToSplit.enabled = false;
    
    // Create new hidden node
    const newNodeId = Math.max(...network.nodes.map(n => n.id)) + 1;
    network.nodes.push({
      id: newNodeId,
      type: 'hidden',
      activation: 0,
      bias: 0,
      nodeType: 'hidden'
    });
    
    // Create two new connections
    network.connections.push({
      innovationNumber: this.getInnovationNumber(connectionToSplit.inputNode, newNodeId),
      inputNode: connectionToSplit.inputNode,
      outputNode: newNodeId,
      weight: 1.0, // Connection into new node has weight 1
      enabled: true
    });
    
    network.connections.push({
      innovationNumber: this.getInnovationNumber(newNodeId, connectionToSplit.outputNode),
      inputNode: newNodeId,
      outputNode: connectionToSplit.outputNode,
      weight: connectionToSplit.weight, // Connection out has original weight
      enabled: true
    });
  }
}

// Type definitions for neural composition system
interface ComposerNetwork {
  id: string;
  nodes: NetworkNode[];
  connections: NetworkConnection[];
  fitness: number;
  species: number;
  generation: number;
}

interface NetworkNode {
  id: number;
  type: 'input' | 'output' | 'hidden';
  activation: number;
  bias: number;
  nodeType: string;
}

interface NetworkConnection {
  innovationNumber: number;
  inputNode: number;
  outputNode: number;
  weight: number;
  enabled: boolean;
}

interface TestScenario {
  inputs: Record<string, number>;
  expected: Record<string, number>;
}

interface CompositionResult {
  notes: CompositionNote[];
  fitness: number;
  generation: number;
  networkComplexity: number;
}

interface CompositionNote {
  time: number;
  pitch: number;
  velocity: number;
  duration: number;
  harmonic_weight: number;
  layer: string;
}