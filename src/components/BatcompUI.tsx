"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { Message, Mode } from "@/lib/types";
import { generateCode } from "@/ai/flows/generate-code-from-description";
import { provideContextAwareSuggestions } from "@/ai/flows/provide-context-aware-suggestions";
import { adaptEmotionalTone } from "@/ai/flows/adapt-emotional-tone";
import { chat } from "@/ai/flows/chat";
import { textToSpeech } from "@/ai/flows/text-to-speech";
import { useToast } from "@/hooks/use-toast";
import { useVoice } from "@/hooks/use-voice";
import { cn } from "@/lib/utils";
import Header from "@/components/Header";
import MessageList from "@/components/MessageList";
import ControlPanel from "@/components/ControlPanel";
import AudioPlayer from "@/components/AudioPlayer";

const BatcompUI = () => {
  const [mode, setMode] = useState<Mode>("chat");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [isEmotionApiEnabled, setIsEmotionApiEnabled] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState("neutral");
  const [audioQueue, setAudioQueue] = useState<string[]>([]);
  const { toast } = useToast();
  
  const handleTranscript = useCallback((transcript: string) => {
    handleSendMessage(transcript, { emotion: currentEmotion });
  }, [currentEmotion]);

  const { isListening, startListening, stopListening } = useVoice({ onTranscript: handleTranscript });

  useEffect(() => {
    setMessages([{
      id: "0",
      role: "ai",
      text: "Namaste! Main Siya hoon. Ek mode chuniye aur kuch bhi puchiye.",
    }]);
  }, []);

  const speak = useCallback(async (text: string) => {
    if (!text) return;
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
  }, [toast]);

  const handleSendMessage = async (input: string, options: { emotion: string }) => {
    if (!input.trim()) return;

    const userMessage: Message = { id: Date.now().toString(), role: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      let aiResponse: Partial<Message> = { role: "ai" };

      if (mode === 'coding') {
        const langRegex = /(python|javascript|solidity|c\+\+)/i;
        const langMatch = input.match(langRegex);
        const language = langMatch ? langMatch[0] : 'javascript';
        const result = await generateCode({ description: input, language });
        aiResponse.text = `Yeh lijiye aapka ${language} code:`;
        aiResponse.code = result.code;
      } else if (mode === 'debug') {
        const result = await provideContextAwareSuggestions({ codeSnippet: input, programmingLanguage: 'javascript', query: 'Debug or improve this code' });
        aiResponse.text = "Yahan kuch sujhav hain:";
        aiResponse.suggestions = result.suggestions;
        aiResponse.code = `Documentation: \n${result.documentationLinks.join('\n')}\n\nGitHub: \n${result.githubLinks.join('\n')}`;
      } else { // chat mode
        const result = await chat({ message: input });
        aiResponse.text = result.message;
      }

      if (isEmotionApiEnabled && options.emotion !== 'neutral' && aiResponse.text) {
        const adapted = await adaptEmotionalTone({
          emotionalCues: options.emotion,
          originalResponse: aiResponse.text,
        });
        aiResponse.text = adapted.adaptedResponse;
      }

      const finalAiMessage: Message = {
        id: (Date.now() + 1).toString(),
        ...aiResponse,
        role: "ai"
      };

      setMessages((prev) => [...prev, finalAiMessage]);

      if (isVoiceEnabled && finalAiMessage.text) {
        speak(finalAiMessage.text);
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

  const handleModeChange = (newMode: Mode) => {
    setMode(newMode);
    const systemMessage: Message = {
      id: Date.now().toString(),
      role: 'ai',
      text: `${newMode} mode ab active hai.`,
    };
    setMessages(prev => [...prev, systemMessage]);
  };

  const modeGlowClass = {
    coding: "shadow-[0_0_15px_2px_#FBBF24]", // gold
    chat: "shadow-[0_0_15px_2px_#3B82F6]",   // blue
    debug: "shadow-[0_0_15px_2px_#EC4899]",  // pink
  };

  return (
    <div className="flex h-screen w-full flex-col bg-background">
       <AudioPlayer audioQueue={audioQueue} onPlaybackFinish={() => setAudioQueue(q => q.slice(1))} />
      <Header
        isVoiceEnabled={isVoiceEnabled}
        onVoiceToggle={setIsVoiceEnabled}
        isEmotionApiEnabled={isEmotionApiEnabled}
        onEmotionApiToggle={setIsEmotionApiEnabled}
      />
      <main className="flex-1 overflow-hidden">
        <MessageList messages={messages} />
      </main>
      <footer className={cn("border-t-2 border-primary/20 p-4 transition-shadow duration-500", modeGlowClass[mode])}>
        <ControlPanel
          isLoading={isLoading}
          onSendMessage={handleSendMessage}
          mode={mode}
          onModeChange={handleModeChange}
          isListening={isListening}
          onListenToggle={isListening ? stopListening : startListening}
          isEmotionApiEnabled={isEmotionApiEnabled}
          currentEmotion={currentEmotion}
          onEmotionChange={setCurrentEmotion}
        />
      </footer>
    </div>
  );
};

export default BatcompUI;
