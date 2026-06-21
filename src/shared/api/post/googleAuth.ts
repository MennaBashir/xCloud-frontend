/**
 * Google OAuth endpoints — mirrors `xcloud/src/presentation/google_auth_api.py`.
 *
 *   GET  /auth/google/url       -> { auth_url, state }
 *   POST /auth/google/callback  -> { user_id, username, email, avatar_url, token }
 *
 * The frontend opens `auth_url` in a popup. The backend's GET callback renders
 * an HTML page that relays the result to the opener via `postMessage`, so the
 * POST callback is only a fallback for environments without popups.
 */
import { request } from "../client";

export type GoogleAuthUrlResponse = {
	auth_url: string;
	state: string;
};

export type GoogleAuthResponse = {
	user_id: string;
	username: string;
	email: string | null;
	avatar_url: string | null;
	token: string;
};

export function getGoogleAuthUrl(): Promise<GoogleAuthUrlResponse> {
	return request<GoogleAuthUrlResponse>("GET", "/auth/google/url", {
		token: null,
	});
}

export function exchangeGoogleCode(body: {
	code: string;
	state: string;
}): Promise<GoogleAuthResponse> {
	return request<GoogleAuthResponse>("POST", "/auth/google/callback", {
		body,
		token: null,
	});
}
