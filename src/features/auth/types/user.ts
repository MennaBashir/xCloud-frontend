/**
 * Authenticated user shape.
 *
 * IMPORTANT: This shape is the app-wide contract for an authenticated user.
 * The backend integration lives in `services/authApi.ts`, which adapts the
 * raw API response into this shape — every consumer (UserMenu, meeting
 * feature, etc.) reads from this shape.
 */
export type User = {
	id: string;
	/** Account identifier used by the backend (`/auth` username). */
	username: string;
	name: string;
	email: string;
	role: string;
	avatarUrl?: string;
	/**
	 * Token used by the meeting feature for VideoSDK.
	 * In mock mode we pull this from `import.meta.env.VITE_VIDEOSDK_TOKEN`;
	 * in production the backend returns it as part of the login response.
	 */
	videoSdkToken: string;
	workspaceId: string;
	createdAt: string;
};

export type AuthStatus =
	| "idle"
	| "restoring"
	| "authenticating"
	| "authenticated"
	| "error";

export type LoginInput = {
	username: string;
	password: string;
};

export type SignupInput = {
	username: string;
	password: string;
};

export type AuthError = {
	code:
		| "invalid_credentials"
		| "network"
		| "validation"
		| "username_in_use"
		| "popup_blocked"
		| "popup_closed"
		| "oauth_unavailable"
		| "unknown";
	message: string;
};
