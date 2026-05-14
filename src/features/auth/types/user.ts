/**
 * Authenticated user shape.
 *
 * IMPORTANT: This shape is forward-compatible with the real backend.
 * When the API ships, the only file that changes is `mock/mockAuth.ts` —
 * every consumer (UserMenu, meeting feature, etc.) reads from this shape.
 */
export type User = {
	id: string;
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
	email: string;
	password: string;
};

export type SignupInput = {
	name: string;
	workspaceName: string;
	email: string;
	password: string;
};

export type AuthError = {
	code:
		| "invalid_credentials"
		| "network"
		| "validation"
		| "email_in_use"
		| "unknown";
	message: string;
};
