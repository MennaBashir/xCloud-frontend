import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ArrowUpRight, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { useLanguage } from "@/shared/i18n/LanguageProvider";

import { KIND_META, shortTime, toneClasses } from "./notification-meta";
import type { Notification } from "../types/notification";

type NotificationItemProps = {
	notification: Notification;
	onSelect?: (n: Notification) => void;
	onMarkRead?: (id: string) => void;
	onDismiss?: (id: string) => void;
	className?: string;
	compact?: boolean;
};

export function NotificationItem({
	notification,
	onSelect,
	onMarkRead,
	onDismiss,
	className,
	compact = false,
}: NotificationItemProps) {
	const { t } = useTranslation("notifications");
	const { language } = useLanguage();
	const navigate = useNavigate();
	const meta = KIND_META[notification.kind];
	const Icon = meta.icon;

	const handleActivate = () => {
		if (!notification.read) onMarkRead?.(notification.id);
		onSelect?.(notification);
		if (notification.ctaHref) {
			navigate(notification.ctaHref);
		}
	};

	return (
		<div
			role="button"
			data-list-item
			tabIndex={0}
			onClick={handleActivate}
			onKeyDown={(e) => {
				if (e.key === "Enter" || e.key === " ") {
					e.preventDefault();
					handleActivate();
				}
			}}
			className={cn(
				"group/notif relative flex items-start gap-3",
				"px-3.5 py-3 rounded-[var(--radius-md)] cursor-pointer",
				"border border-transparent",
				"transition-[background-color,border-color] duration-[var(--duration-fast)] ease-[cubic-bezier(0.32,0.72,0,1)]",
				"hover:bg-accent/40",
				"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
				!notification.read && "bg-card",
				className,
			)}
		>
			{/* Unread indicator bar */}
			{!notification.read ? (
				<span
					aria-hidden="true"
					className="absolute start-0 top-1/2 -translate-y-1/2 h-6 w-[2px] rounded-full bg-ai"
				/>
			) : null}

			{/* Kind icon */}
			<span
				className={cn(
					"inline-grid place-items-center shrink-0",
					"size-9 rounded-[var(--radius-md)] ring-1 ring-inset",
					toneClasses(meta.tone),
					// Subtle living pulse for AI-derived items so they feel "fresh"
					meta.tone === "ai" && !notification.read && "ambient-pulse",
				)}
			>
				<Icon className="size-4" strokeWidth={1.6} />
			</span>

			{/* Body */}
			<div className="flex-1 min-w-0">
				<div className="flex items-start justify-between gap-2">
					<div className="flex flex-col min-w-0 flex-1">
						<span
							className={cn(
								"text-[0.875rem] leading-tight truncate",
								!notification.read
									? "font-semibold text-foreground"
									: "text-foreground/85",
							)}
						>
							{notification.title}
						</span>
						{!compact ? (
							<span className="mt-0.5 text-[0.8125rem] text-muted-foreground leading-relaxed line-clamp-2">
								{notification.body}
							</span>
						) : null}
					</div>
					<span className="font-mono text-[0.6875rem] text-muted-foreground tabular-nums shrink-0 mt-0.5">
						{shortTime(notification.createdAt, language)}
					</span>
				</div>

				{notification.actor || notification.ctaLabel ? (
					<div className="mt-2 flex items-center gap-2 flex-wrap">
						{notification.actor ? (
							<span className="inline-flex items-center text-[0.6875rem] text-muted-foreground">
								<span className="font-medium text-foreground/80">
									{notification.actor.name}
								</span>
								<span className="mx-1.5 text-border" aria-hidden="true">
									·
								</span>
								<span className="uppercase tracking-[0.14em]">
									{t(`kinds.${notification.kind}`)}
								</span>
							</span>
						) : null}

						{notification.ctaLabel ? (
							<span
								className={cn(
									"ms-auto inline-flex items-center gap-1.5",
									"text-[0.75rem] font-medium text-foreground",
									"transition-transform duration-[var(--duration-fast)]",
									"group-hover/notif:translate-x-0.5",
								)}
							>
								<span>{notification.ctaLabel}</span>
								<ArrowUpRight
									className="size-3 rtl-flip"
									strokeWidth={1.8}
								/>
							</span>
						) : null}
					</div>
				) : null}
			</div>

			{/* Dismiss */}
			{onDismiss ? (
				<button
					type="button"
					onClick={(e) => {
						e.stopPropagation();
						onDismiss(notification.id);
					}}
					aria-label={t("actions.dismiss")}
					className={cn(
						"absolute end-2 top-2 grid size-6 place-items-center rounded-full",
						"text-muted-foreground opacity-0 group-hover/notif:opacity-100",
						"hover:bg-accent hover:text-foreground transition-all",
						"focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
					)}
				>
					<X className="size-3" strokeWidth={1.8} />
				</button>
			) : null}
		</div>
	);
}
