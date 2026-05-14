import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { CalendarCheck } from "lucide-react";

import { cn } from "@/lib/utils";
import { EmptyState } from "@/shared/components";
import useCalendarEvents from "@/features/calendar/hooks/useCalendarEvents";
import { EventListItem } from "@/features/calendar/components";
import type { CalendarEvent } from "@/features/calendar/types";

type Group = {
	titleKey: string;
	events: CalendarEvent[];
};

function startOfDay(date: Date): Date {
	const d = new Date(date);
	d.setHours(0, 0, 0, 0);
	return d;
}

function groupEvents(events: CalendarEvent[] | undefined): Group[] {
	if (!events || events.length === 0) return [];

	const now = startOfDay(new Date());
	const endOfToday = new Date(now);
	endOfToday.setDate(endOfToday.getDate() + 1);
	const endOfWeek = new Date(now);
	endOfWeek.setDate(endOfWeek.getDate() + 7);

	const today: CalendarEvent[] = [];
	const week: CalendarEvent[] = [];
	const later: CalendarEvent[] = [];

	const sorted = [...events].sort((a, b) => {
		const da = new Date(a.start).getTime();
		const db = new Date(b.start).getTime();
		return da - db;
	});

	for (const e of sorted) {
		const start = new Date(e.start);
		if (start < endOfToday) today.push(e);
		else if (start < endOfWeek) week.push(e);
		else later.push(e);
	}

	const groups: Group[] = [];
	if (today.length > 0)
		groups.push({ titleKey: "upcoming.today", events: today });
	if (week.length > 0)
		groups.push({ titleKey: "upcoming.thisWeek", events: week });
	if (later.length > 0)
		groups.push({ titleKey: "upcoming.later", events: later });
	return groups;
}

const EventsList = () => {
	const { t } = useTranslation("calendar");
	const { events, toggleDone } = useCalendarEvents();
	const groups = useMemo(() => groupEvents(events), [events]);

	const hasEvents = groups.length > 0;

	return (
		<aside
			className={cn(
				"w-[280px] md:w-[320px] lg:w-[340px] shrink-0",
				"h-[calc(100dvh-12rem)] max-h-[680px]",
				"rounded-[var(--radius-2xl)] bg-card border border-border overflow-hidden flex flex-col",
				"shadow-[0_1px_2px_oklch(0_0_0/0.04),inset_0_1px_0_oklch(1_0_0/0.05)]",
			)}
		>
			{/* Header — refined, no gradient */}
			<header className="flex-none px-5 py-4 border-b border-border">
				<div className="text-[0.6875rem] font-medium uppercase tracking-[0.18em] text-muted-foreground">
					{t("upcoming.title")}
				</div>
				<p className="mt-1 text-[0.8125rem] text-muted-foreground">
					{t("upcoming.subtitle")}
				</p>
			</header>

			{/* Body */}
			<div className="flex-1 min-h-0 overflow-y-auto px-3 py-3">
				{hasEvents ? (
					<div className="flex flex-col gap-5">
						{groups.map((group) => (
							<section key={group.titleKey} className="flex flex-col gap-2">
								<div className="px-1 text-[0.625rem] font-medium uppercase tracking-[0.16em] text-muted-foreground">
									{t(group.titleKey)}
								</div>
								<div className="flex flex-col gap-2">
									{group.events.map((event) => (
										<EventListItem
											key={event.id}
											event={event}
											toggleDone={toggleDone}
										/>
									))}
								</div>
							</section>
						))}
					</div>
				) : (
					<EmptyState
						icon={CalendarCheck}
						title={t("upcoming.empty")}
						className="border-none bg-transparent"
					/>
				)}
			</div>
		</aside>
	);
};

export default EventsList;
