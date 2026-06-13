import { type ComponentType, type SVGProps, useMemo } from "react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
	CalendarDays,
	Database,
	FolderClosed,
	Inbox,
	Search,
	Sparkles,
	Video,
} from "lucide-react";

import { cn } from "@/lib/utils";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetDescription,
} from "@/components/ui/sheet";
import { Logo } from "@/shared/components/Logo";
import { LanguageSwitcher } from "@/shared/components/LanguageSwitcher";
import { ThemeToggle } from "@/shared/components/ThemeToggle";
import { UserMenu } from "@/shared/layout/UserMenu";
import { useCommandPalette } from "@/shared/layout/command-palette-store";
import { useLanguage } from "@/shared/i18n/LanguageProvider";

type NavItem = {
	to: string;
	label: string;
	icon: ComponentType<SVGProps<SVGSVGElement>>;
	end?: boolean;
	accent?: "ai";
};

type MobileNavSheetProps = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
};

export function MobileNavSheet({ open, onOpenChange }: MobileNavSheetProps) {
	const { t } = useTranslation();
	const { isRtl } = useLanguage();
	const openCommandPalette = useCommandPalette((s) => s.open);

	const navItems: NavItem[] = useMemo(
		() => [
			{ to: "/app", label: t("nav.files"), icon: FolderClosed, end: true },
			{ to: "/app/meeting", label: t("nav.meeting"), icon: Video },
			{ to: "/app/calendar", label: t("nav.calendar"), icon: CalendarDays },
			{ to: "/app/chat", label: t("nav.chat"), icon: Sparkles, accent: "ai" },
			{ to: "/app/rag", label: t("nav.rag"), icon: Database },
			{ to: "/app/gmail", label: t("nav.gmail"), icon: Inbox },
		],
		[t],
	);

	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent
				side={isRtl ? "right" : "left"}
				className="w-[18rem] max-w-[85vw] bg-sidebar text-sidebar-foreground border-e border-border p-0 flex flex-col"
			>
				<SheetHeader className="px-4 pt-4 pb-2">
					<SheetTitle className="sr-only">{t("brand.name")}</SheetTitle>
					<SheetDescription className="sr-only">
						{t("brand.tagline")}
					</SheetDescription>
					<div className="flex items-center gap-2">
						<Logo variant="full" />
					</div>
				</SheetHeader>

				{/* Search trigger */}
				<button
					type="button"
					onClick={() => {
						onOpenChange(false);
						openCommandPalette();
					}}
					className={cn(
						"mx-4 mt-2 inline-flex items-center gap-2.5",
						"h-10 px-3 rounded-[var(--radius-md)]",
						"border border-border bg-surface-muted/60",
						"text-[0.8125rem] text-muted-foreground text-start",
						"hover:bg-accent hover:text-foreground transition-colors",
					)}
				>
					<Search className="size-3.5 shrink-0" strokeWidth={1.6} />
					<span className="flex-1">{t("actions.search")}</span>
				</button>

				{/* Nav */}
				<nav
					aria-label={t("nav.home")}
					className="mt-3 px-3 flex flex-col gap-0.5 flex-1 overflow-y-auto"
				>
					{navItems.map((item) => (
						<NavLink
							key={item.to}
							to={item.to}
							end={item.end}
							className={({ isActive }) =>
								cn(
									"inline-flex items-center gap-3",
									"h-11 px-3 rounded-[var(--radius-md)]",
									"text-[0.9375rem] font-medium",
									"transition-colors",
									isActive
										? "bg-sidebar-accent text-sidebar-accent-foreground"
										: "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground",
								)
							}
						>
							<item.icon
								className={cn(
									"size-4 shrink-0",
									item.accent === "ai" && "text-ai",
								)}
								strokeWidth={1.6}
							/>
							<span className="truncate">{item.label}</span>
						</NavLink>
					))}
				</nav>

				{/* Footer */}
				<div className="border-t border-border p-3 flex flex-col gap-2">
					<div className="flex items-center gap-2 px-2">
						<LanguageSwitcher />
						<ThemeToggle />
					</div>
					<UserMenu />
				</div>
			</SheetContent>
		</Sheet>
	);
}
