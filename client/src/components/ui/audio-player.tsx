import { useState, useRef, useEffect } from "react";
import { Play, Pause, Download, Share } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Waveform } from "@/components/ui/waveform";
import { useToast } from "@/hooks/use-toast";
import type { Track } from "@shared/schema";

interface AudioPlayerProps {
  track: Track;
}

export function AudioPlayer({ track }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [track]);

  const togglePlayPause = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    try {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        // Ensure audio is loaded
        if (audio.readyState < 2) {
          await new Promise((resolve) => {
            audio.addEventListener('canplay', resolve, { once: true });
            audio.load();
          });
        }
        
        await audio.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error("Audio playback error:", error);
      toast({
        title: "Playback Error",
        description: "Failed to play audio. Please try downloading the file instead.",
        variant: "destructive",
      });
    }
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = track.filePath;
    link.download = `${track.title}.wav`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Download Started",
      description: `Downloading "${track.title}"`,
    });
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: track.title,
          text: `Check out this AI-generated Whitearmor-style track: ${track.title}`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link Copied",
          description: "Track link copied to clipboard",
        });
      }
    } catch (error) {
      console.error("Share failed:", error);
      toast({
        title: "Share Failed",
        description: "Could not share track",
        variant: "destructive",
      });
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    const progressBar = progressRef.current;
    if (!audio || !progressBar) return;

    const rect = progressBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    const newTime = percentage * track.duration;
    
    audio.currentTime = Math.max(0, Math.min(newTime, track.duration));
    setCurrentTime(audio.currentTime);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
    
    const handleMouseMove = (e: MouseEvent) => {
      const progressBar = progressRef.current;
      if (!progressBar) return;

      const rect = progressBar.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = Math.max(0, Math.min(1, x / rect.width));
      const newTime = percentage * track.duration;
      
      setCurrentTime(newTime);
      if (audioRef.current) {
        audioRef.current.currentTime = newTime;
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercentage = (currentTime / track.duration) * 100;

  return (
    <>
      <audio ref={audioRef} src={track.filePath} preload="metadata" />
      
      {/* Waveform Visualization */}
      <div className="bg-black/30 rounded-lg p-4 mb-4">
        <Waveform analyser={analyserRef.current} isPlaying={isPlaying} />
      </div>

      {/* Audio Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            onClick={togglePlayPause}
            className="w-12 h-12 bg-[hsl(351,78%,62%)] hover:bg-[hsl(351,78%,52%)] rounded-full p-0 border-0"
          >
            {isPlaying ? (
              <Pause className="text-white" size={20} />
            ) : (
              <Play className="text-white ml-1" size={20} />
            )}
          </Button>
          
          <div className="flex items-center space-x-2 text-sm font-mono text-[hsl(0,0%,72%)]">
            <span>{formatTime(currentTime)}</span>
            <div 
              ref={progressRef}
              className="w-48 h-1 bg-white/20 rounded-full relative cursor-pointer"
              onClick={handleProgressClick}
              onMouseDown={handleMouseDown}
            >
              <div 
                className={`absolute left-0 top-0 h-full bg-[hsl(351,78%,62%)] rounded-full transition-all ${isDragging ? 'duration-75' : 'duration-150'}`}
                style={{ width: `${progressPercentage}%` }}
              />
              <div 
                className={`absolute top-1/2 w-3 h-3 bg-[hsl(351,78%,62%)] rounded-full transform -translate-y-1/2 -translate-x-1/2 transition-opacity ${isDragging ? 'opacity-100 scale-110' : 'opacity-0 hover:opacity-100'} cursor-grab active:cursor-grabbing`}
                style={{ left: `${progressPercentage}%` }}
              />
            </div>
            <span>{formatTime(track.duration)}</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDownload}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <Download className="text-[hsl(0,0%,72%)] hover:text-white" size={16} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleShare}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <Share className="text-[hsl(0,0%,72%)] hover:text-white" size={16} />
          </Button>
        </div>
      </div>
    </>
  );
}
