/**
 * Mock auth backend.
 *
 * This file is the ONLY one that needs to change when the real backend lands.
 * The rest of the app reads from authStore, which has the same shape.
 *
 * Simulates network latency so loading states feel real.
 */
import type {
	AuthError,
	LoginInput,
	SignupInput,
	User,
} from "../types/user";

const DEMO_EMAIL = "demo@sprintifai.com";
const DEMO_PASSWORD = "Sprintif@2026";

const LOGIN_DELAY = 800;
const SIGNUP_DELAY = 1200;

function delay(ms: number) {
	return new Promise<void>((resolve) => setTimeout(resolve, ms));
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

function getVideoSdkTokenFromEnv(): string {
	// Vite typings — the env var may be undefined; we fall back to "".
	const token =
		(import.meta.env.VITE_VIDEOSDK_TOKEN as string | undefined) ?? "";
	return token;
}

function generateId(): string {
	return `usr_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(
		36,
	)}`;
}

function generateToken(userId: string): string {
	// Not a real JWT — just an opaque demo token tied to the user id.
	const payload = btoa(
		JSON.stringify({
			sub: userId,
			iat: Math.floor(Date.now() / 1000),
			mock: true,
		}),
	);
	return `mock.${payload}.${Math.random().toString(36).slice(2, 10)}`;
}

const DEMO_USER: User = {
	id: "usr_demo_alex",
	name: "Alex Morgan",
	email: DEMO_EMAIL,
	role: "Product Manager",
	videoSdkToken: getVideoSdkTokenFromEnv(),
	workspaceId: "ws_demo_sprintifai",
	createdAt: "2025-08-14T10:00:00.000Z",
};

export type AuthResponse = {
	user: User;
	token: string;
};

export async function mockLogin(
	input: LoginInput,
): Promise<AuthResponse> {
	await delay(LOGIN_DELAY);

	const email = input.email.trim().toLowerCase();
	if (email !== DEMO_EMAIL || input.password !== DEMO_PASSWORD) {
		throw makeError(
			"invalid_credentials",
			"Email or password is incorrect.",
		);
	}

	// Refresh videoSdkToken on every login so dev .env updates take effect.
	const user: User = {
		...DEMO_USER,
		videoSdkToken: getVideoSdkTokenFromEnv(),
	};
	const token = generateToken(user.id);
	return { user, token };
}

export async function mockSignup(
	input: SignupInput,
): Promise<AuthResponse> {
	await delay(SIGNUP_DELAY);

	const email = input.email.trim().toLowerCase();

	// Reserved demo email — preserve the canonical demo user.
	if (email === DEMO_EMAIL) {
		throw makeError(
			"email_in_use",
			"That email is reserved for the demo account.",
		);
	}

	const id = generateId();
	const user: User = {
		id,
		name: input.name.trim(),
		email,
		role: "Member",
		videoSdkToken: getVideoSdkTokenFromEnv(),
		workspaceId: `ws_${id}`,
		createdAt: new Date().toISOString(),
	};
	const token = generateToken(id);
	return { user, token };
}

export async function mockRequestPasswordReset(email: string): Promise<void> {
	await delay(900);
	// Always resolves; production backend would email a reset link.
	void email;
}

export { DEMO_EMAIL, DEMO_PASSWORD };
