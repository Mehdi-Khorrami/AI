import { openai, MODEL } from "../config/client.ts";
import { messages } from "./history.ts";

// Replace the whole conversation (except the system prompt) with a short
// summary written by the model.
export async function compactContext() {
  const history = messages
    .slice(1)
    .map((m) => `${m.role}: ${typeof m.content === "string" ? m.content : ""}`)
    .join("\n");

  const completion = await openai.chat.completions.create({
    messages: [
      {
        role: "developer",
        content:
          "Summarize this conversation in under 60 words. Keep names, facts and open questions.",
      },
      { role: "user", content: history },
    ],
    model: MODEL,
  });

  const summary = completion.choices[0]?.message?.content ?? "";
  if (!summary) return;

  messages.splice(1, messages.length - 1, {
    role: "developer",
    content: `Summary of the conversation so far: ${summary}`,
  });
}
