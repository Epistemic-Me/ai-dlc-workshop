export type ToolName = "list_orders" | "lookup_order" | "search_products" | "get_plan";

export type ToolCall = {
  name: ToolName;
  args: Record<string, string>;
};

export type Message =
  | { role: "user"; content: string }
  | { role: "assistant"; content: string; toolCall?: ToolCall }
  | { role: "tool"; name: ToolName; content: string };

export type ToolSpec = {
  name: ToolName;
  description: string;
};

export type LlmRequest = {
  system: string;
  messages: Message[];
  tools: ToolSpec[];
};

export type LlmResponse = { type: "text"; text: string } | { type: "tool_call"; call: ToolCall };

// Any model provider plugs in here. The repo ships only MockLlmProvider.
export interface LlmProvider {
  complete(request: LlmRequest): Promise<LlmResponse>;
}

export type SupportReply = {
  reply: string;
  toolCalls: ToolName[];
  handoff: boolean;
};
