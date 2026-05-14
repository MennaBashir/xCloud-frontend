import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Bell } from "lucide-react";

import { cn } from "@/lib/utils";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { AnimatedNumber } from "@/shared/components/AnimatedNumber";
import { useNotifications } from "../hooks/useNotifications";
import {
	selectNotifications,
	selectUnreadCount,
	useNotificationsStore,
} from "../store/notificationsStore";
import { NotificationsPopoverPanel } from "./NotificationsPopover";

type NotificationsBellProps = {
	className?: string;
	variant?: "sidebar" | "mobile";
};

/**
 * Floating bell button with unread count badge. Opens a popover panel.
 * Use `variant="sidebar"` for the desktop sidebar placement and
 * `variant="mobile"` for the mobile top bar (slightly larger touch target).
 */
export function NotificationsBell({
	className,
	variant = "sidebar",
}: NotificationsBellProps) {
	const { t } = useTranslation("notifications");
	const [open, setOpen] = useState(false);
	const { markRead, markAllRead, dismiss } = useNotifications();
	const notifications = useNotificationsStore(selectNotifications);
	const unread = useNotificationsStore(selectUnreadCount);

	const triggerSize = variant === "mobile" ? "size-10" : "size-9";

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<button
					type="button"
					aria-label={t("bell.open")}
					className={cn(
						"relative inline-grid place-items-center rounded-full",
						"border border-border bg-surface-muted text-foreground",
						"hover:bg-accent transition-[background-color,border-color] duration-[var(--duration-fast)] ease-[cubic-bezier(0.32,0.72,0,1)]",
						"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-sidebar",
						"active:scale-[0.96]",
						triggerSize,
						className,
					)}
				>
					<Bell className="size-4" strokeWidth={1.6} />
					{unread > 0 ? (
						<span
							aria-hidden="true"
							className={cn(
								"absolute -top-0.5 -end-0.5 inline-flex items-center justify-center",
								"min-w-[1.125rem] h-[1.125rem] px-1 rounded-full",
								"bg-destructive text-destructive-foreground",
								"text-[0.625rem] font-medium",
								"ring-2 ring-sidebar",
							)}
						>
							<AnimatedNumber
								value={unread}
								cap={{ at: 9, label: "9+" }}
								className="font-mono tabular-nums text-[0.625rem]"
							/>
						</span>
					) : null}
				</button>
			</PopoverTrigger>
			<PopoverContent
				align="end"
				sideOffset={8}
				className="w-[22rem] max-w-[calc(100vw-1.5rem)] p-0 rounded-[var(--radius-2xl)] border-border bg-popover"
			>
				<NotificationsPopoverPanel
					notifications={notifications}
					onSelect={() => setOpen(false)}
					onMarkRead={markRead}
					onMarkAllRead={markAllRead}
					onDismiss={dismiss}
					onClose={() => setOpen(false)}
				/>
			</PopoverContent>
		</Popover>
	);
}
