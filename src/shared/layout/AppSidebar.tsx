import { type ComponentType, type SVGProps, useMemo } from "react";
import { NavLink, Link } from "react-router-dom";
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
import { Logo } from "@/shared/components/Logo";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { UserMenu } from "@/shared/layout/UserMenu";
import { useCommandPalette } from "@/shared/layout/command-palette-store";
import { NotificationsBell } from "@/features/notifications/components/NotificationsBell";

type NavItem = {
	to: string;
	label: string;
	icon: ComponentType<SVGProps<SVGSVGElement>>;
	end?: boolean;
	accent?: "ai";
};

type AppSidebarProps = {
	className?: string;
	/** Optional: pass through if the parent wants to render a custom trigger near the rail. */
	onSearchClick?: () => void;
};

export function AppSidebar({ className, onSearchClick }: AppSidebarProps) {
	const { t } = useTranslation();
	const openCommandPalette = useCommandPalette((s) => s.open);

	const navItems: NavItem[] = useMemo(
		() => [
			{ to: "/app", label: t("nav.files"), icon: FolderClosed, end: true },
			{ to: "/app/meeting", label: t("nav.meeting"), icon: Video },
			{ to: "/app/calendar", label: t("nav.calendar"), icon: CalendarDays },
			{ to: "/app/rag", label: t("nav.rag"), icon: Database },
			{ to: "/app/chat", label: t("nav.chat"), icon: Sparkles, accent: "ai" },
			{ to: "/app/gmail", label: t("nav.gmail"), icon: Inbox },
		],
		[t],
	);

	const handleSearch = () => {
		if (onSearchClick) {
			onSearchClick();
			return;
		}
		openCommandPalette();
	};

	return (
		<aside
			data-slot="app-sidebar"
			className={cn(
				// fixed left rail on lg+, hidden under lg (mobile sheet handles that)
				"hidden lg:flex",
				"h-[100dvh] sticky top-0 shrink-0",
				"w-[260px] xl:w-[280px]",
				"flex-col gap-2",
				"border-e border-border bg-sidebar text-sidebar-foreground",
				"px-3 py-4",
				className,
			)}
		>
			{/* Logo — links to landing for an easy way out */}
			<div className="px-2 py-1">
				<Link
					to="/"
					className="inline-flex items-center gap-2 rounded-[var(--radius-md)] px-1 py-1 -mx-1 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-sidebar"
					aria-label={t("brand.name")}
				>
					<Logo variant="full" />
				</Link>
			</div>

			{/* Search trigger + notifications bell */}
			<div className="mt-2 flex items-center gap-2">
				<button
					type="button"
					onClick={handleSearch}
					className={cn(
						"group/search inline-flex items-center gap-2.5 flex-1 min-w-0",
						"h-9 px-3 rounded-[var(--radius-md)]",
						"border border-border bg-surface-muted/60",
						"text-[0.8125rem] text-muted-foreground",
						"transition-[background-color,border-color,color] duration-[var(--duration-fast)] ease-[cubic-bezier(0.32,0.72,0,1)]",
						"hover:bg-accent hover:text-foreground hover:border-border-strong",
						"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-sidebar",
					)}
				>
					<Search className="size-3.5 shrink-0" strokeWidth={1.6} />
					<span className="flex-1 text-start truncate">
						{t("actions.search")}
					</span>
					<kbd className="hidden xs:inline-flex items-center gap-0.5 rounded-sm border border-border bg-card px-1.5 h-5 text-[0.6875rem] font-mono text-muted-foreground">
						<span aria-hidden="true">⌘</span>K
					</kbd>
				</button>
				<NotificationsBell />
			</div>

			{/* Primary nav */}
			<TooltipProvider delayDuration={200}>
				<nav
					aria-label={t("nav.home")}
					className="mt-3 flex flex-col gap-0.5"
				>
					{navItems.map((item) => (
						<SidebarNavItem key={item.to} item={item} />
					))}
				</nav>
			</TooltipProvider>

			{/* Footer (user menu) */}
			<div className="mt-auto flex flex-col gap-2 pt-2 border-t border-border">
				<UserMenu />
			</div>
		</aside>
	);
}

function SidebarNavItem({ item }: { item: NavItem }) {
	return (
		<NavLink
			to={item.to}
			end={item.end}
			className={({ isActive }) =>
				cn(
					"group/nav relative inline-flex items-center gap-2.5",
					"h-9 px-3 rounded-[var(--radius-md)]",
					"text-[0.875rem] font-medium",
					"transition-[background-color,color] duration-[var(--duration-fast)] ease-[cubic-bezier(0.32,0.72,0,1)]",
					"outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-sidebar",
					isActive
						? "bg-sidebar-accent text-sidebar-accent-foreground"
						: "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground",
				)
			}
		>
			{({ isActive }) => (
				<>
					{isActive ? (
						<span
							aria-hidden="true"
							className="absolute start-0 top-1.5 bottom-1.5 w-[2px] rounded-full bg-foreground"
						/>
					) : null}
					<item.icon
						className={cn(
							"size-4 shrink-0",
							item.accent === "ai" && !isActive && "text-ai",
						)}
						strokeWidth={1.6}
					/>
					<span className="truncate">{item.label}</span>
				</>
			)}
		</NavLink>
	);
}

/**
 * Mobile floating header — visible only under lg.
 * Shows logo + a Sheet trigger button (the sheet itself is in AppLayout).
 */
type AppSidebarMobileTopProps = {
	onMenuClick: () => void;
};

export function AppSidebarMobileTop({ onMenuClick }: AppSidebarMobileTopProps) {
	const { t } = useTranslation();
	return (
		<div className="lg:hidden sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur-md">
			<div className="container mx-auto flex h-14 items-center justify-between gap-3 px-4">
				<Link
					to="/"
					className="inline-flex items-center gap-2"
					aria-label={t("brand.name")}
				>
					<Logo variant="full" />
				</Link>
				<div className="flex items-center gap-2">
					<NotificationsBell variant="mobile" />
					<button
						type="button"
						onClick={onMenuClick}
						aria-label={t("actions.search")}
						className="inline-flex size-10 items-center justify-center rounded-full border border-border bg-surface-muted text-foreground hover:bg-accent transition-colors"
					>
						<MenuIcon />
					</button>
				</div>
			</div>
		</div>
	);
}

function MenuIcon() {
	return (
		<svg
			width={16}
			height={16}
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={1.6}
			strokeLinecap="round"
			aria-hidden="true"
		>
			<path d="M4 7h16M4 12h16M4 17h16" />
		</svg>
	);
}

/**
 * Tooltip primitive helper for icon-collapsed mode (used in the future
 * if we add a fully icon-only collapse). Exposed so future code can
 * wrap NavLink children.
 */
export function NavTooltip({
	label,
	children,
}: {
	label: string;
	children: React.ReactNode;
}) {
	return (
		<Tooltip>
			<TooltipTrigger asChild>{children}</TooltipTrigger>
			<TooltipContent side="right" sideOffset={8}>
				{label}
			</TooltipContent>
		</Tooltip>
	);
}
