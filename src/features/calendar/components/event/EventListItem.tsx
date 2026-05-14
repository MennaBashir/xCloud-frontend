import { memo } from "react";
import { useTranslation } from "react-i18next";
import { CalendarDays } from "lucide-react";

import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/shared/i18n/LanguageProvider";
import { getColorName } from "@/features/calendar/lib/colorsUtils";
import type { CalendarEvent } from "@/features/calendar/types";

interface EventListItemProps {
	event: CalendarEvent;
	toggleDone: (id: string) => void;
}

function formatShortDate(date: Date | string, locale: string): string {
	const d = date instanceof Date ? date : new Date(date);
	if (Number.isNaN(d.getTime())) return "—";
	try {
		return new Intl.DateTimeFormat(locale, {
			month: "short",
			day: "numeric",
			year: "numeric",
		}).format(d);
	} catch {
		return d.toLocaleDateString();
	}
}

const EventListItem = memo(({ event, toggleDone }: EventListItemProps) => {
	const { t } = useTranslation("calendar");
	const { language } = useLanguage();
	const { title, start, end, backgroundColor, done } = event;
	const colorLabel = backgroundColor ? getColorName(backgroundColor) : "";

	return (
		<div
			data-list-item
			className={cn(
				"group/event rounded-[var(--radius-lg)] border border-border bg-card p-3.5",
				"transition-[border-color,background-color] duration-[var(--duration-fast)] ease-[cubic-bezier(0.32,0.72,0,1)]",
				"hover:border-border-strong",
				done && "opacity-65",
			)}
		>
			{/* Top row: color dot + title + switch */}
			<div className="flex items-start justify-between gap-3 mb-3">
				<div className="flex items-center gap-2 min-w-0 flex-1">
					<span
						aria-hidden="true"
						className="size-2.5 rounded-full shrink-0 mt-1"
						style={{ backgroundColor }}
					/>
					<p
						className={cn(
							"text-[0.9375rem] font-medium text-foreground leading-tight truncate",
							done && "line-through text-muted-foreground",
						)}
					>
						{title}
					</p>
				</div>
				<Switch
					checked={done || false}
					onCheckedChange={() => toggleDone(event.id)}
					aria-label={t("form.done")}
				/>
			</div>

			{/* Date row */}
			<div className="flex items-center gap-3 text-[0.75rem]">
				<div className="flex items-center gap-1.5 text-muted-foreground">
					<CalendarDays className="size-3.5" strokeWidth={1.6} />
					<span>{formatShortDate(start, language)}</span>
				</div>
				<span className="text-border" aria-hidden="true">
					·
				</span>
				<div className="flex items-center gap-1.5 text-muted-foreground">
					<span>{formatShortDate(end, language)}</span>
				</div>
				{colorLabel ? (
					<>
						<span className="text-border" aria-hidden="true">
							·
						</span>
						<span className="text-muted-foreground">{colorLabel}</span>
					</>
				) : null}
			</div>
		</div>
	);
});

export default EventListItem;
