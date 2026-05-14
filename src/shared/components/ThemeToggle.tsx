import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme, type Theme } from "@/shared/theme/ThemeProvider";
import { cn } from "@/lib/utils";

const OPTIONS: Array<{
	value: Theme;
	label: string;
	icon: typeof Sun;
}> = [
	{ value: "light", label: "Light", icon: Sun },
	{ value: "system", label: "System", icon: Monitor },
	{ value: "dark", label: "Dark", icon: Moon },
];

type ThemeToggleProps = {
	className?: string;
};

export function ThemeToggle({ className }: ThemeToggleProps) {
	const { theme, setTheme } = useTheme();

	return (
		<div
			role="radiogroup"
			aria-label="Theme"
			className={cn(
				"inline-flex items-center gap-0.5 rounded-full border border-border bg-surface-muted p-0.5",
				className,
			)}
		>
			{OPTIONS.map(({ value, label, icon: Icon }) => {
				const active = theme === value;
				return (
					<button
						key={value}
						type="button"
						role="radio"
						aria-checked={active}
						aria-label={label}
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
