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
};

export type Citation = {
	id: string;
	kind: "meeting" | "file" | "rag" | "web";
	title: string;
	detail: string;
	/** External link for web sources. */
	url?: string;
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
	| "generic";

export type ChatModel = {
	/** Raw Ollama model id, e.g. `qwen3:1.7b`. */
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

export type SuggestionPrompt = {
	titleKey: string;
	subtitleKey: string;
	promptKey: string;
	tone: "ai" | "indigo" | "emerald" | "amber";
};
