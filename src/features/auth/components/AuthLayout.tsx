import { type ReactNode, useRef } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ArrowLeft } from "lucide-react";

import { Logo } from "@/shared/components/Logo";
import { ThemeToggle } from "@/shared/components/ThemeToggle";
import { LanguageSwitcher } from "@/shared/components/LanguageSwitcher";
import { cn } from "@/lib/utils";

import { BrandPanel } from "./BrandPanel";

gsap.registerPlugin(useGSAP);

type AuthLayoutProps = {
	children: ReactNode;
	/**
	 * Shown above the form heading — small uppercase label.
	 */
	eyebrow?: ReactNode;
	title: ReactNode;
	subtitle?: ReactNode;
	/**
	 * Below-form helper (e.g. "Don't have an account? Sign up").
	 */
	footer?: ReactNode;
	className?: string;
};

export function AuthLayout({
	children,
	eyebrow,
	title,
	subtitle,
	footer,
	className,
}: AuthLayoutProps) {
	const { t } = useTranslation();
	const rootRef = useRef<HTMLDivElement>(null);

	useGSAP(
		() => {
			const mm = gsap.matchMedia();
			mm.add(
				{
					default: "(prefers-reduced-motion: no-preference)",
					reduced: "(prefers-reduced-motion: reduce)",
				},
				(context) => {
					if (context.conditions?.reduced) return;

					const tl = gsap.timeline({
						defaults: { ease: "power3.out" },
					});
					tl.from(".auth-eyebrow", {
						y: 8,
						autoAlpha: 0,
						duration: 0.4,
					});
					tl.from(
						".auth-title",
						{ y: 12, autoAlpha: 0, duration: 0.55 },
						"-=0.25",
					);
					tl.from(
						".auth-subtitle",
						{ y: 10, autoAlpha: 0, duration: 0.5 },
						"-=0.35",
					);
					tl.from(
						".auth-form-content",
						{ y: 14, autoAlpha: 0, duration: 0.55 },
						"-=0.35",
					);
					tl.from(
						".auth-footer",
						{ y: 8, autoAlpha: 0, duration: 0.4 },
						"-=0.3",
					);
				},
			);
			return () => mm.revert();
		},
		{ scope: rootRef },
	);

	return (
		<div
			ref={rootRef}
			className={cn(
				"min-h-[100dvh] bg-background text-foreground",
				"grid md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5",
				className,
			)}
		>
			{/* Form column */}
			<div className="md:col-span-1 lg:col-span-2 xl:col-span-2 flex flex-col">
				{/* Top utility bar */}
				<div className="flex items-center justify-between gap-3 px-6 sm:px-10 pt-6">
					<div className="flex items-center gap-4">
						<Link
							to="/"
							aria-label={t("brand.name")}
							className="inline-flex items-center rounded-[var(--radius-md)] outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
						>
							<Logo variant="full" />
						</Link>
						<Link
							to="/"
							className="hidden xs:inline-flex items-center gap-1.5 h-8 px-2.5 rounded-full text-[0.75rem] font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors duration-[var(--duration-fast)] ease-[cubic-bezier(0.32,0.72,0,1)]"
						>
							<ArrowLeft className="size-3 rtl-flip" strokeWidth={1.8} />
							<span>{t("actions.backToHome")}</span>
						</Link>
					</div>
					<div className="flex items-center gap-2">
						<LanguageSwitcher />
						<ThemeToggle />
					</div>
				</div>

				{/* Form */}
				<div className="flex-1 flex items-center justify-center px-6 sm:px-10 py-10">
					<div className="w-full max-w-[420px] flex flex-col gap-7">
						<header className="flex flex-col gap-2">
							{eyebrow ? (
								<span
									className="auth-eyebrow text-[0.6875rem] font-medium uppercase tracking-[0.18em] text-muted-foreground"
								>
									{eyebrow}
								</span>
							) : null}
							<h1 className="auth-title font-semibold tracking-tight leading-[1.1] text-[1.875rem] sm:text-[2.25rem] text-foreground">
								{title}
							</h1>
							{subtitle ? (
								<p className="auth-subtitle text-[0.9375rem] leading-relaxed text-muted-foreground">
									{subtitle}
								</p>
							) : null}
						</header>

						<div className="auth-form-content">{children}</div>

						{footer ? (
							<div className="auth-footer text-[0.875rem] text-muted-foreground">
								{footer}
							</div>
						) : null}
					</div>
				</div>
			</div>

			{/* Brand panel column (md+) */}
			<BrandPanel />
		</div>
	);
}
