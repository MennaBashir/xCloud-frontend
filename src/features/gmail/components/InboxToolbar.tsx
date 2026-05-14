import { useTranslation } from "react-i18next";
import { Search, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { useGmailStore } from "../store/gmailStore";

export function InboxToolbar() {
	const { t } = useTranslation("gmail");
	const query = useGmailStore((s) => s.query);
	const setQuery = useGmailStore((s) => s.setQuery);

	return (
		<div className="px-3 py-3 border-b border-border">
			<div className="relative">
				<Search
					className="absolute start-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground"
					strokeWidth={1.6}
				/>
				<input
					type="search"
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					placeholder={t("search.placeholder")}
					aria-label={t("search.placeholder")}
					className={cn(
						"w-full h-9 ps-9 pe-9 rounded-full",
						"bg-surface-muted border border-border",
						"text-[0.8125rem] text-foreground placeholder:text-muted-foreground/70",
						"outline-none transition-[border-color,box-shadow] duration-[var(--duration-fast)]",
						"focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30",
					)}
				/>
				{query ? (
					<button
						type="button"
						onClick={() => setQuery("")}
						aria-label="Clear"
						className="absolute end-2 top-1/2 -translate-y-1/2 grid size-6 place-items-center rounded-full text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
					>
						<X className="size-3" strokeWidth={1.6} />
					</button>
				) : null}
			</div>
		</div>
	);
}
