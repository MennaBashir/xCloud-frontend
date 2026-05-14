import { Toaster as SonnerToaster, type ToasterProps } from "sonner";

import { useTheme } from "@/shared/theme/ThemeProvider";

function Toaster(props: ToasterProps) {
	const { resolvedTheme } = useTheme();

	return (
		<SonnerToaster
			theme={resolvedTheme}
			position="bottom-right"
			expand={false}
			richColors={false}
			closeButton={false}
			gap={10}
			offset={20}
			toastOptions={{
				classNames: {
					toast: [
						"group/toast pointer-events-auto",
						"flex items-center gap-3",
						"rounded-[var(--radius-lg)] border border-border bg-card",
						"px-4 py-3.5 text-foreground",
						"shadow-[0_1px_2px_oklch(0_0_0/0.04),0_12px_24px_-12px_oklch(0_0_0/0.12)]",
					].join(" "),
					title: "text-[0.9375rem] font-medium tracking-tight",
					description: "text-[0.8125rem] text-muted-foreground leading-relaxed",
					actionButton:
						"rounded-[var(--radius-sm)] bg-primary text-primary-foreground px-2.5 py-1 text-[0.8125rem]",
					cancelButton:
						"rounded-[var(--radius-sm)] bg-secondary text-secondary-foreground px-2.5 py-1 text-[0.8125rem]",
					closeButton:
						"rounded-full size-5 border border-border bg-card text-muted-foreground hover:text-foreground",
					success:
						"!border-success/30 [&_[data-icon]_svg]:!text-success",
					error:
						"!border-destructive/30 [&_[data-icon]_svg]:!text-destructive",
					warning:
						"!border-warning/30 [&_[data-icon]_svg]:!text-warning",
					info: "!border-ai/30 [&_[data-icon]_svg]:!text-ai",
				},
			}}
			{...props}
		/>
	);
}

export { Toaster };
