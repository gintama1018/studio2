export type Mode = "chat" | "coding" | "debug";

export interface Message {
  id: string;
  role: "user" | "ai";
  text?: string;
  code?: string;
  suggestions?: string[];
}
