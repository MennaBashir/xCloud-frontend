import { useTranslation } from "react-i18next";

import { cn } from "@/lib/utils";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";

type SsoProvider = "google" | "microsoft";

type SsoButtonRowProps = {
	className?: string;
};

export function SsoButtonRow({ className }: SsoButtonRowProps) {
	const { t } = useTranslation("auth");

	return (
		<div className={cn("flex flex-col gap-3", className)}>
			<div className="flex items-center gap-3 text-muted-foreground text-[0.75rem]">
				<span className="h-px flex-1 bg-border" />
				<span className="uppercase tracking-[0.14em]">
					{t("login.orContinueWith")}
				</span>
				<span className="h-px flex-1 bg-border" />
			</div>

			<TooltipProvider delayDuration={150}>
				<div className="grid grid-cols-2 gap-2">
					<SsoButton provider="google" />
					<SsoButton provider="microsoft" />
				</div>
			</TooltipProvider>
		</div>
	);
}

function SsoButton({ provider }: { provider: SsoProvider }) {
	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<button
					type="button"
					disabled
					aria-disabled="true"
					className={cn(
						"inline-flex items-center justify-center gap-2.5 h-10 w-full",
						"rounded-[var(--radius-md)] border border-border bg-surface-elevated",
						"text-[0.875rem] font-medium text-foreground",
						"disabled:cursor-not-allowed disabled:opacity-60",
						"transition-colors duration-[var(--duration-fast)]",
					)}
				>
					{provider === "google" ? <GoogleMark /> : <MicrosoftMark />}
					<span>
						{provider === "google" ? "Google" : "Microsoft"}
					</span>
				</button>
			</TooltipTrigger>
			<TooltipContent>Coming soon</TooltipContent>
		</Tooltip>
	);
}

function GoogleMark() {
	return (
		<svg
			viewBox="0 0 18 18"
			className="size-4"
			aria-hidden="true"
		>
			<path
				d="M17.64 9.2c0-.64-.06-1.25-.17-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.91a8.78 8.78 0 0 0 2.69-6.62z"
				fill="#4285F4"
			/>
			<path
				d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.91-2.26c-.81.54-1.84.86-3.05.86A5.27 5.27 0 0 1 4.04 10.7H1.04v2.33A9 9 0 0 0 9 18z"
				fill="#34A853"
			/>
			<path
				d="M4.04 10.71A5.4 5.4 0 0 1 3.76 9c0-.6.1-1.18.28-1.71V4.96H1.04A9 9 0 0 0 0 9c0 1.45.35 2.83.96 4.05l3.08-2.34z"
				fill="#FBBC05"
			/>
			<path
				d="M9 3.58c1.32 0 2.5.45 3.44 1.34l2.57-2.57A9 9 0 0 0 9 0 9 9 0 0 0 .96 4.95L4.04 7.3A5.36 5.36 0 0 1 9 3.58z"
				fill="#EA4335"
			/>
		</svg>
	);
}

function MicrosoftMark() {
	return (
		<svg
			viewBox="0 0 16 16"
			className="size-4"
			aria-hidden="true"
		>
			<rect x="1" y="1" width="6.5" height="6.5" fill="#F25022" />
			<rect x="8.5" y="1" width="6.5" height="6.5" fill="#7FBA00" />
			<rect x="1" y="8.5" width="6.5" height="6.5" fill="#00A4EF" />
			<rect x="8.5" y="8.5" width="6.5" height="6.5" fill="#FFB900" />
		</svg>
	);
}
