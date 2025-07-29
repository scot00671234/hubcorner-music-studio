import { Layers } from "lucide-react";

const defaultStructure = {
  intro: { start: 0, end: 20 },
  verse: { start: 20, end: 60 },
  hook: { start: 60, end: 100 },
  bridge: { start: 100, end: 130 },
  outro: { start: 130, end: 154 }
};

interface StructureSegmentProps {
  name: string;
  start: number;
  end: number;
  description: string;
  colorClass: string;
}

function StructureSegment({ name, start, end, description, colorClass }: StructureSegmentProps) {
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`${colorClass} rounded-lg p-3 text-center border transition-all duration-300 hover:scale-105`}>
      <div className="text-xs font-mono text-[hsl(0,0%,72%)] mb-1">
        {formatTime(start)} - {formatTime(end)}
      </div>
      <div className="font-medium text-sm capitalize">{name}</div>
      <div className="text-xs text-[hsl(0,0%,72%)] mt-1">{description}</div>
    </div>
  );
}

export function SongStructure() {
  const segments = [
    {
      name: "intro",
      ...defaultStructure.intro,
      description: "Ambient",
      colorClass: "bg-[hsl(208,73%,22%)]/30 border-[hsl(208,73%,22%)]/50"
    },
    {
      name: "verse", 
      ...defaultStructure.verse,
      description: "Soft Beat",
      colorClass: "bg-[hsl(351,78%,62%)]/20 border-[hsl(351,78%,62%)]/40"
    },
    {
      name: "hook",
      ...defaultStructure.hook, 
      description: "Heavy Reverb",
      colorClass: "bg-white/20 border-white/30"
    },
    {
      name: "bridge",
      ...defaultStructure.bridge,
      description: "Filtered", 
      colorClass: "bg-[hsl(208,73%,22%)]/20 border-[hsl(208,73%,22%)]/40"
    },
    {
      name: "outro",
      ...defaultStructure.outro,
      description: "Fade",
      colorClass: "bg-[hsl(351,78%,62%)]/30 border-[hsl(351,78%,62%)]/50"
    }
  ];

  return (
    <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-6 border border-white/10 mb-8">
      <h3 className="text-lg font-medium mb-4 flex items-center">
        <Layers className="text-[hsl(351,78%,62%)] mr-3" size={20} />
        Song Structure
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        {segments.map((segment) => (
          <StructureSegment
            key={segment.name}
            name={segment.name}
            start={segment.start}
            end={segment.end}
            description={segment.description}
            colorClass={segment.colorClass}
          />
        ))}
      </div>
    </div>
  );
}
