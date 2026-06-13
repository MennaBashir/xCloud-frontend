/**
 * RAG GET endpoints.
 * Mirrors `xcloud/src/presentation/rag_api.py`.
 */
import { request } from "../client";

export type RagStatus = {
	status: string;
	collection_name?: string;
	document_count?: number;
};

export type RagCollection = {
	name: string;
	count: number;
};

export type RagFile = {
	file_name: string;
	file_path: string | null;
	file_type: string | null;
};

export type RagCollectionFiles = {
	collection: string;
	files: RagFile[];
};

export function getRagStatus(): Promise<RagStatus> {
	return request<RagStatus>("GET", "/rag/status");
}

export function listRagCollections(): Promise<RagCollection[]> {
	return request<RagCollection[]>("GET", "/rag/collections");
}

export function getCollectionFiles(
	name: string,
): Promise<RagCollectionFiles> {
	return request<RagCollectionFiles>(
		"GET",
		`/rag/collections/${encodeURIComponent(name)}/files`,
	);
}

export function getCollectionSource(
	name: string,
): Promise<{ collection: string; folder_path: string | null }> {
	return request("GET", `/rag/collections/${encodeURIComponent(name)}/source`);
}
