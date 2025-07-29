import { Music, Settings, HelpCircle } from "lucide-react";
import { GenerationInterface } from "@/components/ui/generation-interface";
import { SongStructure } from "@/components/ui/song-structure";
import { RecentTracks } from "@/components/ui/recent-tracks";

export default function Home() {
  return (
    <div className="min-h-screen relative">
      {/* Ambient Background Particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-[hsl(351,78%,62%)] rounded-full opacity-20 animate-float"></div>
        <div className="absolute top-3/4 left-3/4 w-1 h-1 bg-white rounded-full opacity-30 animate-pulse-slow"></div>
        <div className="absolute top-1/2 left-1/6 w-3 h-3 bg-[hsl(208,73%,22%)] rounded-full opacity-15 animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/6 right-1/4 w-1.5 h-1.5 bg-[hsl(351,78%,62%)] rounded-full opacity-25 animate-pulse-slow" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-1/4 left-1/2 w-2 h-2 bg-white rounded-full opacity-20 animate-float" style={{animationDelay: '3s'}}></div>
      </div>

      {/* Header */}
      <header className="relative z-10 px-6 py-8">
        <nav className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[hsl(351,78%,62%)] to-[hsl(208,73%,22%)] rounded-lg flex items-center justify-center">
              <Music className="text-white text-lg" size={20} />
            </div>
            <div>
              <h1 className="text-xl font-semibold">Whitearmor AI</h1>
              <p className="text-[hsl(0,0%,72%)] text-sm">Autonomous Music Generation</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="text-[hsl(0,0%,72%)] hover:text-white transition-colors">
              <Settings size={18} />
            </button>
            <button className="text-[hsl(0,0%,72%)] hover:text-white transition-colors">
              <HelpCircle size={18} />
            </button>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="relative z-10 px-6 pb-12">
        <div className="max-w-4xl mx-auto">
          
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-[hsl(0,0%,72%)] bg-clip-text text-transparent">
              Dreamy. Ambient. Ethereal.
            </h2>
            <p className="text-[hsl(0,0%,72%)] text-lg max-w-2xl mx-auto leading-relaxed">
              Generate complete 2-3 minute songs in the signature Whitearmor style. 
              One click, zero manual input, pure atmospheric bliss.
            </p>
          </div>

          {/* Generation Interface */}
          <GenerationInterface />

          {/* Song Structure Preview */}
          <SongStructure />

          {/* Recent Generations */}
          <RecentTracks />
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-8 border-t border-white/10">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-[hsl(0,0%,72%)] text-sm">
            Powered by MusicGen AI • Built for dreamy, ambient soundscapes in the style of Whitearmor
          </p>
          <div className="flex items-center justify-center space-x-4 mt-4">
            <a href="#" className="text-[hsl(0,0%,72%)] hover:text-white transition-colors text-sm">About</a>
            <span className="text-[hsl(0,0%,72%)]">•</span>
            <a href="#" className="text-[hsl(0,0%,72%)] hover:text-white transition-colors text-sm">API</a>
            <span className="text-[hsl(0,0%,72%)]">•</span>
            <a href="#" className="text-[hsl(0,0%,72%)] hover:text-white transition-colors text-sm">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
