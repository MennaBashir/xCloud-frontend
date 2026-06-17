/**
 * Adapters mapping the xcloud backend shapes (`src/shared/api/get/llm.ts`)
 * into the chat feature's UI types.
 */
import type { llmGet } from "@/shared/api";

import type {
	ChatMessage,
	ChatModel,
	Citation,
	Conversation,
	ModelFamily,
} from "../types/chat";

/** Heuristic: embedding models can't be used for chat. */
export function isEmbeddingModel(modelId: string): boolean {
	return /embed/i.test(modelId);
}

/** Detect the model family from a raw Ollama model id (for its logo). */
export function detectModelFamily(id: string): ModelFamily {
	const s = id.toLowerCase();
	if (/embed|nomic/.test(s)) return "nomic";
	if (/qwen/.test(s)) return "qwen";
	if (/llama|llava/.test(s)) return "llama";
	if (/gemma/.test(s)) return "gemma";
	if (/mistral|mixtral/.test(s)) return "mistral";
	if (/phi/.test(s)) return "phi";
	if (/deepseek/.test(s)) return "deepseek";
	if (/command|cohere/.test(s)) return "command";
	return "generic";
}

/** Turn a raw Ollama model id into a friendly label, e.g. `qwen3:1.7b` → `Qwen3 1.7b`. */
export function modelToChatModel(id: string): ChatModel {
	const [name, tag] = id.split(":");
	const pretty = name
		.replace(/[-_]/g, " ")
		.replace(/\b\w/g, (c) => c.toUpperCase());
	const embedding = isEmbeddingModel(id);
	return {
		id,
		label: tag ? `${pretty} ${tag}` : pretty,
		tagline: embedding ? "Embedding model" : tag || undefined,
		isEmbedding: embedding,
		family: detectModelFamily(id),
	};
}

export function apiChatToConversation(
	chat: llmGet.ApiChat,
): Conversation {
	const now = new Date().toISOString();
	return {
		id: chat.id,
		title: chat.title || "New chat",
		createdAt: chat.created_at ?? now,
		updatedAt: chat.updated_at ?? chat.created_at ?? now,
		preview: "",
	};
}

export function apiMessageToChatMessage(
	conversationId: string,
	msg: llmGet.ApiChatMessage,
): ChatMessage {
	const role =
		msg.role === "assistant" || msg.role === "system"
			? msg.role
			: "user";
	return {
		id: String(msg.id),
		conversationId,
		role,
		content: msg.content,
		createdAt: msg.created_at ?? new Date().toISOString(),
		status: "complete",
	};
}

function fileNameFromPath(p?: string | null): string | undefined {
	if (!p) return undefined;
	const parts = p.split(/[/\\]/);
	return parts[parts.length - 1] || undefined;
}

export function apiSourcesToCitations(
	sources: llmGet.ChatSource[],
): Citation[] {
	return sources.map((s, i) => {
		const isWeb = s.type === "web";
		const title = isWeb
			? s.title || "Web result"
			: s.title || fileNameFromPath(s.file_path) || "Document";
		return {
			id: String(s.id ?? `src-${i}`),
			kind: isWeb ? "web" : "rag",
			title,
			// For RAG, show the matched snippet on hover; keep web text inline.
			detail: s.text ?? "",
			url: s.url,
			filePath: !isWeb ? (s.file_path ?? undefined) : undefined,
		};
	});
}
