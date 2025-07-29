import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAudio } from "@/hooks/use-audio";
import { useToast } from "@/hooks/use-toast";
import type { Track } from "@shared/schema";

interface RealTimeEditorProps {
  track: Track | null;
  onSettingsChange?: (settings: any) => void;
}

export function RealTimeEditor({ track, onSettingsChange }: RealTimeEditorProps) {
  const { toast } = useToast();
  const { 
    isPlaying, 
    currentTime, 
    duration, 
    play, 
    pause, 
    loadAudioFromUrl, 
    applyRealTimeSettings,
    adjustBass,
    adjustReverb,
    adjustDistortion
  } = useAudio();

  // Real-time audio settings
  const [settings, setSettings] = useState({
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
    mood: 'dreamy'
  });

  // Load track when it changes
  useEffect(() => {
    if (track?.filePath) {
      loadAudioFromUrl(track.filePath);
    }
  }, [track, loadAudioFromUrl]);

  // Apply settings in real-time
  const handleSettingChange = (key: string, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    
    // Apply real-time audio effects
    applyRealTimeSettings(newSettings);
    
    // Notify parent component
    if (onSettingsChange) {
      onSettingsChange(newSettings);
    }
  };

  const handleInstrumentToggle = (instrument: string, enabled: boolean) => {
    const newInstruments = { ...settings.instruments, [instrument]: enabled };
    const newSettings = { ...settings, instruments: newInstruments };
    setSettings(newSettings);
    applyRealTimeSettings(newSettings);
    
    if (onSettingsChange) {
      onSettingsChange(newSettings);
    }
  };

  const resetSettings = () => {
    const defaultSettings = {
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
      mood: 'dreamy'
    };
    setSettings(defaultSettings);
    applyRealTimeSettings(defaultSettings);
    
    toast({
      title: "Settings Reset",
      description: "All audio settings restored to defaults"
    });
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!track) {
    return (
      <Card className="bg-black/20 backdrop-blur-sm border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Play className="mr-2" size={20} />
            Real-Time Editor
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-[hsl(0,0%,72%)] text-center py-8">
            Generate a track first to enable real-time editing
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-black/20 backdrop-blur-sm border-white/10">
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          <div className="flex items-center">
            <Play className="mr-2 text-[hsl(351,78%,62%)]" size={20} />
            Real-Time Editor
          </div>
          <div className="text-sm font-mono text-[hsl(0,0%,72%)]">
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Playback Controls */}
        <div className="flex items-center justify-center space-x-4">
          <Button
            onClick={isPlaying ? pause : play}
            className="w-12 h-12 bg-[hsl(351,78%,62%)] hover:bg-[hsl(351,78%,52%)] rounded-full p-0"
          >
            {isPlaying ? <Pause size={20} /> : <Play className="ml-1" size={20} />}
          </Button>
          
          <Button
            onClick={resetSettings}
            variant="outline"
            size="sm"
            className="border-white/20 text-white hover:bg-white/10"
          >
            <RotateCcw size={16} className="mr-2" />
            Reset
          </Button>
        </div>

        {/* Real-Time Audio Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Bass Control */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-white">Bass Level</label>
              <span className="text-xs text-[hsl(0,0%,72%)] font-mono">{settings.bass}%</span>
            </div>
            <Slider
              value={[settings.bass]}
              onValueChange={(value) => handleSettingChange('bass', value[0])}
              max={100}
              step={1}
              className="accent-[hsl(351,78%,62%)]"
            />
          </div>

          {/* Reverb Control */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-white">Reverb</label>
              <span className="text-xs text-[hsl(0,0%,72%)] font-mono">{settings.reverb}%</span>
            </div>
            <Slider
              value={[settings.reverb]}
              onValueChange={(value) => handleSettingChange('reverb', value[0])}
              max={100}
              step={1}
              className="accent-[hsl(351,78%,62%)]"
            />
          </div>

          {/* Distortion Control */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-white">Distortion</label>
              <span className="text-xs text-[hsl(0,0%,72%)] font-mono">{settings.distortion}%</span>
            </div>
            <Slider
              value={[settings.distortion]}
              onValueChange={(value) => handleSettingChange('distortion', value[0])}
              max={100}
              step={1}
              className="accent-[hsl(351,78%,62%)]"
            />
          </div>

          {/* Pace Control */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-white">Pace (BPM)</label>
              <span className="text-xs text-[hsl(0,0%,72%)] font-mono">{settings.pace}</span>
            </div>
            <Slider
              value={[settings.pace]}
              onValueChange={(value) => handleSettingChange('pace', value[0])}
              min={60}
              max={180}
              step={1}
              className="accent-[hsl(351,78%,62%)]"
            />
          </div>
        </div>

        {/* Instrument Toggles */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-white">Live Instrument Mix</h4>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {Object.entries(settings.instruments).map(([instrument, enabled]) => (
              <div key={instrument} className="flex items-center space-x-2">
                <Switch
                  checked={enabled}
                  onCheckedChange={(checked) => handleInstrumentToggle(instrument, checked)}
                  className="data-[state=checked]:bg-[hsl(351,78%,62%)]"
                />
                <label className="text-xs text-white capitalize">{instrument}</label>
              </div>
            ))}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="w-full h-2 bg-white/20 rounded-full relative">
            <div 
              className="absolute left-0 top-0 h-full bg-[hsl(351,78%,62%)] rounded-full transition-all duration-300"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            />
          </div>
          <p className="text-xs text-[hsl(0,0%,72%)] text-center">
            Adjust settings while playing to hear changes in real-time
          </p>
        </div>
      </CardContent>
    </Card>
  );
}