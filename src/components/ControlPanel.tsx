"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";
import type { Mode } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Send, Mic, BrainCircuit, Code, Bug, Loader } from "lucide-react";
import { cn } from "@/lib/utils";

interface ControlPanelProps {
  isLoading: boolean;
  onSendMessage: (message: string, options: { emotion: string }) => void;
  mode: Mode;
  onModeChange: (mode: Mode) => void;
  isListening: boolean;
  onListenToggle: () => void;
  isEmotionApiEnabled: boolean;
  currentEmotion: string;
  onEmotionChange: (emotion: string) => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  isLoading,
  onSendMessage,
  mode,
  onModeChange,
  isListening,
  onListenToggle,
  isEmotionApiEnabled,
  currentEmotion,
  onEmotionChange,
}) => {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${scrollHeight}px`;
    }
  }, [input]);

  const handleSend = () => {
    if (input.trim()) {
      onSendMessage(input, { emotion: currentEmotion });
      setInput("");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Tabs value={mode} onValueChange={(value) => onModeChange(value as Mode)} className="w-auto">
          <TabsList className="holographic-glow">
            <TabsTrigger value="chat"><BrainCircuit className="w-4 h-4 mr-2" />Chat</TabsTrigger>
            <TabsTrigger value="coding"><Code className="w-4 h-4 mr-2" />Coding</TabsTrigger>
            <TabsTrigger value="debug"><Bug className="w-4 h-4 mr-2" />Debug</TabsTrigger>
          </TabsList>
        </Tabs>
        {isEmotionApiEnabled && (
          <Select value={currentEmotion} onValueChange={onEmotionChange}>
            <SelectTrigger className="w-[180px] holographic-glow">
              <SelectValue placeholder="Select Emotion" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="neutral">Neutral</SelectItem>
              <SelectItem value="frustrated">Frustrated</SelectItem>
              <SelectItem value="happy">Happy</SelectItem>
            </SelectContent>
          </Select>
        )}
      </div>

      <div className="relative flex items-end gap-2">
        <Textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`Message BatcompAI in ${mode} mode...`}
          rows={1}
          className="flex-1 resize-none pr-24 max-h-48 bg-card"
          disabled={isLoading}
        />
        <div className="absolute right-2 bottom-2 flex gap-1">
          <Button
            size="icon"
            variant="ghost"
            onClick={onListenToggle}
            className={cn(isListening ? "bg-red-500/50 text-white" : "")}
          >
            <Mic className="h-5 w-5" />
          </Button>
          <Button size="icon" onClick={handleSend} disabled={isLoading || !input.trim()}>
            {isLoading ? <Loader className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;
