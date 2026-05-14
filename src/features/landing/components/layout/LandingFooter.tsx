import { useTranslation } from "react-i18next";

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
		<footer className="border-t border-border bg-surface-muted/30">
			<div className="container mx-auto px-4 sm:px-6 py-16 sm:py-20">
				<div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr_1fr_1fr] gap-10 lg:gap-14">
					<div className="flex flex-col gap-4 max-w-sm">
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

				<div className="mt-14 pt-6 border-t border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
					<p className="text-[0.8125rem] text-muted-foreground">
						{t("footer.rights", { year })}
					</p>
				</div>
			</div>
		</footer>
	);
}
