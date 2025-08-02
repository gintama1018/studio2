"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { Message } from "@/lib/types";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { BatcompLogo } from "@/components/icons";
import CodeBlock from "./CodeBlock";
import { User } from "lucide-react";

interface MessageListProps {
  messages: Message[];
}

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Framer Motion variants
  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div ref={scrollRef} className="h-full overflow-y-auto p-4 space-y-6">
       {messages.map((message, index) => (
          <motion.div
            key={message.id}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.3, delay: 0.05 * index }}
            variants={variants}
            className={cn(
              "flex items-start gap-4 max-w-4xl",
              message.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
            )}
          >
            <Avatar className="holographic-glow border-2 border-primary/50">
              <AvatarFallback className={cn(message.role === 'user' ? 'bg-accent text-accent-foreground' : 'bg-primary text-primary-foreground')}>
                {message.role === "ai" ? <BatcompLogo className="h-6 w-6" /> : <User className="h-6 w-6"/>}
              </AvatarFallback>
            </Avatar>
            <div className={cn(
              "rounded-lg p-4 space-y-2 text-sm md:text-base",
              message.role === "user" 
                ? "bg-primary/80 text-primary-foreground rounded-br-none" 
                : "bg-card rounded-bl-none border border-primary/20"
            )}>
              {message.text && <p className="whitespace-pre-wrap">{message.text}</p>}
              {message.code && <CodeBlock code={message.code} />}
              {message.suggestions && (
                 <div className="space-y-2">
                    {message.suggestions.map((suggestion, i) => (
                      <div key={i} className="p-2 rounded-md bg-background/50 border-l-2 border-accent">
                        <p>{suggestion}</p>
                      </div>
                    ))}
                 </div>
              )}
            </div>
          </motion.div>
        ))}
    </div>
  );
};

export default MessageList;
