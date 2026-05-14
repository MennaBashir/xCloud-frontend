import { useEffect, type ReactNode } from "react";

import { useAuthStore } from "./store/authStore";

type AuthProviderProps = {
	children: ReactNode;
	/**
	 * Optional fallback to render while the persisted session is rehydrating.
	 * Default: a minimal full-screen background (no skeleton chrome — we don't
	 * yet know whether the user lands on a public page or the app shell).
	 */
	fallback?: ReactNode;
};

const DEFAULT_FALLBACK = (
	<div
		aria-hidden="true"
		className="min-h-[100dvh] bg-background"
	/>
);

/**
 * Provider that waits for the persisted auth store to rehydrate before
 * rendering children. This avoids:
 *   - flash of unauthenticated content on hard refresh
 *   - <ProtectedRoute> redirecting authenticated users to /login
 *     just because the store hasn't finished hydrating yet
 */
export function AuthProvider({ children, fallback }: AuthProviderProps) {
	const hasHydrated = useAuthStore((s) => s.hasHydrated);
	const setHasHydrated = useAuthStore((s) => s.setHasHydrated);

	useEffect(() => {
		// Safety net: if onRehydrateStorage didn't fire (e.g. fresh storage),
		// mark as hydrated on the next tick so we never block forever.
		if (!hasHydrated) {
			const id = window.setTimeout(() => setHasHydrated(true), 0);
			return () => window.clearTimeout(id);
		}
	}, [hasHydrated, setHasHydrated]);

	if (!hasHydrated) {
		return <>{fallback ?? DEFAULT_FALLBACK}</>;
	}

	return <>{children}</>;
}
