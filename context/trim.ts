import { MAX_CONTEXT_TOKENS } from "../config/constants.ts";
import { messages } from "./history.ts";
import { countTokens } from "./tokens.ts";

// Drop the oldest messages (keeping the system prompt at index 0 and the
// newest message) until the context fits in the limit.
export function trimContext() {
  while (countTokens(messages) > MAX_CONTEXT_TOKENS && messages.length > 2) {
    messages.splice(1, 1);
    // never leave a "tool" message without the assistant call before it
    while (messages.length > 2 && messages[1]?.role === "tool") {
      messages.splice(1, 1);
    }
  }
}
