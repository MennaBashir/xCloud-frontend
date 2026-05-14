import { useTranslation } from "react-i18next";
import { Inbox, Search, Sparkles, Star } from "lucide-react";

import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@/components/ui/avatar";
import { EmptyState } from "@/shared/components";
import { useLanguage } from "@/shared/i18n/LanguageProvider";

import { useGmailStore } from "../store/gmailStore";
import { initials, labelToneClass, shortTime } from "./mail-meta";
import { LABELS } from "../mock/mockGmailService";
import type { Thread } from "../types/mail";

type ThreadListProps = {
	threads: Thread[];
	loading: boolean;
	onToggleStar: (id: string) => void;
};

export function ThreadList({ threads, loading, onToggleStar }: ThreadListProps) {
	const { t } = useTranslation("gmail");
	const { language } = useLanguage();
	const selectedId = useGmailStore((s) => s.selectedThreadId);
	const selectThread = useGmailStore((s) => s.selectThread);
	const query = useGmailStore((s) => s.query);

	if (loading) {
		return (
			<div className="flex flex-col p-2 gap-1">
				{Array.from({ length: 6 }).map((_, i) => (
					<div key={i} className="flex items-start gap-3 p-3 rounded-[var(--radius-md)]">
						<Skeleton className="size-9 rounded-full shrink-0" />
						<div className="flex-1 flex flex-col gap-1.5">
							<div className="flex items-center justify-between gap-2">
								<Skeleton className="h-3 w-1/3" />
								<Skeleton className="h-2.5 w-8" />
							</div>
							<Skeleton className="h-3 w-2/3" />
							<Skeleton className="h-2.5 w-1/2" />
						</div>
					</div>
				))}
			</div>
		);
	}

	if (threads.length === 0) {
		const isSearch = query.trim().length > 0;
		return (
			<div className="p-4">
				<EmptyState
					icon={isSearch ? Search : Inbox}
					title={
						isSearch
							? t("empty.folderTitle")
							: t("empty.inboxTitle")
					}
					description={
						isSearch
							? t("empty.folderDescription")
							: t("empty.inboxDescription")
					}
				/>
			</div>
		);
	}

	return (
		<div className="flex flex-col p-2 gap-0.5">
			{threads.map((thread) => {
				const selected = selectedId === thread.id;
				const lead = thread.participants.find(
					(p) => p.email !== "demo@sprintifai.com",
				) ?? thread.participants[0];
				return (
					<div
						key={thread.id}
						role="button"
						data-list-item
						tabIndex={0}
						onClick={() => selectThread(thread.id)}
						onKeyDown={(e) => {
							if (e.key === "Enter" || e.key === " ") {
								e.preventDefault();
								selectThread(thread.id);
							}
						}}
						className={cn(
							"group/thread relative flex items-start gap-3",
							"px-3 py-3 rounded-[var(--radius-md)] cursor-pointer",
							"border border-transparent",
							"transition-[background-color,border-color] duration-[var(--duration-fast)] ease-[cubic-bezier(0.32,0.72,0,1)]",
							"hover:bg-accent/40",
							selected && "bg-accent border-border",
							thread.unread && !selected && "bg-card",
						)}
					>
						{thread.unread ? (
							<span
								aria-hidden="true"
								className="absolute start-0 top-1/2 -translate-y-1/2 h-6 w-[2px] rounded-full bg-ai"
							/>
						) : null}

						<Avatar className="size-9 shrink-0 mt-0.5">
							<AvatarImage src={lead.avatarUrl} alt="" />
							<AvatarFallback className="bg-surface-muted text-foreground text-[0.75rem] font-medium">
								{initials(lead.name)}
							</AvatarFallback>
						</Avatar>

						<div className="flex-1 min-w-0">
							<div className="flex items-center justify-between gap-2">
								<span
									className={cn(
										"truncate text-[0.875rem]",
										thread.unread
											? "font-semibold text-foreground"
											: "text-foreground/85",
									)}
								>
									{lead.name}
								</span>
								<div className="flex items-center gap-1.5 shrink-0">
									<button
										type="button"
										onClick={(e) => {
											e.stopPropagation();
											onToggleStar(thread.id);
										}}
										aria-label={
											thread.starred
												? t("actions.unstar")
												: t("actions.star")
										}
										className={cn(
											"grid size-6 place-items-center rounded-full",
											"transition-colors duration-[var(--duration-fast)]",
											thread.starred
												? "text-warning"
												: "text-muted-foreground/50 hover:text-foreground opacity-0 group-hover/thread:opacity-100",
										)}
									>
										<Star
											className={cn(
												"size-3.5",
												thread.starred && "fill-current",
											)}
											strokeWidth={1.6}
										/>
									</button>
									<span className="font-mono text-[0.6875rem] text-muted-foreground tabular-nums">
										{shortTime(thread.updatedAt, language)}
									</span>
								</div>
							</div>

							<div
								className={cn(
									"truncate text-[0.8125rem] mt-0.5",
									thread.unread
										? "font-medium text-foreground"
										: "text-foreground/75",
								)}
							>
								{thread.subject}
							</div>

							<div className="flex items-start gap-1.5 text-[0.75rem] mt-0.5 min-w-0">
								<Sparkles
									className="size-3 text-ai shrink-0 mt-0.5"
									strokeWidth={1.7}
								/>
								<span className="text-muted-foreground truncate flex-1">
									{thread.snippet}
								</span>
							</div>

							{thread.labels.length > 0 ? (
								<div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
									{thread.labels.slice(0, 2).map((labelId) => {
										const label = LABELS.find((l) => l.id === labelId);
										if (!label) return null;
										return (
											<span
												key={label.id}
												className={cn(
													"inline-flex items-center rounded-full px-1.5 py-0",
													"text-[0.625rem] font-medium",
													"ring-1 ring-inset",
													labelToneClass(label.tone),
												)}
											>
												{label.name}
											</span>
										);
									})}
								</div>
							) : null}
						</div>
					</div>
				);
			})}
		</div>
	);
}
