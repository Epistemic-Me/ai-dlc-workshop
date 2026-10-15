import { runTool, TOOL_SPECS, type ToolDeps } from "./tools";
import type { LlmProvider, Message, SupportReply, ToolName } from "./types";

export const SYSTEM_PROMPT =
  "You are the store's support agent. Answer only from tool results. " +
  "Only show the logged-in user's own data. Hand off refunds and complaints to a person.";

export const MAX_STEPS = 3;
export const MAX_MESSAGE_LENGTH = 500;

export class SupportAgent {
  constructor(
    private llm: LlmProvider,
    private deps: ToolDeps,
    private maxSteps = MAX_STEPS,
  ) {}

  async reply(userId: string, message: string): Promise<SupportReply> {
    const messages: Message[] = [{ role: "user", content: message }];
    const toolCalls: ToolName[] = [];

    for (let step = 0; step < this.maxSteps; step++) {
      const response = await this.llm.complete({ system: SYSTEM_PROMPT, messages, tools: TOOL_SPECS });
      if (response.type === "text") {
        return { reply: response.text, toolCalls, handoff: /support team/.test(response.text) };
      }
      toolCalls.push(response.call.name);
      messages.push({ role: "assistant", content: "", toolCall: response.call });
      messages.push({ role: "tool", name: response.call.name, content: runTool(this.deps, userId, response.call) });
    }

    return {
      reply: "Sorry, I couldn't finish that. I've passed your message to the support team.",
      toolCalls,
      handoff: true,
    };
  }
}
