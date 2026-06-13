import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { MessageSquarePlus, Search, Trash2, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useChatStore } from "../store/chatStore";
import { useConversations } from "../hooks/useConversations";
import type { Conversation } from "../types/chat";

type Group = {
	label: string;
	conversations: Conversation[];
};

function groupConversations(conversations: Conversation[]): Group[] {
	if (conversations.length === 0) return [];
	const today: Conversation[] = [];
	const week: Conversation[] = [];
	const older: Conversation[] = [];
	const now = Date.now();
	const DAY = 1000 * 60 * 60 * 24;

	for (const c of conversations) {
		const diff = now - new Date(c.updatedAt).getTime();
		if (diff < DAY) today.push(c);
		else if (diff < DAY * 7) week.push(c);
		else older.push(c);
	}

	const groups: Group[] = [];
	if (today.length > 0) groups.push({ label: "today", conversations: today });
	if (week.length > 0) groups.push({ label: "week", conversations: week });
	if (older.length > 0)
		groups.push({ label: "earlier", conversations: older });
	return groups;
}

export function ConversationSidebar() {
	const { t } = useTranslation("chat");
	const conversations = useChatStore((s) => s.conversations);
	const activeId = useChatStore((s) => s.activeConversationId);
	const { select, startNew, remove, search } = useConversations();

	const [query, setQuery] = useState("");
	const [results, setResults] = useState<Conversation[] | null>(null);
	const [searching, setSearching] = useState(false);

	useEffect(() => {
		const q = query.trim();
		if (!q) {
			setResults(null);
			setSearching(false);
			return;
		}
		setSearching(true);
		const id = window.setTimeout(async () => {
			const found = await search(q);
			setResults(found);
			setSearching(false);
		}, 300);
		return () => window.clearTimeout(id);
	}, [query, search]);

	const isSearchMode = results !== null;
	const groups = useMemo(
		() => groupConversations(conversations),
		[conversations],
	);

	const handleDelete = (id: string) => {
		void remove(id);
		toast(t("conversation.deleted"));
	};

	const groupLabel = (key: string) =>
		key === "today"
			? t("conversation.groupToday")
			: key === "week"
				? t("conversation.groupWeek")
				: t("conversation.groupEarlier");

	const renderItem = (c: Conversation) => {
		const active = c.id === activeId;
		return (
			<div
				key={c.id}
				className={cn(
					"group/conv relative flex items-center gap-2",
					"rounded-[var(--radius-md)] transition-colors duration-[var(--duration-fast)]",
					active ? "bg-accent" : "hover:bg-accent/60",
				)}
			>
				<button
					type="button"
					onClick={() => void select(c.id)}
					className={cn(
						"flex-1 min-w-0 text-start px-3 py-2 rounded-[var(--radius-md)]",
						"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card",
					)}
				>
					<div
						className={cn(
							"truncate text-[0.8125rem] font-medium",
							active ? "text-foreground" : "text-foreground/85",
						)}
					>
						{c.title}
					</div>
					{c.preview ? (
						<div className="truncate text-[0.6875rem] text-muted-foreground mt-0.5">
							{c.preview}
						</div>
					) : null}
				</button>
				<button
					type="button"
					onClick={() => handleDelete(c.id)}
					aria-label={t("conversation.delete")}
					className={cn(
						"me-2 grid size-7 place-items-center rounded-[var(--radius-xs)] shrink-0",
						"text-muted-foreground opacity-0 group-hover/conv:opacity-100",
						"hover:bg-destructive/10 hover:text-destructive transition-all",
						"focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
					)}
				>
					<Trash2 className="size-3.5" strokeWidth={1.6} />
				</button>
			</div>
		);
	};

	return (
		<aside
			className={cn(
				"flex flex-col gap-3 h-full w-full",
				"rounded-[var(--radius-2xl)] border border-border bg-card",
				"p-3",
			)}
		>
			<Button
				onClick={() => startNew()}
				className="gap-2 justify-start"
				size="sm"
			>
				<MessageSquarePlus className="size-3.5" strokeWidth={1.6} />
				<span>{t("conversation.new")}</span>
			</Button>

			{/* Search */}
			<div className="relative">
				<Search
					className="absolute inset-y-0 start-2.5 my-auto size-3.5 text-muted-foreground pointer-events-none"
					strokeWidth={1.6}
				/>
				<Input
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					placeholder={t("conversation.searchPlaceholder")}
					aria-label={t("conversation.search")}
					className="h-9 ps-8 pe-8 text-[0.8125rem]"
				/>
				{query ? (
					<button
						type="button"
						onClick={() => setQuery("")}
						aria-label={t("conversation.clearSearch")}
						className="absolute inset-y-0 end-2 my-auto grid size-6 place-items-center rounded-[var(--radius-xs)] text-muted-foreground hover:text-foreground transition-colors"
					>
						<X className="size-3.5" strokeWidth={1.6} />
					</button>
				) : null}
			</div>

			<div className="text-[0.6875rem] font-medium uppercase tracking-[0.16em] text-muted-foreground px-1">
				{isSearchMode
					? t("conversation.searchResults")
					: t("conversation.history")}
			</div>

			<div className="flex-1 min-h-0 overflow-y-auto -mx-1 pe-1">
				{isSearchMode ? (
					searching ? (
						<div className="px-3 py-6 text-center text-[0.75rem] text-muted-foreground">
							{t("conversation.searching")}
						</div>
					) : results && results.length > 0 ? (
						<div className="flex flex-col gap-0.5 px-1">
							{results.map(renderItem)}
						</div>
					) : (
						<div className="px-3 py-6 text-center text-[0.75rem] text-muted-foreground">
							{t("conversation.noResults")}
						</div>
					)
				) : conversations.length === 0 ? (
					<div className="px-3 py-6 text-center">
						<p className="text-[0.8125rem] font-medium text-foreground">
							{t("conversation.empty")}
						</p>
						<p className="mt-1 text-[0.75rem] text-muted-foreground leading-relaxed">
							{t("conversation.emptyDescription")}
						</p>
					</div>
				) : (
					<div className="flex flex-col gap-3 px-1">
						{groups.map((group) => (
							<div
								key={group.label}
								className="flex flex-col gap-0.5"
							>
								<div className="text-[0.625rem] font-medium uppercase tracking-[0.14em] text-muted-foreground px-2 mt-1">
									{groupLabel(group.label)}
								</div>
								{group.conversations.map(renderItem)}
							</div>
						))}
					</div>
				)}
			</div>
		</aside>
	);
}
