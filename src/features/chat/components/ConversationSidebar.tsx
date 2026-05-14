import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { MessageSquarePlus, Trash2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useChatStore } from "../store/chatStore";

type Group = {
	label: string;
	conversations: Array<{ id: string; title: string; preview: string }>;
};

function groupConversations(
	conversations: Array<{
		id: string;
		title: string;
		preview: string;
		updatedAt: string;
	}>,
): Group[] {
	if (conversations.length === 0) return [];
	const today: Group["conversations"] = [];
	const week: Group["conversations"] = [];
	const older: Group["conversations"] = [];
	const now = Date.now();
	const DAY = 1000 * 60 * 60 * 24;

	for (const c of conversations) {
		const diff = now - new Date(c.updatedAt).getTime();
		if (diff < DAY) today.push(c);
		else if (diff < DAY * 7) week.push(c);
		else older.push(c);
	}

	const groups: Group[] = [];
	if (today.length > 0) groups.push({ label: "Today", conversations: today });
	if (week.length > 0)
		groups.push({ label: "This week", conversations: week });
	if (older.length > 0) groups.push({ label: "Earlier", conversations: older });
	return groups;
}

export function ConversationSidebar() {
	const { t } = useTranslation("chat");
	const conversations = useChatStore((s) => s.conversations);
	const activeId = useChatStore((s) => s.activeConversationId);
	const createConversation = useChatStore((s) => s.createConversation);
	const selectConversation = useChatStore((s) => s.selectConversation);
	const deleteConversation = useChatStore((s) => s.deleteConversation);

	const groups = groupConversations(conversations);

	const handleDelete = (id: string) => {
		deleteConversation(id);
		toast(t("conversation.deleted"));
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
				onClick={() => createConversation()}
				className="gap-2 justify-start"
				size="sm"
			>
				<MessageSquarePlus className="size-3.5" strokeWidth={1.6} />
				<span>{t("conversation.new")}</span>
			</Button>

			<div className="text-[0.6875rem] font-medium uppercase tracking-[0.16em] text-muted-foreground px-1 mt-1">
				{t("conversation.history")}
			</div>

			<div className="flex-1 min-h-0 overflow-y-auto -mx-1 pe-1">
				{conversations.length === 0 ? (
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
							<div key={group.label} className="flex flex-col gap-0.5">
								<div className="text-[0.625rem] font-medium uppercase tracking-[0.14em] text-muted-foreground px-2 mt-1">
									{group.label}
								</div>
								{group.conversations.map((c) => {
									const active = c.id === activeId;
									return (
										<div
											key={c.id}
											className={cn(
												"group/conv relative flex items-center gap-2",
												"rounded-[var(--radius-md)] transition-colors duration-[var(--duration-fast)]",
												active
													? "bg-accent"
													: "hover:bg-accent/60",
											)}
										>
											<button
												type="button"
												onClick={() => selectConversation(c.id)}
												className={cn(
													"flex-1 min-w-0 text-start px-3 py-2 rounded-[var(--radius-md)]",
													"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card",
												)}
											>
												<div
													className={cn(
														"truncate text-[0.8125rem] font-medium",
														active
															? "text-foreground"
															: "text-foreground/85",
													)}
												>
													{c.title}
												</div>
												<div className="truncate text-[0.6875rem] text-muted-foreground mt-0.5">
													{c.preview}
												</div>
											</button>
											<button
												type="button"
												onClick={() => handleDelete(c.id)}
												aria-label="Delete conversation"
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
								})}
							</div>
						))}
					</div>
				)}
			</div>
		</aside>
	);
}
