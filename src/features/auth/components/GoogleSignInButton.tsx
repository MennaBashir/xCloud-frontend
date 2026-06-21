import { useTranslation } from "react-i18next";

import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";

type GoogleSignInButtonProps = {
	label: string;
	loading?: boolean;
	disabled?: boolean;
	onClick: () => void;
	className?: string;
};

export function GoogleSignInButton({
	label,
	loading = false,
	disabled = false,
	onClick,
	className,
}: GoogleSignInButtonProps) {
	const { t } = useTranslation();

	return (
		<button
			type="button"
			onClick={onClick}
			disabled={disabled || loading}
			aria-busy={loading}
			className={cn(
				"group inline-flex items-center justify-center gap-3 h-12 w-full",
				"rounded-[var(--radius-md)] border border-border bg-surface-elevated",
				"text-[0.9375rem] font-medium text-foreground",
				"shadow-diffusion",
				"transition-[transform,background-color,border-color] duration-[var(--duration-fast)] ease-[cubic-bezier(0.32,0.72,0,1)]",
				"hover:bg-accent hover:border-foreground/15",
				"active:scale-[0.98]",
				"outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
				"disabled:cursor-not-allowed disabled:opacity-70",
				className,
			)}
		>
			{loading ? (
				<>
					<Spinner className="size-4" />
					<span>{t("states.loading")}</span>
				</>
			) : (
				<>
					<GoogleMark />
					<span>{label}</span>
				</>
			)}
		</button>
	);
}

function GoogleMark() {
	return (
		<svg viewBox="0 0 18 18" className="size-5 shrink-0" aria-hidden="true">
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
