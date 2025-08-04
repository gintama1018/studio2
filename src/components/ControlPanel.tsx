"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Mic, Loader } from "lucide-react";
import { cn } from "@/lib/utils";

interface ControlPanelProps {
  isLoading: boolean;
  onSendMessage: (message: string) => void;
  isListening: boolean;
  onListenToggle: () => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  isLoading,
  onSendMessage,
  isListening,
  onListenToggle,
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
      onSendMessage(input);
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
      <div className="relative flex items-end gap-2">
        <Textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Niva se baat karein..."
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
