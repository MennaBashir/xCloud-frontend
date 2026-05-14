import { useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { BellOff, CheckCheck } from "lucide-react";

import { PageHeader, EmptyState } from "@/shared/components";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useListReveal } from "@/shared/hooks/useListReveal";

import { NotificationItem } from "../components/NotificationItem";
import { useNotifications } from "../hooks/useNotifications";
import {
	selectLoading,
	selectNotifications,
	selectUnreadCount,
	useNotificationsStore,
} from "../store/notificationsStore";
import type {
	Notification,
	NotificationFilter,
} from "../types/notification";

const FILTER_KEYS: Array<{
	value: NotificationFilter;
	labelKey: string;
}> = [
	{ value: "all", labelKey: "filters.all" },
	{ value: "unread", labelKey: "filters.unread" },
	{ value: "task", labelKey: "filters.tasks" },
	{ value: "meeting", labelKey: "filters.meetings" },
	{ value: "decision", labelKey: "filters.decisions" },
	{ value: "mention", labelKey: "filters.mentions" },
	{ value: "system", labelKey: "filters.system" },
];

type Group = {
	titleKey: string;
	items: Notification[];
};

function startOfDay(date: Date): Date {
	const d = new Date(date);
	d.setHours(0, 0, 0, 0);
	return d;
}

function groupByDate(items: Notification[]): Group[] {
	if (items.length === 0) return [];
	const now = startOfDay(new Date());
	const startOfWeek = new Date(now);
	startOfWeek.setDate(startOfWeek.getDate() - 7);

	const today: Notification[] = [];
	const week: Notification[] = [];
	const earlier: Notification[] = [];

	for (const n of items) {
		const t = new Date(n.createdAt);
		if (t >= now) today.push(n);
		else if (t >= startOfWeek) week.push(n);
		else earlier.push(n);
	}

	const groups: Group[] = [];
	if (today.length > 0) groups.push({ titleKey: "groups.today", items: today });
	if (week.length > 0) groups.push({ titleKey: "groups.thisWeek", items: week });
	if (earlier.length > 0)
		groups.push({ titleKey: "groups.earlier", items: earlier });
	return groups;
}

function applyFilter(
	items: readonly Notification[],
	filter: NotificationFilter,
): Notification[] {
	switch (filter) {
		case "all":
			return items.slice();
		case "unread":
			return items.filter((n) => !n.read);
		default:
			return items.filter((n) => n.kind === filter);
	}
}

export default function NotificationsPage() {
	const { t } = useTranslation("notifications");
	const notifications = useNotificationsStore(selectNotifications);
	const loading = useNotificationsStore(selectLoading);
	const unread = useNotificationsStore(selectUnreadCount);
	const { markRead, markAllRead, dismiss } = useNotifications();
	const [filter, setFilter] = useState<NotificationFilter>("all");

	const filtered = useMemo(
		() => applyFilter(notifications, filter),
		[notifications, filter],
	);
	const groups = useMemo(() => groupByDate(filtered), [filtered]);

	const listScope = useRef<HTMLDivElement>(null);
	useListReveal(listScope, { deps: [filter, groups.length, loading] });

	return (
		<div ref={listScope} className="w-full px-4 sm:px-6 lg:px-8 pb-10">
			<PageHeader
				eyebrow={t("title")}
				title={t("title")}
				description={t("subtitle")}
				actions={
					unread > 0 ? (
						<Button
							size="sm"
							variant="outline"
							onClick={() => markAllRead()}
							className="gap-2"
						>
							<CheckCheck className="size-3.5" strokeWidth={1.6} />
							<span>{t("actions.markAllRead")}</span>
						</Button>
					) : null
				}
			/>

			{/* Filter pills */}
			<div
				role="tablist"
				aria-label={t("title")}
				data-stagger="1"
				className="flex items-center gap-1.5 overflow-x-auto -mx-2 px-2 pb-3"
			>
				{FILTER_KEYS.map((f) => {
					const active = filter === f.value;
					return (
						<button
							key={f.value}
							role="tab"
							type="button"
							aria-selected={active}
							onClick={() => setFilter(f.value)}
							className={cn(
								"shrink-0 inline-flex items-center h-8 px-3 rounded-full",
								"text-[0.8125rem] font-medium",
								"transition-[background-color,color,border-color] duration-[var(--duration-fast)] ease-[cubic-bezier(0.32,0.72,0,1)]",
								"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
								active
									? "bg-foreground text-background"
									: "text-muted-foreground hover:bg-accent hover:text-foreground border border-transparent hover:border-border",
							)}
						>
							{t(f.labelKey)}
						</button>
					);
				})}
			</div>

			{/* Body */}
			<div data-stagger="2" className="mt-2">
				{loading ? (
					<SkeletonList />
				) : groups.length === 0 ? (
					<EmptyState
						icon={BellOff}
						title={t("empty.title")}
						description={t("empty.description")}
					/>
				) : (
					<div className="flex flex-col gap-7">
						{groups.map((group) => (
							<section
								key={group.titleKey}
								className="flex flex-col gap-2"
							>
								<div className="text-[0.6875rem] font-medium uppercase tracking-[0.18em] text-muted-foreground px-1">
									{t(group.titleKey)}
								</div>
								<div className="rounded-[var(--radius-2xl)] border border-border bg-card overflow-hidden divide-y divide-border">
									{group.items.map((n) => (
										<NotificationItem
											key={n.id}
											notification={n}
											onMarkRead={markRead}
											onDismiss={dismiss}
										/>
									))}
								</div>
							</section>
						))}
					</div>
				)}
			</div>
		</div>
	);
}

function SkeletonList() {
	return (
		<div className="flex flex-col gap-2 rounded-[var(--radius-2xl)] border border-border bg-card p-2">
			{Array.from({ length: 6 }).map((_, i) => (
				<div
					key={i}
					className="flex items-start gap-3 px-3.5 py-3 rounded-[var(--radius-md)]"
				>
					<Skeleton className="size-9 rounded-[var(--radius-md)]" />
					<div className="flex-1 flex flex-col gap-2">
						<div className="flex items-center justify-between gap-2">
							<Skeleton className="h-3.5 w-2/5" />
							<Skeleton className="h-2.5 w-8" />
						</div>
						<Skeleton className="h-3 w-3/4" />
						<Skeleton className="h-2.5 w-1/3" />
					</div>
				</div>
			))}
		</div>
	);
}
