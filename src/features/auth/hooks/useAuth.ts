import { useAuthStore } from "../store/authStore";

/**
 * Convenience hook for consumers that need most of the store.
 * Components that only need a single field should subscribe directly via
 * `useAuthStore(s => s.field)` to keep re-renders minimal.
 */
export function useAuth() {
	const user = useAuthStore((s) => s.user);
	const status = useAuthStore((s) => s.status);
	const error = useAuthStore((s) => s.error);
	const login = useAuthStore((s) => s.login);
	const signup = useAuthStore((s) => s.signup);
	const loginWithGoogle = useAuthStore((s) => s.loginWithGoogle);
	const logout = useAuthStore((s) => s.logout);
	const requestPasswordReset = useAuthStore((s) => s.requestPasswordReset);
	const clearError = useAuthStore((s) => s.clearError);

	return {
		user,
		isAuthenticated: Boolean(user),
		status,
		error,
		login,
		signup,
		loginWithGoogle,
		logout,
		requestPasswordReset,
		clearError,
	};
}
