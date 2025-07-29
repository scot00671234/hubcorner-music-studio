import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Wand2, Loader2, Edit3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AudioPlayer } from "@/components/ui/audio-player";
import { MusicDashboard } from "@/components/ui/music-dashboard";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Track } from "@shared/schema";

interface MusicSettings {
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
  customPrompt?: string;
}

export function GenerationInterface() {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [settings, setSettings] = useState<MusicSettings>({
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
    mood: "dreamy",
    customPrompt: ""
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const generateMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/generate", settings);
      return response.json() as Promise<Track>;
    },
    onSuccess: (track) => {
      setCurrentTrack(track);
      queryClient.invalidateQueries({ queryKey: ["/api/tracks"] });
      toast({
        title: "Song Generated Successfully",
        description: `"${track.title}" is ready to play`,
      });
    },
    onError: (error) => {
      console.error("Generation failed:", error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate song. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleGenerate = () => {
    if (!settings.customPrompt?.trim()) {
      toast({
        title: "Custom Prompt Required",
        description: "Please enter a custom prompt to describe the music you want to generate.",
        variant: "destructive",
      });
      return;
    }
    generateMutation.mutate();
  };

  return (
    <>
      {/* Music Dashboard */}
      <MusicDashboard settings={settings} onSettingsChange={setSettings} />
      
      <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-8 border border-white/10 mb-8">
        
        {/* Current Track Display */}
        {currentTrack && (
          <div className="mb-8 transition-opacity duration-500">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-medium">{currentTrack.title}</h3>
                <p className="text-[hsl(0,0%,72%)] text-sm font-mono">{currentTrack.prompt}</p>
              </div>
              <div className="text-[hsl(0,0%,72%)] text-sm font-mono">
                <span>{Math.floor(currentTrack.duration / 60)}:{(currentTrack.duration % 60).toString().padStart(2, '0')}</span>
              </div>
            </div>
            
            {/* Audio Player */}
            <AudioPlayer track={currentTrack} />
          </div>
        )}

        {/* Custom Prompt Section */}
        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-3">
            <Edit3 size={16} className="text-[hsl(351,78%,62%)]" />
            <label className="text-sm font-medium text-white">
              Custom Prompt <span className="text-[hsl(351,78%,62%)]">*</span>
            </label>
          </div>
          <Textarea
            value={settings.customPrompt || ""}
            onChange={(e) => setSettings({...settings, customPrompt: e.target.value})}
            placeholder="Example: dreamy ambient trap beat, heavy reverb, slow BPM, ethereal atmosphere, floating soundscape, celestial ambient music..."
            className="bg-black/30 border-white/20 text-white placeholder-[hsl(0,0%,55%)] focus:border-[hsl(351,78%,62%)] focus:ring-[hsl(351,78%,62%)]/20 min-h-[80px] resize-none"
            rows={3}
          />
          <p className="text-xs text-[hsl(0,0%,55%)] mt-2">
            Describe the style, mood, and characteristics you want in your music. Be as creative and detailed as you like!
          </p>
        </div>

        {/* Generation Button */}
        <div className="text-center">
          {generateMutation.isPending ? (
            <div className="py-8">
              <div className="inline-flex items-center space-x-3 text-[hsl(351,78%,62%)]">
                <Loader2 className="animate-spin h-6 w-6" />
                <span className="font-medium">Crafting your ethereal soundscape...</span>
              </div>
              <p className="text-[hsl(0,0%,72%)] text-sm mt-2 font-mono">This may take 30-60 seconds</p>
            </div>
          ) : (
            <>
              <Button
                onClick={handleGenerate}
                disabled={generateMutation.isPending}
                className="group relative px-12 py-6 bg-gradient-to-r from-[hsl(351,78%,62%)] to-[hsl(208,73%,22%)] hover:from-[hsl(351,78%,52%)] hover:to-[hsl(208,73%,32%)] rounded-2xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-[hsl(351,78%,62%)]/25 border-0"
              >
                <span className="flex items-center justify-center space-x-3">
                  <Wand2 size={20} />
                  <span>Generate Song</span>
                </span>
              </Button>
              <p className="text-[hsl(0,0%,72%)] text-sm mt-3 font-mono">
                Write your custom prompt above, then click to generate
              </p>
            </>
          )}
        </div>
      </div>
    </>
  );
}
