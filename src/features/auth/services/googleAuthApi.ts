/**
 * Google OAuth integration (popup flow).
 *
 * 1. Ask the backend for the Google consent URL (`/auth/google/url`).
 * 2. Open it in a popup window.
 * 3. The backend's GET `/auth/google/callback` renders an HTML page that
 *    `postMessage`s the result back to this window, then closes the popup.
 * 4. We resolve with the adapted `User` + token.
 *
 * This is the single point that changes if the Google contract moves.
 */
import { ApiError } from "@/shared/api";
import { googleAuthPost } from "@/shared/api/post";

import type { AuthError, User } from "../types/user";
import type { AuthResponse } from "./authApi";

const POPUP_MESSAGE_SOURCE = "xcloud-google-auth";
const POPUP_NAME = "xcloud-google-oauth";
const POPUP_FEATURES = "width=480,height=720,menubar=no,toolbar=no,location=no";

type PopupPayload =
	| { ok: true; data: googleAuthPost.GoogleAuthResponse }
	| { ok: false; error: string };

function getVideoSdkTokenFromEnv(): string {
	return (import.meta.env.VITE_VIDEOSDK_TOKEN as string | undefined) ?? "";
}

function makeError(code: AuthError["code"], message: string): AuthError & Error {
	const err = new Error(message) as AuthError & Error;
	err.code = code;
	err.message = message;
	return err;
}

/** Adapt the backend Google payload into the app-wide `User` shape. */
function toUser(data: googleAuthPost.GoogleAuthResponse): User {
	const email = data.email ?? data.username;
	return {
		id: data.user_id,
		username: data.username,
		name: data.email ? data.email.split("@")[0] : data.username,
		email,
		role: "Member",
		avatarUrl: data.avatar_url ?? undefined,
		videoSdkToken: getVideoSdkTokenFromEnv(),
		workspaceId: `ws_${data.user_id}`,
		createdAt: new Date().toISOString(),
	};
}

/**
 * Open the Google consent screen in a popup and resolve once the backend
 * relays the auth result via `postMessage`.
 */
export async function loginWithGoogle(): Promise<AuthResponse> {
	let urlResponse: googleAuthPost.GoogleAuthUrlResponse;
	try {
		urlResponse = await googleAuthPost.getGoogleAuthUrl();
	} catch (err) {
		if (err instanceof ApiError) {
			if (err.code === "network") {
				throw makeError("network", err.message);
			}
			if (err.status === 503) {
				throw makeError(
					"oauth_unavailable",
					"Google sign-in is not configured on the server.",
				);
			}
			throw makeError("unknown", err.message);
		}
		throw makeError("unknown", "Could not start Google sign-in.");
	}

	const popup = window.open(
		urlResponse.auth_url,
		POPUP_NAME,
		POPUP_FEATURES,
	);

	if (!popup) {
		throw makeError(
			"popup_blocked",
			"Popup was blocked. Allow popups for this site and try again.",
		);
	}

	return new Promise<AuthResponse>((resolve, reject) => {
		let settled = false;

		const cleanup = () => {
			window.removeEventListener("message", onMessage);
			window.clearInterval(closedTimer);
		};

		const onMessage = (event: MessageEvent) => {
			const data = event.data as
				| { source?: string; payload?: PopupPayload }
				| undefined;
			if (!data || data.source !== POPUP_MESSAGE_SOURCE) return;

			settled = true;
			cleanup();
			try {
				popup.close();
			} catch {
				/* ignore */
			}

			const payload = data.payload;
			if (payload && payload.ok) {
				resolve({ user: toUser(payload.data), token: payload.data.token });
			} else {
				reject(
					makeError(
						"unknown",
						payload && !payload.ok
							? payload.error
							: "Google sign-in failed.",
					),
				);
			}
		};

		window.addEventListener("message", onMessage);

		// Detect a manually-closed popup so the UI doesn't hang forever.
		const closedTimer = window.setInterval(() => {
			if (popup.closed && !settled) {
				cleanup();
				reject(
					makeError("popup_closed", "Sign-in was cancelled."),
				);
			}
		}, 500);
	});
}
