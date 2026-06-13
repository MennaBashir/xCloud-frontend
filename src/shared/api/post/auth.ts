/**
 * Auth POST endpoints — `/auth/signup` and `/auth/login`.
 *
 * Mirrors the FastAPI contract in `xcloud/src/presentation/auth_api.py`:
 *   request:  { username, password }
 *   response: { user_id, username, token }
 */
import { request } from "../client";

export type AuthRequestBody = {
	username: string;
	password: string;
};

export type AuthResponse = {
	user_id: string;
	username: string;
	token: string;
};

export function signup(body: AuthRequestBody): Promise<AuthResponse> {
	return request<AuthResponse>("POST", "/auth/signup", { body });
}

export function login(body: AuthRequestBody): Promise<AuthResponse> {
	return request<AuthResponse>("POST", "/auth/login", { body });
}
