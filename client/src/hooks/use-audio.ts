import { useRef, useState, useCallback, useEffect } from 'react';

interface AudioSettings {
  bass: number;
  pace: number;
  reverb: number;
  distortion: number;
  fadeIn: number;
  fadeOut: number;
  instruments: {
    drums: boolean;
    bass: boolean;
    synths: boolean;
    pads: boolean;
    arps: boolean;
  };
  mood: string;
}

interface UseAudioReturn {
  audioContext: AudioContext | null;
  audioBuffer: AudioBuffer | null;
  isPlaying: boolean;
  isLoading: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  bassGain: number;
  reverbGain: number;
  distortionAmount: number;
  play: () => Promise<void>;
  pause: () => void;
  stop: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  adjustBass: (level: number) => void;
  adjustReverb: (level: number) => void;
  adjustDistortion: (level: number) => void;
  loadAudioFromUrl: (url: string) => Promise<void>;
  applyRealTimeSettings: (settings: Partial<AudioSettings>) => void;
}

export function useAudio(): UseAudioReturn {
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const bassNodeRef = useRef<BiquadFilterNode | null>(null);
  const reverbNodeRef = useRef<ConvolverNode | null>(null);
  const distortionNodeRef = useRef<WaveShaperNode | null>(null);
  
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(1);
  const [bassGain, setBassGain] = useState(0);
  const [reverbGain, setReverbGain] = useState(0.3);
  const [distortionAmount, setDistortionAmount] = useState(0);

  // Initialize audio context and effects chain
  const initializeAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Create effects chain
      gainNodeRef.current = audioContextRef.current.createGain();
      bassNodeRef.current = audioContextRef.current.createBiquadFilter();
      reverbNodeRef.current = audioContextRef.current.createConvolver();
      distortionNodeRef.current = audioContextRef.current.createWaveShaper();
      
      // Configure bass filter
      bassNodeRef.current.type = 'lowshelf';
      bassNodeRef.current.frequency.value = 100;
      bassNodeRef.current.gain.value = bassGain;
      
      // Configure distortion
      const makeDistortionCurve = (amount: number) => {
        const samples = 44100;
        const curve = new Float32Array(samples);
        for (let i = 0; i < samples; i++) {
          const x = (i * 2) / samples - 1;
          curve[i] = ((3 + amount) * x * 20 * Math.PI / 180) / (Math.PI + amount * Math.abs(x));
        }
        return curve;
      };
      
      distortionNodeRef.current.curve = makeDistortionCurve(distortionAmount);
      distortionNodeRef.current.oversample = '4x';
      
      // Connect effects chain
      gainNodeRef.current
        .connect(bassNodeRef.current)
        .connect(distortionNodeRef.current)
        .connect(audioContextRef.current.destination);
    }
    return audioContextRef.current;
  }, [bassGain, distortionAmount]);

  // Load audio from URL
  const loadAudioFromUrl = useCallback(async (url: string) => {
    setIsLoading(true);
    try {
      const context = initializeAudioContext();
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      const buffer = await context.decodeAudioData(arrayBuffer);
      
      setAudioBuffer(buffer);
      setDuration(buffer.duration);
      setCurrentTime(0);
    } catch (error) {
      console.error('Error loading audio:', error);
    } finally {
      setIsLoading(false);
    }
  }, [initializeAudioContext]);

  // Play audio
  const play = useCallback(async () => {
    if (!audioBuffer || !audioContextRef.current || !gainNodeRef.current) return;
    
    // Resume context if suspended
    if (audioContextRef.current.state === 'suspended') {
      await audioContextRef.current.resume();
    }
    
    // Stop existing source
    if (sourceNodeRef.current) {
      sourceNodeRef.current.stop();
    }
    
    // Create new source
    sourceNodeRef.current = audioContextRef.current.createBufferSource();
    sourceNodeRef.current.buffer = audioBuffer;
    sourceNodeRef.current.connect(gainNodeRef.current);
    
    // Set up ended handler
    sourceNodeRef.current.onended = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };
    
    sourceNodeRef.current.start(0, currentTime);
    setIsPlaying(true);
    
    // Start time tracking
    const startTime = audioContextRef.current.currentTime - currentTime;
    const updateTime = () => {
      if (audioContextRef.current && isPlaying) {
        const elapsed = audioContextRef.current.currentTime - startTime;
        setCurrentTime(Math.min(elapsed, duration));
        if (elapsed < duration) {
          requestAnimationFrame(updateTime);
        }
      }
    };
    requestAnimationFrame(updateTime);
  }, [audioBuffer, currentTime, duration, isPlaying]);

  // Pause audio
  const pause = useCallback(() => {
    if (sourceNodeRef.current) {
      sourceNodeRef.current.stop();
      sourceNodeRef.current = null;
    }
    setIsPlaying(false);
  }, []);

  // Stop audio
  const stop = useCallback(() => {
    pause();
    setCurrentTime(0);
  }, [pause]);

  // Seek to time
  const seek = useCallback((time: number) => {
    const wasPlaying = isPlaying;
    if (wasPlaying) {
      pause();
    }
    setCurrentTime(Math.max(0, Math.min(time, duration)));
    if (wasPlaying) {
      play();
    }
  }, [isPlaying, duration, pause, play]);

  // Set volume
  const setVolume = useCallback((newVolume: number) => {
    setVolumeState(newVolume);
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = newVolume;
    }
  }, []);

  // Adjust bass
  const adjustBass = useCallback((level: number) => {
    setBassGain(level);
    if (bassNodeRef.current) {
      bassNodeRef.current.gain.value = level;
    }
  }, []);

  // Adjust reverb
  const adjustReverb = useCallback((level: number) => {
    setReverbGain(level);
    // Note: Real reverb would require impulse response loading
  }, []);

  // Adjust distortion
  const adjustDistortion = useCallback((level: number) => {
    setDistortionAmount(level);
    if (distortionNodeRef.current) {
      const makeDistortionCurve = (amount: number) => {
        const samples = 44100;
        const curve = new Float32Array(samples);
        for (let i = 0; i < samples; i++) {
          const x = (i * 2) / samples - 1;
          curve[i] = ((3 + amount) * x * 20 * Math.PI / 180) / (Math.PI + amount * Math.abs(x));
        }
        return curve;
      };
      distortionNodeRef.current.curve = makeDistortionCurve(level);
    }
  }, []);

  // Apply real-time settings
  const applyRealTimeSettings = useCallback((settings: Partial<AudioSettings>) => {
    if (settings.bass !== undefined) {
      adjustBass((settings.bass - 50) / 10); // Convert 0-100 to gain
    }
    if (settings.reverb !== undefined) {
      adjustReverb(settings.reverb / 100);
    }
    if (settings.distortion !== undefined) {
      adjustDistortion(settings.distortion / 20); // Scale distortion
    }
  }, [adjustBass, adjustReverb, adjustDistortion]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (sourceNodeRef.current) {
        sourceNodeRef.current.stop();
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  return {
    audioContext: audioContextRef.current,
    audioBuffer,
    isPlaying,
    isLoading,
    currentTime,
    duration,
    volume,
    bassGain,
    reverbGain,
    distortionAmount,
    play,
    pause,
    stop,
    seek,
    setVolume,
    adjustBass,
    adjustReverb,
    adjustDistortion,
    loadAudioFromUrl,
    applyRealTimeSettings
  };
}