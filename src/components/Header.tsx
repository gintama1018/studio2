"use client";

import { BatcompLogo } from "@/components/icons";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface HeaderProps {
  isVoiceEnabled: boolean;
  onVoiceToggle: (enabled: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({
  isVoiceEnabled,
  onVoiceToggle,
}) => {
  return (
    <header className="flex items-center justify-between p-4 border-b-2 border-primary/20 bg-background/50 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <BatcompLogo className="h-8 w-8 text-primary" />
        <div className="flex flex-col">
            <h1 className="text-2xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent font-headline">
            Niva
            </h1>
            <span className="text-xs text-muted-foreground">v10.8.007</span>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="flex items-center space-x-2">
          <Switch
            id="voice-mode"
            checked={isVoiceEnabled}
            onCheckedChange={onVoiceToggle}
          />
          <Label htmlFor="voice-mode">Voice Narration</Label>
        </div>
      </div>
    </header>
  );
};

export default Header;
