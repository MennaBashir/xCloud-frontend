/**
 * RAG POST endpoints.
 * The backend reads `folder_path` / `collection_name` as query params.
 *
 * Indexing runs as a background job: `indexFolder` starts it and returns
 * immediately; poll `getIndexStatus` for progress and call `cancelIndexJob`
 * to stop it server-side.
 */
import { request } from "../client";

export type IndexJobState =
	| "idle"
	| "running"
	| "success"
	| "cancelled"
	| "error";

export type IndexJobPhase = "starting" | "reading" | "embedding";

export type IndexJobStatus = {
	job_id?: string;
	state: IndexJobState;
	phase?: IndexJobPhase;
	folder_path?: string;
	collection_name?: string;
	done?: number;
	total?: number;
	error?: string | null;
	result?: {
		documents_indexed: number;
		nodes_indexed?: number;
		collection: string;
	} | null;
};

export type LoadCollectionResult = {
	status: string;
	collection: string;
};

/** Start a background indexing job. Returns the initial job status. */
export function indexFolder(params: {
	folderPath: string;
	collectionName?: string;
}): Promise<IndexJobStatus> {
	return request<IndexJobStatus>("POST", "/rag/index", {
		query: {
			folder_path: params.folderPath,
			collection_name: params.collectionName,
		},
	});
}

export function getIndexStatus(): Promise<IndexJobStatus> {
	return request<IndexJobStatus>("GET", "/rag/index/status");
}

export function cancelIndexJob(): Promise<IndexJobStatus> {
	return request<IndexJobStatus>("POST", "/rag/index/cancel");
}

export function loadCollection(
	collectionName: string,
): Promise<LoadCollectionResult> {
	return request<LoadCollectionResult>("POST", "/rag/load", {
		query: { collection_name: collectionName },
	});
}
