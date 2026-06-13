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

export function setDefaultModel(
	token: string,
	name: string,
): Promise<{ message: string; resolved_model: string | null }> {
	return request("POST", "/llm/models", {
		token,
		query: { name },
	});
}
