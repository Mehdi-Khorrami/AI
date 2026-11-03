import { CHARS_PER_TOKEN, MAX_CONTEXT_TOKENS } from "../config/constants.ts";
import { messages, type ChatMessage } from "./history.ts";

// Estimate tokens of all messages: total characters / 4
export function countTokens(msgs: ChatMessage[]): number {
  const chars = msgs.reduce(
    (sum, m) => sum + (typeof m.content === "string" ? m.content.length : 0),
    0,
  );
  return Math.ceil(chars / CHARS_PER_TOKEN);
}

export function contextPercent(): number {
  return (countTokens(messages) / MAX_CONTEXT_TOKENS) * 100;
}
