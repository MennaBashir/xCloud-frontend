/**
 * Public entry point for the xcloud API layer.
 *
 * Organised by HTTP verb:
 *   - post/   — create / auth actions
 *   - get/    — reads
 *   - put/    — updates
 *   - delete/ — removals
 *
 * Import the core helpers from here, or pull verb-scoped barrels:
 *   import { ApiError, authPost } from "@/shared/api";
 */
export { request, ApiError, getApiBaseUrl, getStoredToken } from "./client";
export type {
	HttpMethod,
	RequestOptions,
} from "./client";
export { streamNDJSON } from "./stream";
export type { StreamOptions } from "./stream";

export * from "./post";
export * from "./get";
export * from "./put";
export * from "./delete";
