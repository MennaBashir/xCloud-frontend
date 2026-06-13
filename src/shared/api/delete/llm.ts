/**
 * LLM / Chat DELETE endpoints.
 */
import { request } from "../client";

export function deleteChat(
	token: string,
	chatId: string,
): Promise<{ status: string }> {
	return request<{ status: string }>("DELETE", `/llm/chats/${chatId}`, {
		token,
	});
}
