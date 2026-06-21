/**
 * Files POST endpoints.
 * Mirrors `xcloud/src/presentation/files_api.py`.
 *
 * Recording upload uses multipart/form-data, which the JSON `request`
 * helper does not handle — so it uses `fetch` directly while reusing the
 * shared base URL and bearer token.
 */
import { ApiError, getApiBaseUrl, getStoredToken } from "../client";

export type SavedRecording = {
	path: string;
	name: string;
	size: number;
};

export async function saveRecording(
	blob: Blob,
	filename: string,
): Promise<SavedRecording> {
	const form = new FormData();
	form.append("file", blob, filename);
	form.append("filename", filename);

	const token = getStoredToken();
	const headers: Record<string, string> = { Accept: "application/json" };
	if (token) headers.Authorization = `Bearer ${token}`;

	let response: Response;
	try {
		response = await fetch(`${getApiBaseUrl()}/files/save-recording`, {
			method: "POST",
			headers,
			body: form,
		});
	} catch (err) {
		throw new ApiError(
			err instanceof Error ? err.message : "Network request failed.",
			0,
			"network",
		);
	}

	const payload = (await response.json().catch(() => null)) as
		| SavedRecording
		| { detail?: string }
		| null;

	if (!response.ok) {
		const detail =
			payload && typeof payload === "object" && "detail" in payload
				? String(payload.detail)
				: `Request failed with status ${response.status}.`;
		throw new ApiError(detail, response.status, "http");
	}

	return payload as SavedRecording;
}
