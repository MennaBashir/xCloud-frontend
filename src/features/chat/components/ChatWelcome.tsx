import { useTranslation } from "react-i18next";
import {
	ArrowUpRight,
	Code2,
	FileText,
	GraduationCap,
	Languages,
	Lightbulb,
	type LucideIcon,
	Scale,
	Sparkles,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { EyebrowTag } from "@/shared/components/EyebrowTag";
import { usePrompts } from "../hooks/usePrompts";

type Tone = "ai" | "indigo" | "emerald" | "amber";

const CATEGORY_ICON: Record<string, LucideIcon> = {
	learning: GraduationCap,
	coding: Code2,
	writing: FileText,
	analysis: Scale,
	creative: Lightbulb,
	language: Languages,
};

const TONES: Tone[] = ["ai", "emerald", "indigo", "amber"];

function toneClass(tone: Tone): string {
	switch (tone) {
		case "ai":
			return "bg-ai-tint text-ai ring-ai/20";
		case "indigo":
			return "bg-[oklch(0.55_0.2_285/0.12)] text-[oklch(0.55_0.2_285)] ring-[oklch(0.55_0.2_285/0.25)]";
		case "emerald":
			return "bg-[oklch(0.65_0.16_162/0.12)] text-success ring-success/25";
		case "amber":
		default:
			return "bg-[oklch(0.82_0.15_75/0.18)] text-warning ring-warning/25";
	}
}

/** Strip `{placeholder}` braces for a cleaner card subtitle. */
function cleanForDisplay(prompt: string): string {
	return prompt.replace(/\{([^}]+)\}/g, "$1").trim();
}

type ChatWelcomeProps = {
	onPrompt: (prompt: string) => void;
};

export function ChatWelcome({ onPrompt }: ChatWelcomeProps) {
	const { t } = useTranslation("chat");
	const { prompts } = usePrompts();

	const cards = prompts.slice(0, 6);

	return (
		<div className="flex-1 min-h-0 overflow-y-auto flex flex-col items-center justify-center px-4 py-10 sm:py-16">
			<div className="w-full max-w-[760px] flex flex-col items-center text-center gap-5">
				<EyebrowTag withDot tone="ai">
					{t("hero.eyebrow")}
				</EyebrowTag>
				<h1 className="font-semibold tracking-tight leading-[1.08] text-[2rem] sm:text-[2.5rem] text-foreground">
					{t("hero.title")}
				</h1>
				<p className="text-[1rem] leading-relaxed text-muted-foreground max-w-[60ch]">
					{t("hero.subtitle")}
				</p>
			</div>

			{cards.length > 0 ? (
				<div className="mt-10 w-full max-w-[760px]">
					<div className="mb-3 text-[0.6875rem] font-medium uppercase tracking-[0.16em] text-muted-foreground">
						{t("suggestions.label")}
					</div>
					<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
						{cards.map((s, i) => {
							const Icon = CATEGORY_ICON[s.category] ?? Sparkles;
							const tone = TONES[i % TONES.length];
							return (
								<button
									key={`${s.title}-${i}`}
									type="button"
									onClick={() => onPrompt(s.prompt)}
									className={cn(
										"group/sg flex items-start gap-3 text-start",
										"rounded-[var(--radius-xl)] border border-border bg-card",
										"px-4 py-3.5",
										"transition-[transform,border-color,box-shadow] duration-[var(--duration-fast)] ease-[cubic-bezier(0.32,0.72,0,1)]",
										"hover:border-border-strong hover:-translate-y-0.5 hover:shadow-[0_1px_2px_oklch(0_0_0/0.03),0_16px_32px_-18px_oklch(0_0_0/0.12)]",
										"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
									)}
								>
									<span
										className={cn(
											"inline-grid place-items-center size-9 rounded-[var(--radius-md)] ring-1 ring-inset shrink-0 mt-0.5",
											toneClass(tone),
											tone === "ai" && "ambient-pulse",
										)}
									>
										<Icon className="size-4" strokeWidth={1.6} />
									</span>
									<span className="flex flex-col flex-1 min-w-0">
										<span className="text-[0.9375rem] font-medium text-foreground">
											{s.title}
										</span>
										<span className="text-[0.8125rem] text-muted-foreground mt-0.5 line-clamp-2">
											{cleanForDisplay(s.prompt)}
										</span>
									</span>
									<ArrowUpRight
										className="size-4 text-muted-foreground shrink-0 mt-1 rtl-flip group-hover/sg:text-foreground transition-colors"
										strokeWidth={1.6}
									/>
								</button>
							);
						})}
					</div>
				</div>
			) : null}
		</div>
	);
}
