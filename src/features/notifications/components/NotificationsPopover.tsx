import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ArrowUpRight, BellOff } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import { NotificationItem } from "./NotificationItem";
import type { Notification } from "../types/notification";

type NotificationsPopoverPanelProps = {
	notifications: readonly Notification[];
	onSelect: (n: Notification) => void;
	onMarkRead: (id: string) => void;
	onMarkAllRead: () => void;
	onDismiss: (id: string) => void;
	onClose: () => void;
};

export function NotificationsPopoverPanel({
	notifications,
	onSelect,
	onMarkRead,
	onMarkAllRead,
	onDismiss,
	onClose,
}: NotificationsPopoverPanelProps) {
	const { t } = useTranslation("notifications");
	const navigate = useNavigate();

	const top = notifications.slice(0, 8);
	const empty = top.length === 0;
	const unreadCount = notifications.filter((n) => !n.read).length;

	const handleSelect = (n: Notification) => {
		onSelect(n);
		onClose();
	};

	const handleViewAll = () => {
		onClose();
		navigate("/app/notifications");
	};

	return (
		<div className="flex flex-col max-h-[36rem]">
			{/* Header */}
			<header
				className={cn(
					"flex-none flex items-center justify-between gap-2 px-4 py-3",
					"border-b border-border",
				)}
			>
				<div className="flex flex-col">
					<span className="text-[0.875rem] font-semibold tracking-tight text-foreground">
						{t("title")}
					</span>
					{unreadCount > 0 ? (
						<span className="text-[0.6875rem] text-muted-foreground">
							{t("bell.unread", { count: unreadCount })}
						</span>
					) : null}
				</div>
				{unreadCount > 0 ? (
					<button
						type="button"
						onClick={() => onMarkAllRead()}
						className={cn(
							"text-[0.75rem] font-medium text-muted-foreground",
							"hover:text-foreground transition-colors",
						)}
					>
						{t("actions.markAllRead")}
					</button>
				) : null}
			</header>

			{/* List */}
			<div className="flex-1 min-h-0 overflow-y-auto p-2">
				{empty ? (
					<div className="flex flex-col items-center justify-center text-center py-10 px-6 gap-3">
						<div className="grid size-10 place-items-center rounded-full bg-surface-muted text-muted-foreground ring-1 ring-inset ring-border">
							<BellOff className="size-4" strokeWidth={1.6} />
						</div>
						<div className="flex flex-col gap-1">
							<span className="text-[0.875rem] font-medium text-foreground">
								{t("empty.title")}
							</span>
							<span className="text-[0.75rem] text-muted-foreground leading-relaxed">
								{t("empty.description")}
							</span>
						</div>
					</div>
				) : (
					<div className="flex flex-col gap-0.5">
						{top.map((n) => (
							<NotificationItem
								key={n.id}
								notification={n}
								onSelect={handleSelect}
								onMarkRead={onMarkRead}
								onDismiss={onDismiss}
								compact
							/>
						))}
					</div>
				)}
			</div>

			{/* Footer */}
			<footer className="flex-none border-t border-border p-2">
				<Button
					variant="ghost"
					size="sm"
					className="w-full justify-between gap-2"
					onClick={handleViewAll}
				>
					<span>{t("actions.viewAll")}</span>
					<ArrowUpRight className="size-3.5 rtl-flip" strokeWidth={1.8} />
				</Button>
			</footer>
		</div>
	);
}
