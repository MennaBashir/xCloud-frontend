import { useTranslation } from "react-i18next";

import { cn } from "@/lib/utils";
import { Logo } from "@/shared/components/Logo";
import { LanguageSwitcher } from "@/shared/components/LanguageSwitcher";
import { ThemeToggle } from "@/shared/components/ThemeToggle";

type Column = {
	titleKey: string;
	links: Array<{ key: string; href: string }>;
};

const COLUMNS: Column[] = [
	{
		titleKey: "footer.product",
		links: [
			{ key: "footer.productLinks.features", href: "#features" },
			{ key: "footer.productLinks.pricing", href: "#" },
			{ key: "footer.productLinks.changelog", href: "#" },
			{ key: "footer.productLinks.roadmap", href: "#" },
		],
	},
	{
		titleKey: "footer.company",
		links: [
			{ key: "footer.companyLinks.about", href: "#" },
			{ key: "footer.companyLinks.customers", href: "#customers" },
			{ key: "footer.companyLinks.careers", href: "#" },
			{ key: "footer.companyLinks.contact", href: "#" },
		],
	},
	{
		titleKey: "footer.resources",
		links: [
			{ key: "footer.resourceLinks.docs", href: "#" },
			{ key: "footer.resourceLinks.blog", href: "#" },
			{ key: "footer.resourceLinks.security", href: "#" },
			{ key: "footer.resourceLinks.status", href: "#" },
		],
	},
];

export function LandingFooter() {
	const { t } = useTranslation("landing");
	const year = new Date().getFullYear();

	return (
		<footer className="relative border-t border-border bg-surface-muted/30">
			{/* Soft gradient halo at top edge (mobile-prominent) */}
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-x-0 top-0 h-px"
				style={{
					background:
						"linear-gradient(to right, transparent, var(--brand-from), var(--brand-to), transparent)",
					opacity: 0.5,
				}}
			/>

			<div className="container mx-auto px-4 sm:px-6 py-10 sm:py-20">
				{/* ===== Brand block (mobile-first hero) ===== */}
				<div
					className={cn(
						"flex flex-col gap-5",
						"sm:hidden", // mobile-only block
					)}
				>
					<Logo variant="full" />
					<p className="text-[0.9375rem] text-muted-foreground leading-relaxed max-w-[36ch]">
						{t("footer.tagline")}
					</p>
					<div className="flex items-center gap-2">
						<LanguageSwitcher />
						<ThemeToggle />
					</div>
				</div>

				{/* ===== Mobile divider ===== */}
				<div className="sm:hidden mt-8 mb-7 h-px bg-border" />

				{/* ===== Desktop/tablet grid (sm+) — unchanged structurally ===== */}
				<div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr] gap-10 lg:gap-14">
					<div className="flex flex-col gap-4 max-w-sm sm:col-span-2 lg:col-span-1">
						<Logo variant="full" />
						<p className="text-[0.9375rem] text-muted-foreground leading-relaxed">
							{t("footer.tagline")}
						</p>
						<div className="flex items-center gap-2 mt-2">
							<LanguageSwitcher />
							<ThemeToggle />
						</div>
					</div>

					{COLUMNS.map((col) => (
						<div key={col.titleKey} className="flex flex-col gap-4">
							<h3 className="text-[0.6875rem] font-medium uppercase tracking-[0.18em] text-muted-foreground">
								{t(col.titleKey)}
							</h3>
							<ul className="flex flex-col gap-2.5">
								{col.links.map((link) => (
									<li key={link.key}>
										<a
											href={link.href}
											className="text-[0.875rem] text-foreground hover:text-muted-foreground transition-colors"
										>
											{t(link.key)}
										</a>
									</li>
								))}
							</ul>
						</div>
					))}
				</div>

				{/* ===== Mobile link columns (2-up grid) ===== */}
				<div className="sm:hidden grid grid-cols-2 gap-x-4 gap-y-7">
					{COLUMNS.map((col) => (
						<div key={col.titleKey} className="flex flex-col gap-3">
							<h3 className="text-[0.6875rem] font-medium uppercase tracking-[0.18em] text-muted-foreground">
								{t(col.titleKey)}
							</h3>
							<ul className="flex flex-col gap-2">
								{col.links.map((link) => (
									<li key={link.key}>
										<a
											href={link.href}
											className={cn(
												"inline-flex items-center min-h-[36px]",
												"text-[0.875rem] text-foreground/85",
												"hover:text-foreground transition-colors duration-[var(--duration-fast)]",
												"focus-visible:outline-none focus-visible:text-foreground",
											)}
										>
											{t(link.key)}
										</a>
									</li>
								))}
							</ul>
						</div>
					))}
				</div>

				{/* ===== Bottom row ===== */}
				<div
					className={cn(
						"mt-10 sm:mt-14 pt-5 sm:pt-6 border-t border-border",
						"flex flex-col items-center sm:flex-row sm:items-center sm:justify-between gap-3",
					)}
				>
					<p className="text-[0.75rem] sm:text-[0.8125rem] text-muted-foreground text-center sm:text-start">
						{t("footer.rights", { year })}
					</p>
				</div>
			</div>
		</footer>
	);
}
