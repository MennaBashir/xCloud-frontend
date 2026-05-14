import { Outlet } from "react-router-dom";

import { RouteTransition } from "./RouteTransition";

/**
 * Wrapper for public-facing routes (landing, login, signup).
 * Each page brings its own nav for now; this layout exists so we can:
 *  - Add a unified public chrome (e.g., for auth pages)
 *  - Hold global notifications / banners scoped to public routes
 *  - Apply route transitions
 */
export function PublicLayout() {
	return (
		<div className="min-h-[100dvh] bg-background text-foreground">
			<RouteTransition>
				<Outlet />
			</RouteTransition>
		</div>
	);
}

export default PublicLayout;
