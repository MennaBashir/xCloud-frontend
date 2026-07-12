/**
 * LLM / Chat POST endpoints.
 * Note: the backend reads `title` / `model` / `name` as query params, so they
 * are passed via `query`, not a JSON body.
 */
import { request } from "../client";
import type { ApiChat } from "../get/llm";

export function createChat(
	token: string,
	params: { title?: string; model?: string } = {},
): Promise<ApiChat> {
	return request<ApiChat>("POST", "/llm/chats", {
		token,
		query: {
			title: params.title,
			model: params.model,
		},
	});
}

/** Set the default model. Pass `"auto"` to reset to auto-detection. */
export function setDefaultModel(
	token: string,
	name: string,
): Promise<{ message: string; resolved_model: string | null }> {
	return request("POST", "/llm/models", {
		token,
		query: { name },
	});
}

/** Switch the active LLM provider (`ollama`, `openai`, `alibaba`, `gemini`). */
export function setProvider(
	token: string,
	provider: string,
): Promise<{ message: string; settings: Record<string, unknown> }> {
	return request("POST", "/llm/providers/set", {
		token,
		query: { provider },
	});
}

/** Configure a provider's API key and/or base URL. */
export function configureProvider(
	token: string,
	params: { provider: string; apiKey?: string; baseUrl?: string },
): Promise<{ message: string }> {
	return request("POST", "/llm/providers/config", {
		token,
		query: {
			provider: params.provider,
			api_key: params.apiKey,
			base_url: params.baseUrl,
		},
	});
}
