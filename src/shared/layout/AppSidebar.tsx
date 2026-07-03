import { type ComponentType, type SVGProps, useMemo } from "react";
import { NavLink, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
	CalendarDays,
	Database,
	FolderClosed,
	Inbox,
	PanelLeftClose,
	PanelLeftOpen,
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
import { useSidebar } from "@/shared/layout/sidebar-store";
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
	const collapsed = useSidebar((s) => s.collapsed);
	const toggleSidebar = useSidebar((s) => s.toggle);

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
		<TooltipProvider delayDuration={200}>
			<aside
				data-slot="app-sidebar"
				data-collapsed={collapsed ? "true" : "false"}
				className={cn(
					// fixed left rail on lg+, hidden under lg (mobile sheet handles that)
					"hidden lg:flex",
					"h-[100dvh] sticky top-0 shrink-0",
					collapsed ? "w-[72px]" : "w-[260px] xl:w-[280px]",
					"transition-[width] duration-[var(--duration-base)] ease-[cubic-bezier(0.32,0.72,0,1)]",
					"flex-col gap-2",
					"border-e border-border bg-sidebar text-sidebar-foreground",
					"px-3 py-4",
					className,
				)}
			>
				{/* Logo + collapse toggle */}
				<div
					className={cn(
						"flex items-center gap-1",
						collapsed ? "flex-col" : "justify-between px-1",
					)}
				>
					{!collapsed ? (
						<Link
							to="/"
							className="inline-flex items-center gap-2 rounded-[var(--radius-md)] px-1 py-1 -mx-1 outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-sidebar"
							aria-label={t("brand.name")}
						>
							<Logo variant="full" />
						</Link>
					) : (
						<Link
							to="/"
							className="inline-flex items-center justify-center rounded-[var(--radius-md)] outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-sidebar"
							aria-label={t("brand.name")}
						>
							<Logo variant="icon" className="size-7" />
						</Link>
					)}

					<Tooltip>
						<TooltipTrigger asChild>
							<button
								type="button"
								onClick={toggleSidebar}
								aria-label={
									collapsed
										? t("actions.expandSidebar")
										: t("actions.collapseSidebar")
								}
								aria-expanded={!collapsed}
								className={cn(
									"inline-flex items-center justify-center size-8 shrink-0 rounded-[var(--radius-md)]",
									"text-muted-foreground hover:text-foreground hover:bg-sidebar-accent",
									"transition-colors duration-[var(--duration-fast)] ease-[cubic-bezier(0.32,0.72,0,1)]",
									"outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-sidebar",
								)}
							>
								{collapsed ? (
									<PanelLeftOpen
										className="size-4 rtl-flip"
										strokeWidth={1.6}
									/>
								) : (
									<PanelLeftClose
										className="size-4 rtl-flip"
										strokeWidth={1.6}
									/>
								)}
							</button>
						</TooltipTrigger>
						<TooltipContent side="right" sideOffset={8}>
							{collapsed
								? t("actions.expandSidebar")
								: t("actions.collapseSidebar")}
						</TooltipContent>
					</Tooltip>
				</div>

				{/* Search trigger + notifications bell */}
				<div
					className={cn(
						"mt-2 flex items-center gap-2",
						collapsed && "flex-col gap-1.5",
					)}
				>
					{collapsed ? (
						<Tooltip>
							<TooltipTrigger asChild>
								<button
									type="button"
									onClick={handleSearch}
									aria-label={t("actions.search")}
									className={cn(
										"inline-flex items-center justify-center size-11",
										"rounded-[var(--radius-lg)] border border-border bg-surface-muted/60 text-muted-foreground",
										"transition-colors duration-[var(--duration-fast)] ease-[cubic-bezier(0.32,0.72,0,1)]",
										"hover:bg-accent hover:text-foreground hover:border-border-strong",
										"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-sidebar",
									)}
								>
									<Search className="size-[1.375rem]" strokeWidth={1.8} />
								</button>
							</TooltipTrigger>
							<TooltipContent side="right" sideOffset={8}>
								{t("actions.search")}
							</TooltipContent>
						</Tooltip>
					) : (
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
					)}
					<NotificationsBell />
				</div>

				{/* Primary nav */}
				<nav
					aria-label={t("nav.home")}
					className={cn(
						"mt-3 flex flex-col",
						collapsed ? "gap-1.5 items-center" : "gap-0.5",
					)}
				>
					{navItems.map((item) => (
						<SidebarNavItem
							key={item.to}
							item={item}
							collapsed={collapsed}
						/>
					))}
				</nav>

				{/* Footer (user menu) */}
				<div className="mt-auto flex flex-col gap-2 pt-2 border-t border-border">
					<UserMenu collapsed={collapsed} />
				</div>
			</aside>
		</TooltipProvider>
	);
}

function SidebarNavItem({
	item,
	collapsed,
}: {
	item: NavItem;
	collapsed: boolean;
}) {
	const link = (
		<NavLink
			to={item.to}
			end={item.end}
			aria-label={collapsed ? item.label : undefined}
			className={({ isActive }) =>
				cn(
					"group/nav relative inline-flex items-center",
					collapsed
						? "size-11 justify-center rounded-[var(--radius-lg)]"
						: "gap-2.5 h-9 px-3 rounded-[var(--radius-md)]",
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
							className={cn(
								"absolute rounded-full bg-foreground",
								collapsed
									? "start-0 top-1/2 -translate-y-1/2 h-6 w-[3px]"
									: "start-0 top-1.5 bottom-1.5 w-[2px]",
							)}
						/>
					) : null}
					<item.icon
						className={cn(
							"shrink-0",
							collapsed ? "size-[1.375rem]" : "size-4",
							item.accent === "ai" && !isActive && "text-ai",
						)}
						strokeWidth={collapsed ? 1.8 : 1.6}
					/>
					{!collapsed ? (
						<span className="truncate">{item.label}</span>
					) : null}
				</>
			)}
		</NavLink>
	);

	if (!collapsed) return link;

	return (
		<Tooltip>
			<TooltipTrigger asChild>{link}</TooltipTrigger>
			<TooltipContent side="right" sideOffset={8}>
				{item.label}
			</TooltipContent>
		</Tooltip>
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
