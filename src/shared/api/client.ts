/**
 * Core HTTP client for the xcloud backend.
 *
 * This is the single point of contact with the network. Every verb-specific
 * module (post/, get/, put/, delete/) builds on top of `request`.
 *
 * - Reads the base URL from `VITE_API_BASE_URL`.
 * - Serialises JSON bodies and parses JSON responses.
 * - Normalises backend errors (FastAPI `{ detail }`) into `ApiError`.
 * - Injects the bearer token (when provided) for authenticated calls.
 */

const BASE_URL = (
	(import.meta.env.VITE_API_BASE_URL as string | undefined) ??
	"http://localhost:8000"
).replace(/\/+$/, "");

/** Base URL of the xcloud backend, normalised (no trailing slash). */
export function getApiBaseUrl(): string {
	return BASE_URL;
}

/**
 * Pulls the persisted auth token directly from localStorage.
 *
 * Reading storage avoids importing the auth store here (keeps this module
 * dependency-free and side-effect-free). Used as a fallback when a caller
 * does not pass an explicit token, so authenticated endpoints "just work".
 */
export function getStoredToken(): string | null {
	try {
		const raw = localStorage.getItem("sprintifai.auth");
		if (!raw) return null;
		const parsed = JSON.parse(raw) as { state?: { token?: string | null } };
		return parsed.state?.token ?? null;
	} catch {
		return null;
	}
}

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type RequestOptions = {
	/** Parsed JSON body — serialised automatically. */
	body?: unknown;
	/** Bearer token for authenticated endpoints. */
	token?: string | null;
	/** Extra headers, merged after defaults. */
	headers?: Record<string, string>;
	/** Query params appended to the URL. */
	query?: Record<string, string | number | boolean | undefined>;
	/** AbortSignal for cancellation. */
	signal?: AbortSignal;
};

/**
 * Structured error thrown by the client on any non-2xx response or
 * network failure. UI/store layers map `code` to localized messages.
 */
export class ApiError extends Error {
	readonly status: number;
	readonly code: "network" | "http" | "parse";

	constructor(
		message: string,
		status: number,
		code: ApiError["code"] = "http",
	) {
		super(message);
		this.name = "ApiError";
		this.status = status;
		this.code = code;
	}
}

function buildUrl(
	path: string,
	query?: RequestOptions["query"],
): string {
	const url = new URL(
		`${BASE_URL}${path.startsWith("/") ? path : `/${path}`}`,
	);
	if (query) {
		for (const [key, value] of Object.entries(query)) {
			if (value !== undefined) {
				url.searchParams.set(key, String(value));
			}
		}
	}
	return url.toString();
}

function extractErrorMessage(payload: unknown, status: number): string {
	if (payload && typeof payload === "object" && "detail" in payload) {
		const detail = (payload as { detail: unknown }).detail;
		if (typeof detail === "string") return detail;
		if (Array.isArray(detail) && detail.length > 0) {
			// FastAPI validation errors: [{ msg, loc, ... }]
			const first = detail[0];
			if (first && typeof first === "object" && "msg" in first) {
				return String((first as { msg: unknown }).msg);
			}
		}
	}
	return `Request failed with status ${status}.`;
}

export async function request<TResponse>(
	method: HttpMethod,
	path: string,
	options: RequestOptions = {},
): Promise<TResponse> {
	const { body, token, headers, query, signal } = options;

	const finalHeaders: Record<string, string> = {
		Accept: "application/json",
		...headers,
	};
	if (body !== undefined) {
		finalHeaders["Content-Type"] = "application/json";
	}
	const authToken = token === undefined ? getStoredToken() : token;
	if (authToken) {
		finalHeaders.Authorization = `Bearer ${authToken}`;
	}

	let response: Response;
	try {
		response = await fetch(buildUrl(path, query), {
			method,
			headers: finalHeaders,
			body: body !== undefined ? JSON.stringify(body) : undefined,
			signal,
		});
	} catch (err) {
		throw new ApiError(
			err instanceof Error ? err.message : "Network request failed.",
			0,
			"network",
		);
	}

	const isJson = response.headers
		.get("content-type")
		?.includes("application/json");
	const payload = isJson ? await response.json().catch(() => null) : null;

	if (!response.ok) {
		throw new ApiError(
			extractErrorMessage(payload, response.status),
			response.status,
			"http",
		);
	}

	return payload as TResponse;
}
