export type Mode = "chat";

export interface Message {
  id: string;
  role: "user" | "ai";
  text?: string;
  code?: string;
  suggestions?: string[];
}
