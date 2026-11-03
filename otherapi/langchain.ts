import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import dotenv from "dotenv";
import * as readline from "readline/promises";

dotenv.config(); // Load environment variables from .env file

const model = new ChatOpenAI({
  model: "gpt-4.1-nano",
  apiKey: process.env.OPENAI_API_KEY,
  configuration: {
    baseURL: "https://api.gapgpt.app/v1",
  },
});

async function main() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  const message = await rl.question("You: ");
  rl.close();

  const response = await model.invoke([
    new SystemMessage("You are a helpful assistant."),
    new HumanMessage(message),
  ]);

  console.log(`AI: ${response.content}`);
}

main();
