import { openai, MODEL } from "../config/client.ts";
import { messages } from "../context/history.ts";
import { tools, runTool } from "../tools/index.ts";

// Keep calling the model until it stops asking for tools. Returns the reply.
export async function runTurn(): Promise<string> {
  while (true) {
    const completion = await openai.chat.completions.create({
      messages,
      model: MODEL,
      tools,
    });

    const msg = completion.choices[0]?.message;
    if (!msg) return "";
    messages.push(msg);

    if (!msg.tool_calls?.length) return msg.content ?? "";

    for (const call of msg.tool_calls) {
      if (call.type !== "function") continue;
      console.log(`[tool: ${call.function.name}(${call.function.arguments})]`);
      const result = await runTool(call.function.name, call.function.arguments);
      messages.push({ role: "tool", tool_call_id: call.id, content: result });
    }
  }
}
