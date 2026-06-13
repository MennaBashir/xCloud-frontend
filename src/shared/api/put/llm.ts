/**
 * LLM / Chat PATCH endpoints (rename).
 * Title is sent as a query param to match the backend signature.
 */
import { request } from "../client";
import type { ApiChat } from "../get/llm";

export function renameChat(
	token: string,
	chatId: string,
	title: string,
): Promise<ApiChat> {
	return request<ApiChat>("PATCH", `/llm/chats/${chatId}`, {
		token,
		query: { title },
	});
}
