import * as readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { COMPACT_AT_PERCENT, MAX_CONTEXT_TOKENS } from "../config/constants.ts";
import { messages } from "../context/history.ts";
import { countTokens, contextPercent } from "../context/tokens.ts";
import { trimContext } from "../context/trim.ts";
import { compactContext } from "../context/compact.ts";
import { runTurn } from "./turn.ts";

export async function startChat() {
  const rl = readline.createInterface({ input, output });
  console.log('Chat started. Type "exit" to quit.\n');

  while (true) {
    const userText = (await rl.question("You: ")).trim();
    if (!userText) continue;
    if (userText.toLowerCase() === "exit") break;

    messages.push({ role: "user", content: userText });
    trimContext();
    const turnStart = messages.length - 1; // index of this user message

    try {
      const reply = await runTurn();
      console.log(`AI: ${reply}`);

      if (contextPercent() >= COMPACT_AT_PERCENT) {
        try {
          await compactContext();
          console.log("[context compacted]");
        } catch (err) {
          console.error("Compact failed:", err instanceof Error ? err.message : err);
        }
      }

      const used = countTokens(messages);
      const percent = ((used / MAX_CONTEXT_TOKENS) * 100).toFixed(1);
      console.log(
        `[context: ${used}/${MAX_CONTEXT_TOKENS} tokens (${percent}%)]\n`,
      );
    } catch (err) {
      messages.length = turnStart; // remove the failed user message and any tool steps
      console.error("Error:", err instanceof Error ? err.message : err, "\n");
    }

    console.log(messages);
  }

  rl.close();
}
