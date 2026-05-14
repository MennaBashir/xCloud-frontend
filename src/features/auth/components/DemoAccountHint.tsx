import { useTranslation } from "react-i18next";
import { Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";
import { DEMO_EMAIL, DEMO_PASSWORD } from "../mock/mockAuth";

type DemoAccountHintProps = {
	onFill: (credentials: { email: string; password: string }) => void;
	className?: string;
};

export function DemoAccountHint({
	onFill,
	className,
}: DemoAccountHintProps) {
	const { t } = useTranslation("auth");

	return (
		<button
			type="button"
			onClick={() =>
				onFill({ email: DEMO_EMAIL, password: DEMO_PASSWORD })
			}
			className={cn(
				"group/demo w-full text-start",
				"rounded-[var(--radius-lg)] border border-ai/25 bg-ai-tint",
				"px-4 py-3.5",
				"transition-[transform,background-color,border-color] duration-[var(--duration-fast)] ease-[cubic-bezier(0.32,0.72,0,1)]",
				"hover:bg-ai/10 hover:border-ai/40",
				"active:scale-[0.99]",
				"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
				className,
			)}
		>
			<div className="flex items-start gap-3">
				<span className="mt-0.5 grid size-7 place-items-center rounded-[var(--radius-sm)] bg-ai/15 text-ai">
					<Sparkles className="size-3.5" strokeWidth={1.6} />
				</span>
				<div className="flex flex-col gap-0.5 min-w-0 flex-1">
					<span className="text-[0.8125rem] font-medium text-foreground">
						{t("login.useDemo")}
					</span>
					<span className="text-[0.75rem] text-muted-foreground truncate font-mono">
						{DEMO_EMAIL}
					</span>
				</div>
				<span className="text-[0.6875rem] uppercase tracking-[0.14em] text-ai font-medium shrink-0 mt-1.5">
					{t("login.demoHint")}
				</span>
			</div>
		</button>
	);
}
