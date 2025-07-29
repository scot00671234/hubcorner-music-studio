import { useState } from "react";
import { Layers, Edit, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface StructureSegment {
  name: string;
  start: number;
  end: number;
  description: string;
  colorClass: string;
}

interface SongStructureProps {
  structure?: {
    intro: { start: number; end: number };
    verse: { start: number; end: number };
    hook: { start: number; end: number };
    bridge: { start: number; end: number };
    outro: { start: number; end: number };
  };
  onStructureChange?: (structure: any) => void;
  isEditable?: boolean;
}

interface EditableSegmentProps extends StructureSegment {
  onUpdate: (name: string, start: number, end: number, description: string) => void;
  isEditable: boolean;
}

function EditableSegment({ name, start, end, description, colorClass, onUpdate, isEditable }: EditableSegmentProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValues, setEditValues] = useState({ start, end, description });

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const parseTimeInput = (timeStr: string): number => {
    const [minutes, seconds] = timeStr.split(':').map(Number);
    return (minutes || 0) * 60 + (seconds || 0);
  };

  const handleSave = () => {
    onUpdate(name, editValues.start, editValues.end, editValues.description);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValues({ start, end, description });
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className={`${colorClass} rounded-lg p-3 border transition-all duration-300`}>
        <div className="space-y-2">
          <div className="flex space-x-1">
            <Input
              type="text"
              value={formatTime(editValues.start)}
              onChange={(e) => setEditValues(prev => ({ ...prev, start: parseTimeInput(e.target.value) }))}
              className="text-xs h-6 bg-black/50 border-white/20"
              placeholder="0:00"
            />
            <span className="text-xs self-center">-</span>
            <Input
              type="text"
              value={formatTime(editValues.end)}
              onChange={(e) => setEditValues(prev => ({ ...prev, end: parseTimeInput(e.target.value) }))}
              className="text-xs h-6 bg-black/50 border-white/20"
              placeholder="0:00"
            />
          </div>
          <div className="font-medium text-sm capitalize">{name}</div>
          <Input
            type="text"
            value={editValues.description}
            onChange={(e) => setEditValues(prev => ({ ...prev, description: e.target.value }))}
            className="text-xs h-6 bg-black/50 border-white/20"
            placeholder="Description"
          />
          <div className="flex space-x-1 justify-center">
            <Button size="sm" variant="ghost" onClick={handleSave} className="h-6 w-6 p-0">
              <Check size={12} />
            </Button>
            <Button size="sm" variant="ghost" onClick={handleCancel} className="h-6 w-6 p-0">
              <X size={12} />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${colorClass} rounded-lg p-3 text-center border transition-all duration-300 hover:scale-105 relative group`}>
      <div className="text-xs font-mono text-[hsl(0,0%,72%)] mb-1">
        {formatTime(start)} - {formatTime(end)}
      </div>
      <div className="font-medium text-sm capitalize">{name}</div>
      <div className="text-xs text-[hsl(0,0%,72%)] mt-1">{description}</div>
      
      {isEditable && (
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setIsEditing(true)}
          className="absolute top-1 right-1 h-5 w-5 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Edit size={10} />
        </Button>
      )}
    </div>
  );
}

export function SongStructure({ structure, onStructureChange, isEditable = false }: SongStructureProps) {
  const defaultStructure = {
    intro: { start: 0, end: 20 },
    verse: { start: 20, end: 60 },
    hook: { start: 60, end: 100 },
    bridge: { start: 100, end: 130 },
    outro: { start: 130, end: 154 }
  };

  const currentStructure = structure || defaultStructure;

  const segments = [
    {
      name: "intro",
      ...currentStructure.intro,
      description: "Ambient",
      colorClass: "bg-[hsl(208,73%,22%)]/30 border-[hsl(208,73%,22%)]/50"
    },
    {
      name: "verse", 
      ...currentStructure.verse,
      description: "Soft Beat",
      colorClass: "bg-[hsl(351,78%,62%)]/20 border-[hsl(351,78%,62%)]/40"
    },
    {
      name: "hook",
      ...currentStructure.hook, 
      description: "Heavy Reverb",
      colorClass: "bg-white/20 border-white/30"
    },
    {
      name: "bridge",
      ...currentStructure.bridge,
      description: "Filtered", 
      colorClass: "bg-[hsl(208,73%,22%)]/20 border-[hsl(208,73%,22%)]/40"
    },
    {
      name: "outro",
      ...currentStructure.outro,
      description: "Fade",
      colorClass: "bg-[hsl(351,78%,62%)]/30 border-[hsl(351,78%,62%)]/50"
    }
  ];

  const handleSegmentUpdate = (name: string, start: number, end: number, description: string) => {
    if (onStructureChange) {
      const newStructure = {
        ...currentStructure,
        [name]: { start, end }
      };
      onStructureChange(newStructure);
    }
  };

  return (
    <div className="bg-black/20 backdrop-blur-sm rounded-2xl p-6 border border-white/10 mb-8">
      <h3 className="text-lg font-medium mb-4 flex items-center">
        <Layers className="text-[hsl(351,78%,62%)] mr-3" size={20} />
        Song Structure
        {isEditable && <span className="text-xs text-[hsl(0,0%,72%)] ml-auto">Click to edit timing</span>}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        {segments.map((segment) => (
          <EditableSegment
            key={segment.name}
            name={segment.name}
            start={segment.start}
            end={segment.end}
            description={segment.description}
            colorClass={segment.colorClass}
            onUpdate={handleSegmentUpdate}
            isEditable={isEditable}
          />
        ))}
      </div>
    </div>
  );
}
