import { useState } from "react";
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion } from "motion/react";
import {
	CalendarDays,
	ChevronDown,
	FolderClosed,
	Inbox,
	Sparkles,
	Video,
	type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";

/* ──────────────────────────────────────────────────────────────────────────
 * HowItWorks — an expandable "how the dashboard works" panel for the login
 * page. Collapsed by default; opening it reveals a short guide to each of the
 * five workspace tools (what it is + how to use it) plus a keyboard tip.
 *
 * Kept lightweight and self-contained: motion auto-height reveal, chevron
 * rotate, tokens only. Honors reduced-motion via motion's OS awareness.
 * ──────────────────────────────────────────────────────────────────────── */

type FeatureKey = "meeting" | "chat" | "calendar" | "files" | "gmail";

const FEATURES: Array<{
	key: FeatureKey;
	icon: LucideIcon;
	accent?: boolean;
}> = [
	{ key: "meeting", icon: Video },
	{ key: "chat", icon: Sparkles, accent: true },
	{ key: "calendar", icon: CalendarDays },
	{ key: "files", icon: FolderClosed },
	{ key: "gmail", icon: Inbox },
];

export function HowItWorks() {
	const { t } = useTranslation("auth");
	const [open, setOpen] = useState(false);

	return (
		<div className="rounded-[var(--radius-lg)] border border-border bg-surface-muted/40">
			<button
				type="button"
				onClick={() => setOpen((v) => !v)}
				aria-expanded={open}
				aria-controls="how-it-works-panel"
				className={cn(
					"flex w-full items-center justify-between gap-3 px-4 py-3 text-start",
					"text-[0.8125rem] font-medium text-foreground",
					"rounded-[var(--radius-lg)]",
					"transition-colors duration-[var(--duration-fast)] ease-[cubic-bezier(0.32,0.72,0,1)]",
					"hover:bg-accent/60",
					"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
				)}
			>
				<span className="inline-flex items-center gap-2">
					<Sparkles className="size-3.5 text-ai" strokeWidth={1.7} />
					<span>{open ? t("howItWorks.triggerOpen") : t("howItWorks.trigger")}</span>
				</span>
				<ChevronDown
					className={cn(
						"size-4 shrink-0 text-muted-foreground",
						"transition-transform duration-[var(--duration-base)] ease-[cubic-bezier(0.32,0.72,0,1)]",
						open && "rotate-180",
					)}
					strokeWidth={1.8}
					aria-hidden="true"
				/>
			</button>

			<AnimatePresence initial={false}>
				{open ? (
					<motion.div
						key="panel"
						id="how-it-works-panel"
						initial={{ height: 0, opacity: 0 }}
						animate={{ height: "auto", opacity: 1 }}
						exit={{ height: 0, opacity: 0 }}
						transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
						className="overflow-hidden"
					>
						<div className="px-4 pb-4 pt-1 flex flex-col gap-4 border-t border-border">
							<div className="pt-3 flex flex-col gap-1">
								<h3 className="text-[0.9375rem] font-semibold tracking-tight text-foreground">
									{t("howItWorks.title")}
								</h3>
								<p className="text-[0.8125rem] leading-relaxed text-muted-foreground">
									{t("howItWorks.intro")}
								</p>
							</div>

							<ol className="flex flex-col gap-3">
								{FEATURES.map((f, i) => (
									<li key={f.key} className="flex items-start gap-3">
										<span
											className={cn(
												"relative grid size-8 shrink-0 place-items-center rounded-[var(--radius-sm)]",
												"ring-1 ring-inset",
												f.accent
													? "bg-ai-tint text-ai ring-ai/25"
													: "bg-card text-muted-foreground ring-border",
											)}
										>
											<f.icon className="size-4" strokeWidth={1.6} />
											<span className="absolute -top-1.5 -start-1.5 grid size-4 place-items-center rounded-full bg-foreground text-[0.5625rem] font-semibold text-background">
												{i + 1}
											</span>
										</span>
										<div className="flex flex-col gap-0.5 min-w-0">
											<span className="text-[0.875rem] font-medium text-foreground">
												{t(`howItWorks.features.${f.key}.name`)}
												<span className="ms-1.5 font-normal text-muted-foreground">
													— {t(`howItWorks.features.${f.key}.what`)}
												</span>
											</span>
											<span className="text-[0.8125rem] leading-relaxed text-muted-foreground">
												{t(`howItWorks.features.${f.key}.how`)}
											</span>
										</div>
									</li>
								))}
							</ol>

							<p className="rounded-[var(--radius-md)] bg-ai-tint/60 px-3 py-2.5 text-[0.8125rem] leading-relaxed text-foreground ring-1 ring-inset ring-ai/15">
								{t("howItWorks.tip")}
							</p>
						</div>
					</motion.div>
				) : null}
			</AnimatePresence>
		</div>
	);
}
