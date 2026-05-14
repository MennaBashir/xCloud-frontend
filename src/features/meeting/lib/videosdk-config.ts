/**
 * VideoSDK token resolution + API helpers.
 *
 * Token source of truth:
 *   1. authStore.user.videoSdkToken  — populated by login response.
 *   2. VITE_VIDEOSDK_TOKEN           — dev fallback so the meeting works
 *      without a backend during local development.
 *
 * When the real backend ships, only `mockAuth.ts` changes — the rest of
 * the meeting feature reads from the auth store.
 */
import { useAuthStore } from "@/features/auth/store/authStore";

const API_BASE_URL = "https://api.videosdk.live";

export function resolveVideoSdkToken(): string {
	const fromStore = useAuthStore.getState().user?.videoSdkToken ?? "";
	if (fromStore) return fromStore;
	const envToken = (import.meta.env.VITE_VIDEOSDK_TOKEN as
		| string
		| undefined) ?? "";
	return envToken;
}

export async function createRoom(): Promise<
	{ ok: true; meetingId: string } | { ok: false; error: string }
> {
	const token = resolveVideoSdkToken();
	if (!token) {
		return {
			ok: false,
			error:
				"No VideoSDK token available. Sign in or set VITE_VIDEOSDK_TOKEN.",
		};
	}
	try {
		const res = await fetch(`${API_BASE_URL}/v2/rooms`, {
			method: "POST",
			headers: {
				Authorization: token,
				"Content-Type": "application/json",
			},
		});
		const data = await res.json();
		if (data?.roomId) {
			return { ok: true, meetingId: data.roomId };
		}
		return { ok: false, error: data?.error ?? "Failed to create meeting." };
	} catch (err) {
		return {
			ok: false,
			error:
				err instanceof Error ? err.message : "Network error creating room.",
		};
	}
}

export async function validateRoom(
	meetingId: string,
): Promise<
	{ ok: true; meetingId: string } | { ok: false; error: string }
> {
	const token = resolveVideoSdkToken();
	if (!token) {
		return { ok: false, error: "No VideoSDK token available." };
	}
	try {
		const res = await fetch(
			`${API_BASE_URL}/v2/rooms/validate/${meetingId}`,
			{
				method: "GET",
				headers: {
					Authorization: token,
					"Content-Type": "application/json",
				},
			},
		);
		if (res.status === 400) {
			const txt = await res.text();
			return { ok: false, error: txt };
		}
		const data = await res.json();
		if (data?.roomId) {
			return { ok: true, meetingId: data.roomId };
		}
		return { ok: false, error: data?.error ?? "Invalid meeting ID." };
	} catch (err) {
		return {
			ok: false,
			error:
				err instanceof Error
					? err.message
					: "Network error validating meeting.",
		};
	}
}
