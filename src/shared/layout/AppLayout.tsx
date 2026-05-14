import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

import useMeetingStore from "@/features/meeting/useMeetingStore";
import { AppSidebar, AppSidebarMobileTop } from "./AppSidebar";
import { CommandPalette } from "./CommandPalette";
import { MobileNavSheet } from "./MobileNavSheet";
import { RouteTransition } from "./RouteTransition";
import { ShortcutsDialog } from "./ShortcutsDialog";
import { useGlobalShortcuts } from "@/shared/hooks/useGlobalShortcuts";
import { useNotifications } from "@/features/notifications/hooks/useNotifications";
import { useSimulatedArrival } from "@/features/notifications/hooks/useSimulatedArrival";

export function AppLayout() {
	const { t } = useTranslation();
	const isMeetingActive = useMeetingStore((s) => s.isMeetingActive);
	const location = useLocation();
	const [mobileNavOpen, setMobileNavOpen] = useState(false);

	// Close the mobile nav whenever the route changes
	useEffect(() => {
		setMobileNavOpen(false);
	}, [location.pathname]);

	useGlobalShortcuts();
	// Hydrate notifications + arm one simulated arrival per session
	useNotifications();
	useSimulatedArrival();

	/**
	 * IMPORTANT: We do NOT swap the rendered tree based on `isMeetingActive`.
	 * Doing so unmounts the <Outlet /> (and therefore <MeetingProvider />),
	 * which trips an unmount/remount loop the moment the SDK reports joined.
	 *
	 * Instead, we keep the same tree mounted and visually HIDE the app chrome
	 * via CSS when a meeting is active. The MeetingPage renders its fullscreen
	 * takeover via `fixed inset-0 z-50` on top.
	 *
	 * Conditional siblings use `style={{ display: "none" }}` so React keeps
	 * the same DOM index for every node — that's what prevents the Outlet
	 * (and the MeetingProvider it renders) from unmounting on toggle.
	 */
	const hideChrome = isMeetingActive;
	const hiddenStyle = hideChrome ? { display: "none" as const } : undefined;

	return (
		<div className="min-h-[100dvh] bg-background text-foreground">
			<a
				href="#main-content"
				className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:start-3 focus:z-50 focus:rounded-full focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:text-[0.875rem] focus:font-medium"
				style={hiddenStyle}
			>
				{t("a11y.skipToMain", { defaultValue: "Skip to main content" })}
			</a>

			<div className="flex" aria-hidden={hideChrome ? "true" : undefined}>
				{/* Desktop sidebar (lg+) — hidden in DOM (not unmounted) during meeting */}
				<div style={hiddenStyle} className="contents">
					<AppSidebar />
				</div>

				{/* Main column */}
				<div className="flex-1 min-w-0 flex flex-col">
					{/* Mobile top bar (< lg) — hidden during meeting */}
					<div style={hiddenStyle} className="contents">
						<AppSidebarMobileTop onMenuClick={() => setMobileNavOpen(true)} />
					</div>

					<main
						id="main-content"
						className="flex-1 min-w-0"
						aria-label={t("nav.home")}
					>
						<RouteTransition>
							<Outlet />
						</RouteTransition>
					</main>
				</div>
			</div>

			{/* Mobile nav sheet (< lg) */}
			<div style={hiddenStyle} className="contents">
				<MobileNavSheet open={mobileNavOpen} onOpenChange={setMobileNavOpen} />
			</div>

			{/* Global overlays — hidden during meeting */}
			<div style={hiddenStyle} className="contents">
				<CommandPalette />
				<ShortcutsDialog />
			</div>
		</div>
	);
}

export default AppLayout;
