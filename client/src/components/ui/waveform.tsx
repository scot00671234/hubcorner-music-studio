import { useEffect, useRef } from "react";

interface WaveformProps {
  analyser: AnalyserNode | null;
  isPlaying: boolean;
}

export function Waveform({ analyser, isPlaying }: WaveformProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    if (!analyser || !canvasRef.current) {
      // Show static waveform when no analyser is available
      drawStaticWaveform();
      return;
    }

    if (isPlaying) {
      animateWaveform();
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [analyser, isPlaying]);

  const drawStaticWaveform = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    // Draw static bars representing audio waveform
    const barCount = 40;
    const barWidth = 2;
    const spacing = (width - barCount * barWidth) / (barCount - 1);

    for (let i = 0; i < barCount; i++) {
      const x = i * (barWidth + spacing);
      const barHeight = Math.random() * height * 0.8 + height * 0.1;
      const y = (height - barHeight) / 2;

      // Randomize colors between coral pink, white, and accent blue
      const colors = [
        "hsl(351, 78%, 62%)", // coral pink
        "hsl(0, 0%, 100%)",   // white  
        "hsl(208, 73%, 22%)"  // accent blue
      ];
      const color = colors[Math.floor(Math.random() * colors.length)];
      const opacity = Math.random() * 0.6 + 0.3;

      ctx.fillStyle = color;
      ctx.globalAlpha = opacity;
      ctx.fillRect(x, y, barWidth, barHeight);
      
      // Add wave animation effect
      const waveY = y + Math.sin(Date.now() * 0.002 + i * 0.5) * 5;
      ctx.fillRect(x, waveY, barWidth, barHeight);
    }

    ctx.globalAlpha = 1;
  };

  const animateWaveform = () => {
    if (!analyser || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      analyser.getByteFrequencyData(dataArray);

      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      const barCount = Math.min(40, bufferLength);
      const barWidth = 2;
      const spacing = (width - barCount * barWidth) / (barCount - 1);

      for (let i = 0; i < barCount; i++) {
        const dataIndex = Math.floor((i / barCount) * bufferLength);
        const barHeight = (dataArray[dataIndex] / 255) * height * 0.8;
        const x = i * (barWidth + spacing);
        const y = (height - barHeight) / 2;

        // Color based on frequency intensity
        let color: string;
        let opacity: number;

        if (dataArray[dataIndex] > 200) {
          color = "hsl(351, 78%, 62%)"; // coral pink for high intensity
          opacity = 0.8;
        } else if (dataArray[dataIndex] > 100) {
          color = "hsl(0, 0%, 100%)"; // white for medium intensity
          opacity = 0.6;
        } else {
          color = "hsl(208, 73%, 22%)"; // accent blue for low intensity
          opacity = 0.4;
        }

        ctx.fillStyle = color;
        ctx.globalAlpha = opacity;
        ctx.fillRect(x, y, barWidth, barHeight);
      }

      ctx.globalAlpha = 1;
      animationRef.current = requestAnimationFrame(draw);
    };

    draw();
  };

  return (
    <div className="flex items-center justify-center h-20">
      <canvas
        ref={canvasRef}
        width={320}
        height={80}
        className="max-w-full h-full"
      />
    </div>
  );
}
