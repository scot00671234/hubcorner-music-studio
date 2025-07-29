import { useQuery } from "@tanstack/react-query";
import { History, Music, Play, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import type { Track } from "@shared/schema";

export function RecentTracks() {
  const { toast } = useToast();
  
  const { data: tracks = [], isLoading } = useQuery<Track[]>({
    queryKey: ["/api/tracks"],
    queryFn: async () => {
      const response = await fetch("/api/tracks?limit=5");
      if (!response.ok) {
        throw new Error("Failed to fetch tracks");
      }
      return response.json();
    },
  });

  const handlePlay = (track: Track) => {
    // This would ideally trigger the main audio player to play this track
    toast({
      title: "Playing Track",
      description: `Now playing "${track.title}"`,
    });
  };

  const handleDownload = (track: Track) => {
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

  const formatTime = (duration: number) => {
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getGradientClass = (index: number) => {
    const gradients = [
      "from-[hsl(351,78%,62%)]/50 to-[hsl(208,73%,22%)]/50",
      "from-[hsl(208,73%,22%)]/50 to-white/30",
      "from-white/30 to-[hsl(351,78%,62%)]/50",
      "from-[hsl(351,78%,62%)]/40 to-[hsl(208,73%,22%)]/40",
      "from-[hsl(208,73%,22%)]/40 to-white/20"
    ];
    return gradients[index % gradients.length];
  };

  if (isLoading) {
    return (
      <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
        <h3 className="text-lg font-medium mb-4 flex items-center">
          <History className="text-[hsl(351,78%,62%)] mr-3" size={20} />
          Recent Generations
        </h3>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="flex items-center justify-between p-4 bg-black/30 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-white/20 rounded-lg"></div>
                  <div>
                    <div className="h-4 bg-white/20 rounded w-32 mb-2"></div>
                    <div className="h-3 bg-white/10 rounded w-24"></div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="h-3 bg-white/10 rounded w-8"></div>
                  <div className="w-6 h-6 bg-white/20 rounded"></div>
                  <div className="w-6 h-6 bg-white/20 rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
      <h3 className="text-lg font-medium mb-4 flex items-center">
        <History className="text-[hsl(351,78%,62%)] mr-3" size={20} />
        Recent Generations
      </h3>
      
      {tracks.length === 0 ? (
        <div className="text-center py-8">
          <Music className="mx-auto text-[hsl(0,0%,72%)] mb-4" size={48} />
          <p className="text-[hsl(0,0%,72%)] font-medium">No tracks generated yet</p>
          <p className="text-[hsl(0,0%,72%)] text-sm mt-1">Click "Generate Song" to create your first track</p>
        </div>
      ) : (
        <div className="space-y-3">
          {tracks.map((track, index) => (
            <div
              key={track.id}
              className="flex items-center justify-between p-4 bg-black/30 rounded-lg hover:bg-black/40 transition-colors cursor-pointer"
            >
              <div className="flex items-center space-x-4">
                <div className={`w-10 h-10 bg-gradient-to-br ${getGradientClass(index)} rounded-lg flex items-center justify-center`}>
                  <Music className="text-white" size={16} />
                </div>
                <div>
                  <div className="font-medium text-sm">{track.title}</div>
                  <div className="text-[hsl(0,0%,72%)] text-xs font-mono truncate max-w-[200px]">
                    {track.prompt}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-[hsl(0,0%,72%)] text-xs font-mono">
                  {formatTime(track.duration)}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handlePlay(track)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <Play className="text-[hsl(0,0%,72%)] hover:text-white" size={14} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDownload(track)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <Download className="text-[hsl(0,0%,72%)] hover:text-white" size={14} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
