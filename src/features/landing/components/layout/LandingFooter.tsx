import { useTranslation } from "react-i18next";

import { cn } from "@/lib/utils";

/* ──────────────────────────────────────────────────────────────────────────
 * LandingFooter — minimal one-line footer.
 *
 * Single horizontal row, centered alignment:
 *   © {year} SprintifAI · Meetings that ship outcomes · team@sprintifai.com
 * ──────────────────────────────────────────────────────────────────────── */

const CONTACT_EMAIL = "team@sprintifai.com";

export function LandingFooter() {
	const { t } = useTranslation("landing");
	const { t: tc } = useTranslation();
	const year = new Date().getFullYear();

	return (
		<footer className="relative border-t border-border bg-surface-muted/30">
			{/* Brand gradient hairline */}
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-x-0 top-0 h-px"
				style={{
					background:
						"linear-gradient(to right, transparent, var(--brand-from), var(--brand-to), transparent)",
					opacity: 0.5,
				}}
			/>

			<div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
				<div
					className={cn(
						"flex flex-col xs:flex-row items-center justify-center",
						"gap-x-3 gap-y-1.5",
						"text-[0.75rem] sm:text-[0.8125rem] font-mono text-muted-foreground",
						"text-center",
					)}
				>
					<span>
						© {year} {tc("brand.name")}
					</span>

					<Dot />

					<span className="text-foreground/75">{t("footer.tagline")}</span>

					<Dot />

					<a
						href={`mailto:${CONTACT_EMAIL}`}
						className={cn(
							"text-foreground/85 hover:text-foreground transition-colors",
							"duration-[var(--duration-fast)] ease-[cubic-bezier(0.32,0.72,0,1)]",
							"focus-visible:outline-none focus-visible:text-foreground",
						)}
					>
						{CONTACT_EMAIL}
					</a>
				</div>
			</div>
		</footer>
	);
}

function Dot() {
	return (
		<span
			aria-hidden="true"
			className="hidden xs:inline-block size-1 rounded-full bg-muted-foreground/35"
		/>
	);
}
