import { useState } from "react";
import { Sliders, Volume2, Zap, Clock, Waves, Music2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
}

interface MusicDashboardProps {
  settings: MusicSettings;
  onSettingsChange: (settings: MusicSettings) => void;
}

export function MusicDashboard({ settings, onSettingsChange }: MusicDashboardProps) {
  const updateSetting = <K extends keyof MusicSettings>(key: K, value: MusicSettings[K]) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  const updateInstrument = (instrument: keyof MusicSettings['instruments'], enabled: boolean) => {
    updateSetting('instruments', { ...settings.instruments, [instrument]: enabled });
  };

  const resetToDefaults = () => {
    onSettingsChange({
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
      mood: "dreamy"
    });
  };

  return (
    <div className="bg-black/20 backdrop-blur-sm rounded-2xl border border-white/10 mb-8">
      <div className="flex items-center justify-between p-6 border-b border-white/10">
        <h3 className="text-lg font-medium flex items-center">
          <Sliders className="text-[hsl(351,78%,62%)] mr-3" size={20} />
          Music Dashboard
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={resetToDefaults}
          className="text-[hsl(0,0%,72%)] hover:text-white transition-colors"
        >
          <RotateCcw size={16} className="mr-2" />
          Reset
        </Button>
      </div>

      <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Sound Controls */}
        <Card className="bg-black/30 border-white/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center">
              <Volume2 size={16} className="mr-2 text-[hsl(351,78%,62%)]" />
              Sound Controls
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            
            {/* Bass */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm text-[hsl(0,0%,72%)]">Bass</label>
                <span className="text-xs font-mono text-white">{settings.bass}%</span>
              </div>
              <Slider
                value={[settings.bass]}
                onValueChange={([value]) => updateSetting('bass', value)}
                max={100}
                step={1}
                className="w-full"
              />
            </div>

            {/* Pace (BPM) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm text-[hsl(0,0%,72%)]">Pace</label>
                <span className="text-xs font-mono text-white">{settings.pace} BPM</span>
              </div>
              <Slider
                value={[settings.pace]}
                onValueChange={([value]) => updateSetting('pace', value)}
                min={60}
                max={180}
                step={5}
                className="w-full"
              />
            </div>

            {/* Reverb */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm text-[hsl(0,0%,72%)]">Reverb</label>
                <span className="text-xs font-mono text-white">{settings.reverb}%</span>
              </div>
              <Slider
                value={[settings.reverb]}
                onValueChange={([value]) => updateSetting('reverb', value)}
                max={100}
                step={1}
                className="w-full"
              />
            </div>

            {/* Distortion */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm text-[hsl(0,0%,72%)]">Distortion</label>
                <span className="text-xs font-mono text-white">{settings.distortion}%</span>
              </div>
              <Slider
                value={[settings.distortion]}
                onValueChange={([value]) => updateSetting('distortion', value)}
                max={100}
                step={1}
                className="w-full"
              />
            </div>
          </CardContent>
        </Card>

        {/* Timing Controls */}
        <Card className="bg-black/30 border-white/10">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center">
              <Clock size={16} className="mr-2 text-[hsl(351,78%,62%)]" />
              Timing & Effects
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            
            {/* Fade In */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm text-[hsl(0,0%,72%)]">Fade In</label>
                <span className="text-xs font-mono text-white">{settings.fadeIn}s</span>
              </div>
              <Slider
                value={[settings.fadeIn]}
                onValueChange={([value]) => updateSetting('fadeIn', value)}
                max={10}
                step={0.5}
                className="w-full"
              />
            </div>

            {/* Fade Out */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm text-[hsl(0,0%,72%)]">Fade Out</label>
                <span className="text-xs font-mono text-white">{settings.fadeOut}s</span>
              </div>
              <Slider
                value={[settings.fadeOut]}
                onValueChange={([value]) => updateSetting('fadeOut', value)}
                max={10}
                step={0.5}
                className="w-full"
              />
            </div>

            {/* Mood Selection */}
            <div className="space-y-2">
              <label className="text-sm text-[hsl(0,0%,72%)]">Mood</label>
              <Select value={settings.mood} onValueChange={(value) => updateSetting('mood', value)}>
                <SelectTrigger className="w-full bg-black/50 border-white/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dreamy">🌙 Dreamy</SelectItem>
                  <SelectItem value="dark">🌑 Dark</SelectItem>
                  <SelectItem value="uplifting">✨ Uplifting</SelectItem>
                  <SelectItem value="melancholic">💙 Melancholic</SelectItem>
                  <SelectItem value="ethereal">👻 Ethereal</SelectItem>
                  <SelectItem value="nostalgic">📻 Nostalgic</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Instruments */}
        <Card className="bg-black/30 border-white/10 lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center">
              <Music2 size={16} className="mr-2 text-[hsl(351,78%,62%)]" />
              Instruments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              
              {/* Drums */}
              <div className="flex items-center justify-between p-3 bg-black/30 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Zap size={14} className="text-[hsl(351,78%,62%)]" />
                  <span className="text-sm">Drums</span>
                </div>
                <Switch
                  checked={settings.instruments.drums}
                  onCheckedChange={(checked) => updateInstrument('drums', checked)}
                />
              </div>

              {/* Bass */}
              <div className="flex items-center justify-between p-3 bg-black/30 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Waves size={14} className="text-[hsl(351,78%,62%)]" />
                  <span className="text-sm">Bass</span>
                </div>
                <Switch
                  checked={settings.instruments.bass}
                  onCheckedChange={(checked) => updateInstrument('bass', checked)}
                />
              </div>

              {/* Synths */}
              <div className="flex items-center justify-between p-3 bg-black/30 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Volume2 size={14} className="text-[hsl(351,78%,62%)]" />
                  <span className="text-sm">Synths</span>
                </div>
                <Switch
                  checked={settings.instruments.synths}
                  onCheckedChange={(checked) => updateInstrument('synths', checked)}
                />
              </div>

              {/* Pads */}
              <div className="flex items-center justify-between p-3 bg-black/30 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Waves size={14} className="text-[hsl(208,73%,22%)]" />
                  <span className="text-sm">Pads</span>
                </div>
                <Switch
                  checked={settings.instruments.pads}
                  onCheckedChange={(checked) => updateInstrument('pads', checked)}
                />
              </div>

              {/* Arps */}
              <div className="flex items-center justify-between p-3 bg-black/30 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Music2 size={14} className="text-[hsl(208,73%,22%)]" />
                  <span className="text-sm">Arps</span>
                </div>
                <Switch
                  checked={settings.instruments.arps}
                  onCheckedChange={(checked) => updateInstrument('arps', checked)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}