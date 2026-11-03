import { getWeather } from "./weather.ts";

export { tools } from "./definitions.ts";

export async function runTool(name: string, args: string): Promise<string> {
  try {
    if (name === "get_weather") return await getWeather(JSON.parse(args).city);
    return JSON.stringify({ error: `Unknown tool ${name}` });
  } catch (err) {
    return JSON.stringify({ error: err instanceof Error ? err.message : String(err) });
  }
}
