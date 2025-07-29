import { useEffect, useState } from "react";

interface UseAudioReturn {
  analyser: AnalyserNode | null;
  audioContext: AudioContext | null;
}

export function useAudio(audioElement: HTMLAudioElement | null): UseAudioReturn {
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);

  useEffect(() => {
    if (!audioElement) {
      return;
    }

    let context: AudioContext | null = null;
    let analyserNode: AnalyserNode | null = null;

    const setupAudioContext = () => {
      try {
        context = new (window.AudioContext || (window as any).webkitAudioContext)();
        analyserNode = context.createAnalyser();
        
        const source = context.createMediaElementSource(audioElement);
        source.connect(analyserNode);
        analyserNode.connect(context.destination);
        
        analyserNode.fftSize = 256;
        
        setAudioContext(context);
        setAnalyser(analyserNode);
      } catch (error) {
        console.error("Failed to setup audio context:", error);
      }
    };

    // Setup audio context on first user interaction
    const handleUserInteraction = () => {
      if (!context) {
        setupAudioContext();
      }
      document.removeEventListener("click", handleUserInteraction);
    };

    document.addEventListener("click", handleUserInteraction);

    return () => {
      document.removeEventListener("click", handleUserInteraction);
      if (context && context.state !== "closed") {
        context.close();
      }
    };
  }, [audioElement]);

  return { analyser, audioContext };
}
