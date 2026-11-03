import Anthropic from "@anthropic-ai/sdk";
import dotenv from "dotenv";
import * as readline from "readline/promises";

dotenv.config(); // Load environment variables from .env file

// Reads ANTHROPIC_API_KEY (and optional ANTHROPIC_BASE_URL) from the environment
const client = new Anthropic();

async function main() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  const message = await rl.question("You: ");
  rl.close();

  const response = await client.beta.messages.create({
    model: "claude-opus-5-5",
    max_tokens: 16000,
    system: "You are a helpful assistant.",
    messages: [{ role: "user", content: message }],
    // If Claude declines a request for safety reasons, the API retries it
    // on a suitable fallback model inside the same call.
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
  });

  if (response.stop_reason === "refusal") {
    console.log("AI: (request was declined)");
    return;
  }

  const reply = response.content
    .filter((block) => block.type === "text")
    .map((block) => block.text)
    .join("");

  console.log(`AI: ${reply}`);
}

main();
