import { type ComponentType, forwardRef, type SVGProps } from "react";

import { cn } from "@/lib/utils";

type Variant = "neutral" | "danger" | "destructive";

type ControlButtonProps = {
	icon: ComponentType<SVGProps<SVGSVGElement>>;
	label: string;
	pressed?: boolean;
	onClick?: () => void;
	variant?: Variant;
	className?: string;
	badge?: string | number | null;
};

export const ControlButton = forwardRef<HTMLButtonElement, ControlButtonProps>(
	function ControlButton(
		{ icon: Icon, label, pressed, onClick, variant = "neutral", className, badge },
		ref,
	) {
		return (
			<button
				ref={ref}
				type="button"
				onClick={onClick}
				aria-label={label}
				aria-pressed={pressed}
				className={cn(
					"relative inline-flex items-center justify-center",
					"size-11 rounded-full",
					"text-white",
					"transition-[transform,background-color,border-color] duration-[var(--duration-fast)] ease-[cubic-bezier(0.32,0.72,0,1)]",
					"active:scale-[0.94]",
					"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950",
					variant === "neutral" &&
						(pressed
							? "bg-white text-zinc-950 hover:bg-white/95"
							: "bg-white/8 hover:bg-white/14 border border-white/12"),
					variant === "danger" &&
						"bg-destructive/15 text-destructive border border-destructive/30 hover:bg-destructive/20",
					variant === "destructive" &&
						"bg-destructive text-destructive-foreground hover:bg-destructive/92",
					className,
				)}
			>
				<Icon className="size-4" strokeWidth={1.7} />
				{badge !== null && badge !== undefined ? (
					<span
						aria-hidden="true"
						className={cn(
							"absolute -top-1 -end-1 inline-flex items-center justify-center",
							"min-w-[1.125rem] h-[1.125rem] px-1 rounded-full",
							"bg-white text-zinc-950 font-mono text-[0.625rem] font-semibold",
							"ring-2 ring-zinc-950",
						)}
					>
						{badge}
					</span>
				) : null}
			</button>
		);
	},
);
