import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRight, Compass } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Logo } from "@/shared/components/Logo";
import { ThemeToggle } from "@/shared/components/ThemeToggle";
import { LanguageSwitcher } from "@/shared/components/LanguageSwitcher";

export default function NotFoundPage() {
	const { t } = useTranslation();

	return (
		<div className="min-h-[100dvh] bg-background text-foreground flex flex-col">
			<header className="flex items-center justify-between px-6 sm:px-10 pt-6">
				<Link to="/" aria-label={t("brand.name")}>
					<Logo variant="full" />
				</Link>
				<div className="flex items-center gap-2">
					<LanguageSwitcher />
					<ThemeToggle />
				</div>
			</header>

			<main className="flex-1 grid place-items-center px-6 py-16">
				<div className="max-w-[480px] flex flex-col items-center gap-6 text-center">
					<div className="grid size-14 place-items-center rounded-2xl bg-surface-muted ring-1 ring-inset ring-border text-muted-foreground">
						<Compass className="size-6" strokeWidth={1.5} />
					</div>
					<div className="flex flex-col gap-2">
						<span className="text-[0.6875rem] font-medium uppercase tracking-[0.18em] text-muted-foreground">
							404
						</span>
						<h1 className="font-semibold tracking-tight text-[2rem] sm:text-[2.5rem] leading-[1.1]">
							{t("errors:notFound.title")}
						</h1>
						<p className="text-muted-foreground leading-relaxed">
							{t("errors:notFound.description")}
						</p>
					</div>
					<Button asChild size="lg" className="gap-2">
						<Link to="/">
							<span>{t("errors:notFound.cta")}</span>
							<ArrowRight className="size-4 rtl-flip" strokeWidth={1.8} />
						</Link>
					</Button>
				</div>
			</main>
		</div>
	);
}
