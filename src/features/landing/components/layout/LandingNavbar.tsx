import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Menu, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Logo } from "@/shared/components/Logo";
import { Button, ButtonTrailingIcon } from "@/components/ui/button";
import { LanguageSwitcher } from "@/shared/components/LanguageSwitcher";
import { ThemeToggle } from "@/shared/components/ThemeToggle";
import {
	selectIsAuthenticated,
	useAuthStore,
} from "@/features/auth/store/authStore";
import { ArrowRight } from "lucide-react";

export function LandingNavbar() {
	const { t } = useTranslation("landing");
	const { t: tc } = useTranslation();
	const isAuthenticated = useAuthStore(selectIsAuthenticated);
	const [scrolled, setScrolled] = useState(false);
	const [mobileOpen, setMobileOpen] = useState(false);

	useEffect(() => {
		const onScroll = () => setScrolled(window.scrollY > 24);
		onScroll();
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	const navLinks = [
		{ href: "#features", label: t("nav.product") },
		{ href: "#how-it-works", label: t("nav.howItWorks") },
		{ href: "#customers", label: t("nav.customers") },
	];

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

				<ul className="ms-6 hidden lg:flex items-center gap-1">
					{navLinks.map((item) => (
						<li key={item.href}>
							<a
								href={item.href}
								className="inline-flex items-center h-9 px-3 rounded-full text-[0.875rem] font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors duration-[var(--duration-fast)]"
							>
								{item.label}
							</a>
						</li>
					))}
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
						className="lg:hidden inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-border bg-card hover:bg-accent transition-colors"
					>
						{mobileOpen ? (
							<X className="size-4" strokeWidth={1.6} />
						) : (
							<Menu className="size-4" strokeWidth={1.6} />
						)}
					</button>
				</div>
			</nav>

			{/* Mobile menu — drops below the pill */}
			{mobileOpen ? (
				<div
					className={cn(
						"pointer-events-auto lg:hidden",
						"absolute top-[calc(100%+8px)] inset-x-3 sm:inset-x-6",
						"rounded-[var(--radius-2xl)] border border-border bg-card",
						"shadow-[0_24px_48px_-24px_oklch(0_0_0/0.2)]",
						"p-3 flex flex-col gap-1",
					)}
				>
					{navLinks.map((item) => (
						<a
							key={item.href}
							href={item.href}
							onClick={() => setMobileOpen(false)}
							className="px-3 py-2.5 rounded-[var(--radius-md)] text-[0.9375rem] font-medium text-foreground hover:bg-accent transition-colors"
						>
							{item.label}
						</a>
					))}

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
									<Link to="/login" onClick={() => setMobileOpen(false)}>
										{tc("actions.signIn")}
									</Link>
								</Button>
								<Button
									asChild
									size="pill-sm"
									variant="brand"
									className="group/btn w-full justify-center"
								>
									<Link to="/signup" onClick={() => setMobileOpen(false)}>
										<span>{tc("actions.getStarted")}</span>
										<ButtonTrailingIcon>
											<ArrowRight className="rtl-flip" strokeWidth={1.8} />
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
				</div>
			) : null}
		</header>
	);
}
