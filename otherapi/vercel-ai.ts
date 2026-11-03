import { generateText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import dotenv from "dotenv";
import * as readline from "readline/promises";

dotenv.config(); // Load environment variables from .env file

const openai = createOpenAI({
  baseURL: "https://api.gapgpt.app/v1",
  apiKey: process.env.OPENAI_API_KEY,
});

async function main() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  const message = await rl.question("You: ");
  rl.close();

  const { text } = await generateText({
    // .chat() uses the Chat Completions API (same endpoint as main.ts)
    model: openai.chat("gpt-4.1-nano"),
    system: "You are a helpful assistant.",
    prompt: message,
  });

  console.log(`AI: ${text}`);
}

main();
