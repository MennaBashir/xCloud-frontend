/**
 * Real auth backend integration.
 *
 * Talks to the xcloud FastAPI service via the shared API layer and adapts the
 * backend response (`{ user_id, username, token }`) into the app's `User`
 * shape. This is the single point that changes if the backend contract moves.
 */
import { ApiError } from "@/shared/api";
import { authPost } from "@/shared/api/post";

import type {
	AuthError,
	LoginInput,
	SignupInput,
	User,
} from "../types/user";

export type AuthResponse = {
	user: User;
	token: string;
};

function getVideoSdkTokenFromEnv(): string {
	return (import.meta.env.VITE_VIDEOSDK_TOKEN as string | undefined) ?? "";
}

function makeError(
	code: AuthError["code"],
	message: string,
): AuthError & Error {
	const err = new Error(message) as AuthError & Error;
	err.code = code;
	err.message = message;
	return err;
}

/**
 * Map an `ApiError` from the client into a domain `AuthError`, choosing the
 * right code from the HTTP status so the UI can localize the message.
 */
function mapApiError(err: unknown, context: "login" | "signup"): AuthError & Error {
	if (err instanceof ApiError) {
		if (err.code === "network") {
			return makeError("network", err.message);
		}
		if (err.status === 401) {
			return makeError("invalid_credentials", err.message);
		}
		if (err.status === 409) {
			return makeError("username_in_use", err.message);
		}
		if (err.status === 400 || err.status === 422) {
			return makeError("validation", err.message);
		}
		return makeError("unknown", err.message);
	}
	const message =
		err instanceof Error ? err.message : `Could not ${context}.`;
	return makeError("unknown", message);
}

/**
 * Build a `User` from the backend payload. The backend only knows
 * `user_id` + `username`; the remaining display fields are derived so the
 * rest of the app (UserMenu, meeting feature, etc.) keeps working unchanged.
 */
function toUser(data: authPost.AuthResponse): User {
	return {
		id: data.user_id,
		username: data.username,
		name: data.username,
		email: data.username,
		role: "Member",
		videoSdkToken: getVideoSdkTokenFromEnv(),
		workspaceId: `ws_${data.user_id}`,
		createdAt: new Date().toISOString(),
	};
}

export async function login(input: LoginInput): Promise<AuthResponse> {
	try {
		const data = await authPost.login({
			username: input.username.trim(),
			password: input.password,
		});
		return { user: toUser(data), token: data.token };
	} catch (err) {
		throw mapApiError(err, "login");
	}
}

export async function signup(input: SignupInput): Promise<AuthResponse> {
	try {
		const data = await authPost.signup({
			username: input.username.trim(),
			password: input.password,
		});
		return { user: toUser(data), token: data.token };
	} catch (err) {
		throw mapApiError(err, "signup");
	}
}
