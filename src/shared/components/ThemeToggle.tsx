import { Moon, Sun } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useTheme, type Theme } from "@/shared/theme/ThemeProvider";
import { cn } from "@/lib/utils";

const OPTIONS: Array<{
	value: Theme;
	labelKey: "theme.light" | "theme.dark";
	icon: typeof Sun;
}> = [
	{ value: "light", labelKey: "theme.light", icon: Sun },
	{ value: "dark", labelKey: "theme.dark", icon: Moon },
];

type ThemeToggleProps = {
	className?: string;
};

export function ThemeToggle({ className }: ThemeToggleProps) {
	const { theme, setTheme } = useTheme();
	const { t } = useTranslation();

	return (
		<div
			role="radiogroup"
			aria-label={t("theme.label")}
			className={cn(
				"inline-flex items-center gap-0.5 rounded-full border border-border bg-surface-muted p-0.5",
				className,
			)}
		>
			{OPTIONS.map(({ value, labelKey, icon: Icon }) => {
				const active = theme === value;
				const label = t(labelKey);
				return (
					<button
						key={value}
						type="button"
						role="radio"
						aria-checked={active}
						aria-label={label}
						title={label}
						onClick={() => setTheme(value)}
						className={cn(
							"relative grid size-7 place-items-center rounded-full transition-all",
							"duration-[280ms] ease-[cubic-bezier(0.32,0.72,0,1)]",
							"hover:bg-accent",
							"active:scale-[0.96]",
							active &&
								"bg-card text-foreground shadow-[0_1px_2px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.1)] ring-1 ring-border-strong",
							!active && "text-muted-foreground hover:text-foreground",
						)}
					>
						<Icon className="size-3.5" strokeWidth={1.6} />
					</button>
				);
			})}
		</div>
	);
}
