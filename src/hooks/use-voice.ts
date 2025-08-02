"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useToast } from "@/hooks/use-toast";

interface UseVoiceProps {
  onTranscript: (text: string) => void;
}

export function useVoice({ onTranscript }: UseVoiceProps) {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn("Speech recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = "en-US";
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
       let description = `Could not use voice recognition: ${event.error}`;
       if (event.error === 'not-allowed') {
         description = "Microphone permission was denied. Please allow microphone access in your browser settings to use voice commands.";
       }
       toast({
        variant: "destructive",
        title: "Voice Error",
        description: description,
      });
    };

    recognition.onresult = (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript.trim();
      onTranscript(transcript);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [onTranscript, toast]);

  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.error("Could not start recognition", e);
        if (e instanceof Error && (e.name === 'NotAllowedError' || e.name === 'SecurityError')) {
            toast({
                variant: "destructive",
                title: "Voice Error",
                description: "Microphone permission was denied. Please allow microphone access in your browser settings to use voice commands."
            });
        }
      }
    }
  }, [isListening, toast]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  }, [isListening]);

  return { isListening, startListening, stopListening };
}
