import { Navigate, Outlet, useLocation } from "react-router-dom";

import {
	selectIsAuthenticated,
	useAuthStore,
} from "@/features/auth/store/authStore";

/**
 * Gate for routes that should NOT be visible to authenticated users
 * (e.g. /login, /signup). If a `from` query param exists, restore the
 * original destination; otherwise default to /app.
 */
export function RedirectIfAuthenticated() {
	const isAuthenticated = useAuthStore(selectIsAuthenticated);
	const location = useLocation();

	if (isAuthenticated) {
		const params = new URLSearchParams(location.search);
		const from = params.get("from");
		const target = from && from.startsWith("/") ? from : "/app";
		return <Navigate to={target} replace />;
	}

	return <Outlet />;
}
