import { useRef } from "react";
import { useTranslation } from "react-i18next";

import {
	CalendarView,
	EventsList,
	ResponsiveModal,
} from "@/features/calendar/components";
import { PageHeader } from "@/shared/components";
import { useListReveal } from "@/shared/hooks/useListReveal";

const CalendarPage = () => {
	const { t } = useTranslation("calendar");
	const scope = useRef<HTMLDivElement>(null);
	useListReveal(scope, { deps: [] });

	return (
		<div ref={scope} className="w-full px-4 sm:px-6 lg:px-8 pb-10">
			<PageHeader
				eyebrow={t("title")}
				title={t("title")}
				description={t("subtitle")}
			/>
			<div
				data-stagger="1"
				className="relative flex items-start gap-6 lg:gap-8"
			>
				<CalendarView />
				<ResponsiveModal>
					<EventsList />
				</ResponsiveModal>
			</div>
		</div>
	);
};

export default CalendarPage;
