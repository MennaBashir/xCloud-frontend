/**
 * RAG feature types.
 *
 * RAG collections are workspace-wide (the backend tracks a single active
 * collection, not a per-user one). Indexing reads a folder path that exists
 * on the backend machine — the browser does not upload files.
 */
import type { ragGet } from "@/shared/api";

export type RagCollection = ragGet.RagCollection;

export type RagStatus = {
	isLoaded: boolean;
	collectionName: string | null;
	raw: string;
};
