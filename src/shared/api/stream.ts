/**
 * NDJSON streaming helper.
 *
 * The xcloud `/llm/chat` endpoint returns a `text/event-stream`-typed response
 * whose body is newline-delimited JSON (one JSON object per line). Because the
 * endpoint authenticates via a `Authorization: Bearer` header on a GET request,
 * the browser `EventSource` API can't be used (it cannot set headers). We read
 * `response.body` as a stream and split on newlines instead.
 */
import { ApiError } from "./client";

const BASE_URL = (
	(import.meta.env.VITE_API_BASE_URL as string | undefined) ??
	"http://localhost:8000"
).replace(/\/+$/, "");

export type StreamOptions = {
	token?: string | null;
	query?: Record<string, string | number | boolean | undefined>;
	signal?: AbortSignal;
	/** Called once for every parsed JSON line. */
	onLine: (line: unknown) => void;
};

function buildUrl(
	path: string,
	query?: StreamOptions["query"],
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

/**
 * Open a GET stream and invoke `onLine` for every NDJSON line until the
 * response ends or the signal aborts. Resolves when the stream finishes.
 */
export async function streamNDJSON(
	path: string,
	{ token, query, signal, onLine }: StreamOptions,
): Promise<void> {
	const headers: Record<string, string> = { Accept: "text/event-stream" };
	if (token) headers.Authorization = `Bearer ${token}`;

	let response: Response;
	try {
		response = await fetch(buildUrl(path, query), {
			method: "GET",
			headers,
			signal,
		});
	} catch (err) {
		if ((err as Error)?.name === "AbortError") return;
		throw new ApiError(
			err instanceof Error ? err.message : "Network request failed.",
			0,
			"network",
		);
	}

	if (!response.ok) {
		// Error responses are JSON ({ detail }) even on the stream endpoint.
		const payload = await response.json().catch(() => null);
		const detail =
			payload && typeof payload === "object" && "detail" in payload
				? String((payload as { detail: unknown }).detail)
				: `Request failed with status ${response.status}.`;
		throw new ApiError(detail, response.status, "http");
	}

	if (!response.body) {
		throw new ApiError("Stream has no body.", response.status, "parse");
	}

	const reader = response.body.getReader();
	const decoder = new TextDecoder();
	let buffer = "";

	try {
		for (;;) {
			const { done, value } = await reader.read();
			if (done) break;

			buffer += decoder.decode(value, { stream: true });

			let newlineIndex: number;
			while ((newlineIndex = buffer.indexOf("\n")) !== -1) {
				const rawLine = buffer.slice(0, newlineIndex).trim();
				buffer = buffer.slice(newlineIndex + 1);
				if (!rawLine) continue;
				try {
					onLine(JSON.parse(rawLine));
				} catch {
					// Ignore malformed partial lines.
				}
			}
		}

		// Flush any trailing buffered line.
		const tail = buffer.trim();
		if (tail) {
			try {
				onLine(JSON.parse(tail));
			} catch {
				/* ignore */
			}
		}
	} catch (err) {
		if ((err as Error)?.name === "AbortError") return;
		throw err;
	} finally {
		reader.releaseLock();
	}
}
