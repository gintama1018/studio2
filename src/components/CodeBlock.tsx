"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Copy, ChevronDown } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";

interface CodeBlockProps {
  code: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ code }) => {
  const [hasCopied, setHasCopied] = useState(false);
  const { toast } = useToast();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code).then(() => {
      setHasCopied(true);
      toast({ title: "Copied to clipboard!" });
      setTimeout(() => setHasCopied(false), 2000);
    }).catch(err => {
      toast({ variant: "destructive", title: "Failed to copy", description: "Could not copy code to clipboard." });
      console.error('Failed to copy text: ', err);
    });
  };

  return (
    <div className="relative my-2 rounded-md bg-background/50 font-code text-sm">
        <Accordion type="single" collapsible className="w-full" defaultValue="item-1">
            <AccordionItem value="item-1" className="border-b-0">
                <AccordionTrigger className="p-2 hover:no-underline justify-start gap-2 text-muted-foreground">
                    <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
                    View Code
                </AccordionTrigger>
                <AccordionContent>
                    <div className="relative p-4 pt-0">
                        <pre className="overflow-x-auto p-4 rounded-md bg-black">
                            <code>{code}</code>
                        </pre>
                        <Button
                            size="icon"
                            variant="ghost"
                            className="absolute top-6 right-6 h-7 w-7"
                            onClick={copyToClipboard}
                        >
                            {hasCopied ? (
                            <Check className="h-4 w-4 text-green-500" />
                            ) : (
                            <Copy className="h-4 w-4" />
                            )}
                            <span className="sr-only">Copy code</span>
                        </Button>
                    </div>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    </div>
  );
};

export default CodeBlock;
