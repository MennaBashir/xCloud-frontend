import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import { login as apiLogin, signup as apiSignup } from "../services/authApi";
import { loginWithGoogle as apiLoginWithGoogle } from "../services/googleAuthApi";
import type {
	AuthError,
	AuthStatus,
	LoginInput,
	SignupInput,
	User,
} from "../types/user";

type AuthState = {
	user: User | null;
	token: string | null;
	status: AuthStatus;
	error: AuthError | null;
	hasHydrated: boolean;
};

type AuthActions = {
	login: (input: LoginInput) => Promise<User>;
	signup: (input: SignupInput) => Promise<User>;
	loginWithGoogle: () => Promise<User>;
	logout: () => void;
	requestPasswordReset: (email: string) => Promise<void>;
	clearError: () => void;
	setHasHydrated: (value: boolean) => void;
};

export type AuthStore = AuthState & AuthActions;

const STORAGE_KEY = "sprintifai.auth";

function toAuthError(err: unknown): AuthError {
	if (
		err &&
		typeof err === "object" &&
		"code" in err &&
		"message" in err &&
		typeof (err as AuthError).code === "string"
	) {
		return err as AuthError;
	}
	const message =
		err instanceof Error ? err.message : "Something went wrong.";
	return { code: "unknown", message };
}

export const useAuthStore = create<AuthStore>()(
	persist(
		(set, get) => ({
			user: null,
			token: null,
			status: "idle",
			error: null,
			hasHydrated: false,

			setHasHydrated: (value) => set({ hasHydrated: value }),

			clearError: () => set({ error: null }),

			login: async (input) => {
				set({ status: "authenticating", error: null });
				try {
					const { user, token } = await apiLogin(input);
					set({
						user,
						token,
						status: "authenticated",
						error: null,
					});
					return user;
				} catch (err) {
					const authError = toAuthError(err);
					set({ status: "error", error: authError });
					throw authError;
				}
			},

			signup: async (input) => {
				set({ status: "authenticating", error: null });
				try {
					const { user, token } = await apiSignup(input);
					set({
						user,
						token,
						status: "authenticated",
						error: null,
					});
					return user;
				} catch (err) {
					const authError = toAuthError(err);
					set({ status: "error", error: authError });
					throw authError;
				}
			},

			loginWithGoogle: async () => {
				set({ status: "authenticating", error: null });
				try {
					const { user, token } = await apiLoginWithGoogle();
					set({
						user,
						token,
						status: "authenticated",
						error: null,
					});
					return user;
				} catch (err) {
					const authError = toAuthError(err);
					// A cancelled popup is a user action, not a hard error — keep
					// the form usable without a scary error banner.
					set({
						status: authError.code === "popup_closed" ? "idle" : "error",
						error: authError.code === "popup_closed" ? null : authError,
					});
					throw authError;
				}
			},

			logout: () => {
				set({
					user: null,
					token: null,
					status: "idle",
					error: null,
				});
			},

			requestPasswordReset: async (email) => {
				// No backend endpoint yet — resolve optimistically so the UI
				// flow works. Wire to `/auth/forgot-password` when available.
				void email;
				void get();
				await Promise.resolve();
			},
		}),
		{
			name: STORAGE_KEY,
			storage: createJSONStorage(() => localStorage),
			partialize: (state) => ({
				user: state.user,
				token: state.token,
				status: state.user ? ("authenticated" as AuthStatus) : ("idle" as AuthStatus),
			}),
			onRehydrateStorage: () => (state) => {
				state?.setHasHydrated(true);
			},
		},
	),
);

/**
 * Convenience selectors — avoid re-renders on unrelated state changes.
 */
export const selectUser = (s: AuthStore) => s.user;
export const selectIsAuthenticated = (s: AuthStore) => Boolean(s.user);
export const selectAuthStatus = (s: AuthStore) => s.status;
export const selectAuthError = (s: AuthStore) => s.error;
export const selectHasHydrated = (s: AuthStore) => s.hasHydrated;
export const selectVideoSdkToken = (s: AuthStore) =>
	s.user?.videoSdkToken ?? "";
