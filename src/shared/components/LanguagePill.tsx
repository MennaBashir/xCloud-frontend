import { cn } from "@/lib/utils";
import { useLanguage } from "@/shared/i18n/LanguageProvider";
import { type Language } from "@/shared/i18n";

const OPTIONS: Array<{ value: Language; label: string }> = [
	{ value: "en", label: "EN" },
	{ value: "ar", label: "ع" },
];

type LanguagePillProps = {
	className?: string;
};

/**
 * Compact two-button language toggle, mirrors the ThemeToggle pattern.
 * Designed to live inside a dropdown row so it doesn't open another menu.
 */
export function LanguagePill({ className }: LanguagePillProps) {
	const { language, setLanguage } = useLanguage();

	return (
		<div
			role="radiogroup"
			aria-label="Language"
			className={cn(
				"inline-flex items-center gap-0.5 rounded-full border border-border bg-surface-muted p-0.5",
				className,
			)}
		>
			{OPTIONS.map(({ value, label }) => {
				const active = language === value;
				return (
					<button
						key={value}
						type="button"
						role="radio"
						aria-checked={active}
						aria-label={value === "en" ? "English" : "العربية"}
						onClick={() => setLanguage(value)}
						className={cn(
							"relative grid h-7 min-w-7 px-2 place-items-center rounded-full transition-all",
							"duration-[var(--duration-fast)] ease-[cubic-bezier(0.32,0.72,0,1)]",
							"font-mono text-[0.6875rem] font-medium",
							"hover:bg-accent",
							"active:scale-[0.96]",
							active &&
								"bg-card text-foreground shadow-[0_1px_2px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.1)] ring-1 ring-border-strong",
							!active && "text-muted-foreground hover:text-foreground",
						)}
					>
						{label}
					</button>
				);
			})}
		</div>
	);
}
