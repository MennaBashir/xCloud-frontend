import { Navigate, Outlet, useLocation } from "react-router-dom";

import {
	selectIsAuthenticated,
	useAuthStore,
} from "@/features/auth/store/authStore";

/**
 * Gate for routes that require an authenticated user.
 * Unauthenticated users are redirected to /login with a `from` query param
 * so the auth page can restore the original destination after sign-in.
 */
export function ProtectedRoute() {
	const isAuthenticated = useAuthStore(selectIsAuthenticated);
	const location = useLocation();

	if (!isAuthenticated) {
		const from = `${location.pathname}${location.search}${location.hash}`;
		const search = new URLSearchParams({ from }).toString();
		return <Navigate to={`/login?${search}`} replace />;
	}

	return <Outlet />;
}
