/**
 * Chat feature types.
 *
 * These mirror the xcloud backend (`/llm/*`) contract, adapted into a
 * UI-friendly shape. The data layer lives in `hooks/` (useChat,
 * useConversations, useModels) which talks to `src/shared/api`.
 */

export type MessageRole = "user" | "assistant" | "system";

export type MessageStatus = "complete" | "streaming" | "error";

export type ChatMessage = {
	id: string;
	conversationId: string;
	role: MessageRole;
	content: string;
	createdAt: string;
	status: MessageStatus;
	/** Optional citations for assistant messages (meeting / file references). */
	citations?: Citation[];
	/**
	 * Tool calls the agent made while answering (Gmail, Calendar, Tasks, web,
	 * RAG). Populated only for agentic chat replies.
	 */
	toolActivity?: ToolActivity[];
};

/** A single tool invocation surfaced by the agentic chat loop. */
export type ToolActivity = {
	id: string;
	name: string;
	args?: Record<string, unknown>;
	result?: string;
	status: "running" | "done";
};

export type Citation = {
	id: string;
	kind: "meeting" | "file" | "rag" | "web";
	title: string;
	detail: string;
	/** External link for web sources. */
	url?: string;
	/** Absolute server path for file/rag sources — enables in-app preview. */
	filePath?: string;
};

export type Conversation = {
	id: string;
	title: string;
	createdAt: string;
	updatedAt: string;
	preview: string;
};

/** Known model families, used to pick a logo in the model picker. */
export type ModelFamily =
	| "qwen"
	| "llama"
	| "gemma"
	| "mistral"
	| "phi"
	| "deepseek"
	| "nomic"
	| "command"
	| "openai"
	| "gemini"
	| "generic";

export type ChatModel = {
	/** Raw provider model id, e.g. `qwen3:1.7b` or `gpt-4o-mini`. */
	id: string;
	/** Human-friendly label derived from the id. */
	label: string;
	/** Optional descriptor (e.g. parameter size, or "embedding"). */
	tagline?: string;
	/** True for embedding models that cannot be used for chat. */
	isEmbedding?: boolean;
	/** Detected model family — drives which logo is shown beside the name. */
	family: ModelFamily;
};

/** A configurable field on an LLM provider (API key, base URL, …). */
export type ProviderField = {
	key: string;
	label: string;
	secret: boolean;
	hasValue: boolean;
	placeholder: string;
};

/** An LLM provider (Ollama, OpenAI, Alibaba, Gemini) from `GET /llm/providers`. */
export type ChatProvider = {
	id: string;
	label: string;
	isCurrent: boolean;
	fields: ProviderField[];
};

export type SuggestionPrompt = {
	titleKey: string;
	subtitleKey: string;
	promptKey: string;
	tone: "ai" | "indigo" | "emerald" | "amber";
};
