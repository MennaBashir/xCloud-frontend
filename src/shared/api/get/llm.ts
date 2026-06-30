/**
 * LLM / Chat GET endpoints.
 * Mirrors `xcloud/src/presentation/llm_api.py`.
 */
import { request } from "../client";
import { streamNDJSON } from "../stream";

export type ApiChat = {
	id: string;
	title: string;
	model: string;
	created_at: string | null;
	updated_at: string | null;
};

export type ApiChatMessage = {
	id: number;
	role: string;
	content: string;
	thinking: string | null;
	created_at: string | null;
};

export type ApiChatDetail = ApiChat & {
	messages: ApiChatMessage[];
};

export type ApiSearchChat = ApiChat & {
	matching_messages: {
		role: string;
		content: string;
		created_at: string | null;
	}[];
};

export type ApiSuggestedPrompt = {
	title: string;
	prompt: string;
	category: string;
};

/** `["qwen3:1.7b", "nomic-embed-text:latest"]` — or `{ error }` if Ollama is down. */
export function listModels(): Promise<string[] | { error: string }> {
	return request<string[] | { error: string }>("GET", "/llm/models");
}

export function getDefaultModel(): Promise<{ default_model: string | null }> {
	return request<{ default_model: string | null }>(
		"GET",
		"/llm/default-model",
	);
}

export function getSuggestedPrompts(
	category?: string,
): Promise<ApiSuggestedPrompt[]> {
	return request<ApiSuggestedPrompt[]>("GET", "/llm/prompts", {
		query: category ? { category } : undefined,
	});
}

export function listChats(token: string): Promise<ApiChat[]> {
	return request<ApiChat[]>("GET", "/llm/chats", { token });
}

export function getChat(
	token: string,
	chatId: string,
): Promise<ApiChatDetail> {
	return request<ApiChatDetail>("GET", `/llm/chats/${chatId}`, { token });
}

export function searchChats(
	token: string,
	q: string,
): Promise<ApiSearchChat[]> {
	return request<ApiSearchChat[]>("GET", "/llm/chats/search/", {
		token,
		query: { q },
	});
}

// ---- Streaming chat -------------------------------------------------------

/** A single NDJSON event emitted by `/llm/chat`. */
export type ChatStreamEvent =
	| { type: "chat_id"; data: string }
	| { type: "sources"; data: ChatSource[] }
	| { type: "content"; content: string }
	| { type: "thinking"; content: string }
	| { type: "done"; thinking: string | null };

export type ChatSource = {
	id?: string | number;
	type: "rag" | "web";
	title?: string;
	url?: string;
	text?: string;
	/** RAG-only: source file path + relevance score. */
	file_path?: string | null;
	score?: number | null;
	metadata?: Record<string, unknown>;
};

export type StreamChatParams = {
	token: string;
	prompt: string;
	chatId?: string;
	useRag?: boolean;
	useWebSearch?: boolean;
	think?: boolean;
	signal?: AbortSignal;
	onEvent: (event: ChatStreamEvent) => void;
};

export function streamChat({
	token,
	prompt,
	chatId,
	useRag,
	useWebSearch,
	think,
	signal,
	onEvent,
}: StreamChatParams): Promise<void> {
	return streamNDJSON("/llm/chat", {
		token,
		signal,
		query: {
			prompt,
			chat_id: chatId,
			use_rag: useRag,
			use_web_search: useWebSearch,
			think,
		},
		onLine: (line) => onEvent(line as ChatStreamEvent),
	});
}

// ---- Agentic chat ---------------------------------------------------------

/**
 * A single NDJSON event emitted by `/llm/agent/chat`.
 *
 * The agent loop can autonomously call tools (Gmail, Calendar, Google Tasks,
 * local tasks, web search, RAG) before producing its final answer, so it
 * emits extra `agent_start` / `tool_call` / `tool_result` events on top of the
 * regular `content` / `done` events.
 */
export type AgentStreamEvent =
	| { type: "chat_id"; data: string }
	| { type: "agent_start" }
	| { type: "tool_call"; name: string; args: Record<string, unknown> }
	| { type: "tool_result"; name: string; result: string }
	| { type: "content"; content: string }
	| { type: "done"; thinking?: string | null };

export type StreamAgentChatParams = {
	token: string;
	prompt: string;
	chatId?: string;
	think?: boolean;
	signal?: AbortSignal;
	onEvent: (event: AgentStreamEvent) => void;
};

/** Stream an agentic chat reply from `GET /llm/agent/chat`. */
export function streamAgentChat({
	token,
	prompt,
	chatId,
	think,
	signal,
	onEvent,
}: StreamAgentChatParams): Promise<void> {
	return streamNDJSON("/llm/agent/chat", {
		token,
		signal,
		query: {
			prompt,
			chat_id: chatId,
			think,
		},
		onLine: (line) => onEvent(line as AgentStreamEvent),
	});
}
