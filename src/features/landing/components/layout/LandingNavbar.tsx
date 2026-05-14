import { useCallback, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { Logo } from "@/shared/components/Logo";
import { Button, ButtonTrailingIcon } from "@/components/ui/button";
import { LanguageSwitcher } from "@/shared/components/LanguageSwitcher";
import { ThemeToggle } from "@/shared/components/ThemeToggle";
import {
	selectIsAuthenticated,
	useAuthStore,
} from "@/features/auth/store/authStore";

/* ──────────────────────────────────────────────────────────────────────────
 * LandingNavbar — floating pill nav with smooth-scroll section links,
 * scroll-spy active indicator, and a Fluid-Island morphing hamburger.
 *
 * Section pills (desktop):
 *   - Features → #features
 *   - Live     → #motion-bento
 *   - Start    → #get-started
 *
 * Active state slides between pills via `layoutId`. Scroll-spy uses a single
 * IntersectionObserver (no scroll listener), so it's cheap on mobile too.
 * ──────────────────────────────────────────────────────────────────────── */

type NavLink = {
	id: string;
	href: string;
	labelKey: string;
};

export function LandingNavbar() {
	const { t } = useTranslation("landing");
	const { t: tc } = useTranslation();
	const navigate = useNavigate();
	const location = useLocation();
	const isAuthenticated = useAuthStore(selectIsAuthenticated);
	const [scrolled, setScrolled] = useState(false);
	const [mobileOpen, setMobileOpen] = useState(false);
	const [activeId, setActiveId] = useState<string>("hero");

	useEffect(() => {
		const onScroll = () => setScrolled(window.scrollY > 24);
		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	// Lock body scroll when mobile menu is open
	useEffect(() => {
		if (mobileOpen) {
			const original = document.body.style.overflow;
			document.body.style.overflow = "hidden";
			return () => {
				document.body.style.overflow = original;
			};
		}
	}, [mobileOpen]);

	const navLinks: NavLink[] = [
		{ id: "features", href: "#features", labelKey: "nav.features" },
		{ id: "motion-bento", href: "#motion-bento", labelKey: "nav.live" },
		{ id: "get-started", href: "#get-started", labelKey: "nav.start" },
	];

	// Scroll-spy via IntersectionObserver — picks whichever section currently
	// occupies the upper-middle of the viewport.
	useEffect(() => {
		// Only run on the landing page
		if (location.pathname !== "/") return;

		const ids = ["hero", ...navLinks.map((l) => l.id)];
		const elements = ids
			.map((id) => document.getElementById(id))
			.filter((el): el is HTMLElement => el !== null);

		if (elements.length === 0) return;

		const observer = new IntersectionObserver(
			(entries) => {
				// Track the entry whose intersectionRatio is highest among those
				// currently in the viewport.
				const visible = entries
					.filter((e) => e.isIntersecting)
					.sort((a, b) => b.intersectionRatio - a.intersectionRatio);
				if (visible[0]) {
					setActiveId(visible[0].target.id);
				}
			},
			{
				// Top quarter of the viewport is the "active band"
				rootMargin: "-20% 0px -60% 0px",
				threshold: [0, 0.25, 0.5, 0.75, 1],
			},
		);

		elements.forEach((el) => observer.observe(el));
		return () => observer.disconnect();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [location.pathname]);

	// Smooth-scroll handler that also works when user is on a subroute (e.g. /login)
	const handleSectionClick = useCallback(
		(href: string) => (event: React.MouseEvent<HTMLAnchorElement>) => {
			event.preventDefault();
			setMobileOpen(false);

			const id = href.slice(1); // drop leading "#"

			const scrollToTarget = () => {
				const el = document.getElementById(id);
				if (!el) return;
				const prefersReduced = window.matchMedia(
					"(prefers-reduced-motion: reduce)",
				).matches;
				el.scrollIntoView({
					behavior: prefersReduced ? "auto" : "smooth",
					block: "start",
				});
			};

			if (location.pathname !== "/") {
				// Navigate to landing first, then scroll once the DOM mounts.
				navigate(`/${href}`);
				// React Router doesn't auto-scroll to anchors — defer to next frame
				window.requestAnimationFrame(() => {
					window.requestAnimationFrame(scrollToTarget);
				});
			} else {
				scrollToTarget();
				// Reflect the anchor in the URL without a jump
				window.history.replaceState(null, "", href);
			}
		},
		[location.pathname, navigate],
	);

	return (
		<header
			className={cn(
				"fixed inset-x-0 top-3 sm:top-4 z-40 flex justify-center px-3 sm:px-6",
				"pointer-events-none",
			)}
		>
			<nav
				className={cn(
					"pointer-events-auto flex items-center gap-2",
					"w-full max-w-[64rem] min-w-0",
					"rounded-full",
					"transition-[background-color,border-color,box-shadow,backdrop-filter] duration-[var(--duration-base)] ease-[cubic-bezier(0.32,0.72,0,1)]",
					scrolled
						? "bg-background/75 backdrop-blur-xl border border-border shadow-[0_1px_2px_oklch(0_0_0/0.04),0_24px_48px_-24px_oklch(0_0_0/0.16)]"
						: "bg-background/60 backdrop-blur-md border border-border/40 lg:bg-transparent lg:border-transparent lg:backdrop-blur-none",
					"px-2 ps-3 sm:ps-4 py-1.5 sm:py-2",
				)}
			>
				<Link
					to="/"
					aria-label={tc("brand.name")}
					className="inline-flex items-center shrink-0"
				>
					<Logo variant="full" />
				</Link>

				{/* Desktop section pills with sliding active indicator */}
				<ul className="ms-6 hidden lg:flex items-center gap-0.5">
					{navLinks.map((item) => {
						const isActive = activeId === item.id;
						return (
							<li key={item.href} className="relative">
								<a
									href={item.href}
									onClick={handleSectionClick(item.href)}
									aria-current={isActive ? "true" : undefined}
									className={cn(
										"relative inline-flex items-center h-9 px-3.5 rounded-full",
										"text-[0.875rem] font-medium tracking-tight",
										"transition-colors duration-[var(--duration-fast)] ease-[cubic-bezier(0.32,0.72,0,1)]",
										isActive
											? "text-foreground"
											: "text-muted-foreground hover:text-foreground",
									)}
								>
									{/* Active pill — shared layoutId animates the indicator
									    between links. Sits behind the label. */}
									{isActive ? (
										<motion.span
											layoutId="nav-active-pill"
											className="absolute inset-0 -z-10 rounded-full bg-foreground/[0.06] ring-1 ring-inset ring-border/70"
											transition={{
												type: "spring",
												stiffness: 380,
												damping: 32,
												mass: 0.7,
											}}
										/>
									) : null}
									<span>{t(item.labelKey)}</span>
								</a>
							</li>
						);
					})}
				</ul>

				<div className="ms-auto flex items-center gap-1.5 sm:gap-2 min-w-0">
					<div className="hidden sm:flex items-center gap-2">
						<LanguageSwitcher />
						<ThemeToggle />
					</div>

					{isAuthenticated ? (
						<Button
							asChild
							size="pill-sm"
							variant="brand"
							className="group/btn hidden xs:inline-flex"
						>
							<Link to="/app">
								<span>{tc("actions.goToWorkspace")}</span>
								<ButtonTrailingIcon>
									<ArrowRight className="rtl-flip" strokeWidth={1.8} />
								</ButtonTrailingIcon>
							</Link>
						</Button>
					) : (
						<>
							<Button
								asChild
								variant="ghost"
								size="sm"
								className="hidden xs:inline-flex"
							>
								<Link to="/login">{tc("actions.signIn")}</Link>
							</Button>
							<Button
								asChild
								size="pill-sm"
								variant="brand"
								className="group/btn hidden xs:inline-flex"
							>
								<Link to="/signup">
									<span>{tc("actions.getStarted")}</span>
									<ButtonTrailingIcon>
										<ArrowRight className="rtl-flip" strokeWidth={1.8} />
									</ButtonTrailingIcon>
								</Link>
							</Button>
						</>
					)}

					<button
						type="button"
						onClick={() => setMobileOpen((v) => !v)}
						aria-label={mobileOpen ? "Close menu" : "Open menu"}
						aria-expanded={mobileOpen}
						className={cn(
							"lg:hidden relative inline-flex size-9 shrink-0 items-center justify-center",
							"rounded-full border border-border bg-card hover:bg-accent transition-colors",
							"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
						)}
					>
						{/* Hamburger morph: two lines that rotate into an X */}
						<span
							className="relative grid place-items-center w-4 h-4"
							aria-hidden="true"
						>
							<span
								className={cn(
									"absolute h-[1.5px] w-4 bg-foreground rounded-full",
									"transition-transform duration-[var(--duration-base)] ease-[cubic-bezier(0.32,0.72,0,1)]",
									mobileOpen
										? "rotate-45 translate-y-0"
										: "-translate-y-[3px]",
								)}
							/>
							<span
								className={cn(
									"absolute h-[1.5px] w-4 bg-foreground rounded-full",
									"transition-transform duration-[var(--duration-base)] ease-[cubic-bezier(0.32,0.72,0,1)]",
									mobileOpen
										? "-rotate-45 translate-y-0"
										: "translate-y-[3px]",
								)}
							/>
						</span>
					</button>
				</div>
			</nav>

			{/* Mobile menu — drops below the pill */}
			<AnimatePresence>
				{mobileOpen ? (
					<motion.div
						key="mobile-menu"
						initial={{ opacity: 0, y: -8, scale: 0.99 }}
						animate={{ opacity: 1, y: 0, scale: 1 }}
						exit={{ opacity: 0, y: -6, scale: 0.99 }}
						transition={{
							duration: 0.32,
							ease: [0.16, 1, 0.3, 1],
						}}
						className={cn(
							"pointer-events-auto lg:hidden",
							"absolute top-[calc(100%+8px)] inset-x-3 sm:inset-x-6",
							"rounded-[var(--radius-2xl)] border border-border bg-card",
							"shadow-[0_24px_48px_-24px_oklch(0_0_0/0.2)]",
							"p-3 flex flex-col gap-1",
						)}
					>
						{navLinks.map((item, i) => {
							const isActive = activeId === item.id;
							return (
								<a
									key={item.href}
									href={item.href}
									onClick={handleSectionClick(item.href)}
									aria-current={isActive ? "true" : undefined}
									style={
										{
											animationDelay: `${80 + i * 60}ms`,
										} as React.CSSProperties
									}
									className={cn(
										"flex items-center justify-between gap-3 px-3 py-3 rounded-[var(--radius-md)]",
										"text-[0.9375rem] font-medium",
										"transition-colors duration-[var(--duration-fast)] ease-[cubic-bezier(0.32,0.72,0,1)]",
										"motion-safe:animate-[menu-link-in_0.5s_cubic-bezier(0.16,1,0.3,1)_both]",
										isActive
											? "bg-foreground/[0.06] text-foreground ring-1 ring-inset ring-border"
											: "text-foreground hover:bg-accent",
									)}
								>
									<span>{t(item.labelKey)}</span>
									{isActive ? (
										<span
											aria-hidden="true"
											className="relative grid size-1.5 place-items-center"
										>
											<span
												className="absolute inset-0 rounded-full bg-ai/55 animate-ping"
												style={{ animationDuration: "1.8s" }}
											/>
											<span className="relative size-1.5 rounded-full bg-ai" />
										</span>
									) : (
										<ArrowRight
											className="size-3.5 text-muted-foreground/60 rtl-flip"
											strokeWidth={1.7}
										/>
									)}
								</a>
							);
						})}

						{/* Auth CTAs — visible inside the menu on <xs where they're hidden in the bar */}
						<div className="xs:hidden mt-2 pt-2 border-t border-border flex flex-col gap-2">
							{isAuthenticated ? (
								<Button
									asChild
									size="pill-sm"
									variant="brand"
									className="group/btn w-full justify-center"
								>
									<Link to="/app" onClick={() => setMobileOpen(false)}>
										<span>{tc("actions.goToWorkspace")}</span>
										<ButtonTrailingIcon>
											<ArrowRight className="rtl-flip" strokeWidth={1.8} />
										</ButtonTrailingIcon>
									</Link>
								</Button>
							) : (
								<>
									<Button
										asChild
										variant="outline"
										size="sm"
										className="w-full justify-center"
									>
										<Link
											to="/login"
											onClick={() => setMobileOpen(false)}
										>
											{tc("actions.signIn")}
										</Link>
									</Button>
									<Button
										asChild
										size="pill-sm"
										variant="brand"
										className="group/btn w-full justify-center"
									>
										<Link
											to="/signup"
											onClick={() => setMobileOpen(false)}
										>
											<span>{tc("actions.getStarted")}</span>
											<ButtonTrailingIcon>
												<ArrowRight
													className="rtl-flip"
													strokeWidth={1.8}
												/>
											</ButtonTrailingIcon>
										</Link>
									</Button>
								</>
							)}
						</div>

						<div className="mt-1 flex items-center gap-2 px-1 sm:hidden">
							<LanguageSwitcher />
							<ThemeToggle />
						</div>
					</motion.div>
				) : null}
			</AnimatePresence>
		</header>
	);
}
