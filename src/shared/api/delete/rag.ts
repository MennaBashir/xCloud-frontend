/**
 * RAG DELETE endpoints.
 */
import { request } from "../client";

export function deleteCollection(
	name: string,
): Promise<{ status: string; collection: string }> {
	return request("DELETE", `/rag/collections/${encodeURIComponent(name)}`);
}
