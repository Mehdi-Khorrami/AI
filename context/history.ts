import type OpenAI from "openai";

export type ChatMessage = OpenAI.Chat.ChatCompletionMessageParam;

// All messages of the conversation are stored here
export const messages: ChatMessage[] = [
  { role: "developer", content: "You are a helpful assistant." },
];
