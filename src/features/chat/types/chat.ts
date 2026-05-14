/**
 * Chat feature types.
 *
 * Designed to mirror the shape used by the Vercel AI SDK's `useChat`
 * so we can swap the mock backend for `@ai-sdk/react` without changing
 * any consuming components.
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
	kind: "meeting" | "file";
	title: string;
	detail: string;
};

export type Conversation = {
	id: string;
	title: string;
	createdAt: string;
	updatedAt: string;
	preview: string;
};

export type ChatModel = {
	id: string;
	label: string;
	provider: "openai" | "anthropic" | "google";
	tagline: string;
};

export type SuggestionPrompt = {
	titleKey: string;
	subtitleKey: string;
	promptKey: string;
	tone: "ai" | "indigo" | "emerald" | "amber";
};
