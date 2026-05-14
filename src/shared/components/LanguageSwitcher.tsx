import { useTranslation } from "react-i18next";
import { Languages } from "lucide-react";

import { useLanguage } from "@/shared/i18n/LanguageProvider";
import { type Language } from "@/shared/i18n";
import { cn } from "@/lib/utils";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type LanguageSwitcherProps = {
	className?: string;
	variant?: "icon" | "inline";
};

const LANGUAGE_LABELS: Record<Language, { label: string; native: string }> = {
	en: { label: "English", native: "English" },
	ar: { label: "Arabic", native: "العربية" },
};

export function LanguageSwitcher({
	className,
	variant = "icon",
}: LanguageSwitcherProps) {
	const { t } = useTranslation();
	const { language, supportedLanguages, setLanguage } = useLanguage();
	const current = LANGUAGE_LABELS[language];

	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				aria-label={t("language.label")}
				className={cn(
					"inline-flex items-center gap-2 rounded-full border border-border bg-surface-muted px-3 h-9",
					"text-[0.8125rem] font-medium text-foreground",
					"hover:bg-accent transition-colors duration-[var(--duration-fast)] ease-[cubic-bezier(0.32,0.72,0,1)]",
					"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
					variant === "icon" && "size-9 p-0 justify-center",
					className,
				)}
			>
				<Languages className="size-3.5" strokeWidth={1.6} />
				{variant === "inline" ? <span>{current.native}</span> : null}
			</DropdownMenuTrigger>
			<DropdownMenuContent
				align="end"
				className="min-w-[10rem] rounded-[var(--radius-lg)] border-border bg-popover"
			>
				<DropdownMenuLabel className="text-[0.6875rem] uppercase tracking-[0.16em] text-muted-foreground">
					{t("language.label")}
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				{supportedLanguages.map((code) => {
					const entry = LANGUAGE_LABELS[code];
					const active = code === language;
					return (
						<DropdownMenuItem
							key={code}
							onSelect={(event) => {
								event.preventDefault();
								setLanguage(code);
							}}
							className={cn(
								"flex items-center justify-between gap-3 cursor-pointer",
								active && "bg-accent text-accent-foreground",
							)}
						>
							<span className="font-medium">{entry.native}</span>
							<span className="text-[0.6875rem] uppercase tracking-[0.14em] text-muted-foreground">
								{code}
							</span>
						</DropdownMenuItem>
					);
				})}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
