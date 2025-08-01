"use client";

import { BatcompLogo } from "@/components/icons";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";

interface HeaderProps {
  isVoiceEnabled: boolean;
  onVoiceToggle: (enabled: boolean) => void;
  isEmotionApiEnabled: boolean;
  onEmotionApiToggle: (enabled: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({
  isVoiceEnabled,
  onVoiceToggle,
  isEmotionApiEnabled,
  onEmotionApiToggle,
}) => {
  return (
    <header className="flex items-center justify-between p-4 border-b-2 border-primary/20 bg-background/50 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <BatcompLogo className="h-8 w-8 text-primary" />
        <h1 className="text-2xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent font-headline">
          BatcompAI
        </h1>
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
        <div className="flex items-center space-x-2">
          <Switch
            id="emotion-mode"
            checked={isEmotionApiEnabled}
            onCheckedChange={onEmotionApiToggle}
          />
          <Label htmlFor="emotion-mode">Emotional Tone</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="w-4 h-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Adapts response tone. You can select an emotion below.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </header>
  );
};

export default Header;
