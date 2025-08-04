"use client";

import { useState, useEffect, useCallback } from "react";
import type { Message, Mode } from "@/lib/types";
import { chat } from "@/ai/flows/chat";
import { textToSpeech } from "@/ai/flows/text-to-speech";
import { useToast } from "@/hooks/use-toast";
import { useVoice } from "@/hooks/use-voice";
import { cn } from "@/lib/utils";
import Header from "@/components/Header";
import MessageList from "@/components/MessageList";
import ControlPanel from "@/components/ControlPanel";
import AudioPlayer from "@/components/AudioPlayer";
import Image from "next/image";

const BatcompUI = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [audioQueue, setAudioQueue] = useState<string[]>([]);
  const { toast } = useToast();
  
  const handleTranscript = useCallback((transcript: string) => {
    handleSendMessage(transcript);
  }, []);

  const { isListening, startListening, stopListening } = useVoice({ onTranscript: handleTranscript });

  useEffect(() => {
    setMessages([{
      id: "0",
      role: "ai",
      text: "Namaste! Main Niva hoon. Aap mujhse kuch bhi puch sakte hain.",
    }]);
  }, []);

  const speak = useCallback(async (text: string) => {
    if (!text || !isVoiceEnabled) return;
    try {
      const response = await textToSpeech(text);
      setAudioQueue(prev => [...prev, response.audioDataUri]);
    } catch (error) {
      console.error("Error generating speech:", error);
      toast({
        variant: "destructive",
        title: "Speech Error",
        description: "Could not generate audio for the response.",
      });
    }
  }, [toast, isVoiceEnabled]);

  const handleSendMessage = async (input: string) => {
    if (!input.trim()) return;

    const userMessage: Message = { id: Date.now().toString(), role: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const result = await chat({ message: input });
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        text: result.message,
      };

      setMessages((prev) => [...prev, aiResponse]);

      if (aiResponse.text) {
        speak(aiResponse.text);
      }
    } catch (error) {
      console.error(error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        text: "Maaf kijiye, kuch gadbad ho gayi. Kripya phir se koshish karein.",
      };
      setMessages((prev) => [...prev, errorMessage]);
      toast({
        variant: "destructive",
        title: "An error occurred",
        description: "Could not get a response from the AI.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-background">
      <AudioPlayer audioQueue={audioQueue} onPlaybackFinish={() => setAudioQueue(q => q.slice(1))} />
      <div className="flex flex-col flex-1">
        <Header
          isVoiceEnabled={isVoiceEnabled}
          onVoiceToggle={setIsVoiceEnabled}
        />
        <main className="flex-1 overflow-hidden">
          <MessageList messages={messages} />
        </main>
        <footer className={cn("border-t-2 border-primary/20 p-4 shadow-[0_0_15px_2px_#3B82F6]")}>
          <ControlPanel
            isLoading={isLoading}
            onSendMessage={handleSendMessage}
            isListening={isListening}
            onListenToggle={isListening ? stopListening : startListening}
          />
        </footer>
      </div>
      <div className="hidden lg:flex w-1/3 items-center justify-center p-8">
        <div className="relative w-full h-full animate-float">
            <Image 
                src="https://placehold.co/600x800.png"
                alt="Niva - Anime Assistant"
                layout="fill"
                objectFit="contain"
                className="animate-glow"
                data-ai-hint="cute anime girl"
            />
        </div>
      </div>
    </div>
  );
};

export default BatcompUI;
