import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import {
	Archive,
	ArrowLeft,
	Code2,
	MailOpen,
	Sparkles,
	Star,
	Trash2,
	Type,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@/components/ui/avatar";
import { useLanguage } from "@/shared/i18n/LanguageProvider";
import { EmptyState } from "@/shared/components";

import {
	archiveThread,
	deleteThread,
	markRead,
	toggleStar,
} from "../services/gmailService";
import { useGmailStore } from "../store/gmailStore";
import { useThread } from "../hooks/useThread";
import { EmailBody, type EmailBodyMode } from "./EmailBody";
import { fullTime, initials, labelToneClass } from "./mail-meta";
import { LABELS } from "../services/gmailService";
import { useChatHandoffStore } from "@/features/chat/store/chatHandoffStore";
import { buildEmailSummaryPrompt } from "../lib/summaryPrompt";

type ThreadViewProps = {
	onRefresh: () => void;
	onBack?: () => void;
};

export function ThreadView({ onRefresh, onBack }: ThreadViewProps) {
	const { t } = useTranslation("gmail");
	const { language } = useLanguage();
	const navigate = useNavigate();
	const setHandoff = useChatHandoffStore((s) => s.setPending);
	const threadId = useGmailStore((s) => s.selectedThreadId);
	const selectThread = useGmailStore((s) => s.selectThread);
	const { thread, loading, reload } = useThread(threadId);
	const [summarizing, setSummarizing] = useState(false);
	const [viewMode, setViewMode] = useState<EmailBodyMode>("rich");

	// Auto-mark as read when a thread is opened
	useEffect(() => {
		if (thread && thread.unread) {
			void markRead(thread.id, false).then(() => {
				onRefresh();
				reload();
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [thread?.id]);

	if (!threadId) {
		return (
			<div className="flex-1 min-h-0 grid place-items-center p-6">
				<EmptyState
					icon={MailOpen}
					title={t("empty.selectionTitle")}
					description={t("empty.selectionDescription")}
					className="max-w-[420px] border-none bg-transparent"
				/>
			</div>
		);
	}

	if (loading || !thread) {
		return (
			<div className="flex-1 min-h-0 flex flex-col overflow-hidden">
				{onBack ? (
					<div className="flex-none lg:hidden px-4 py-2 border-b border-border">
						<Button
							type="button"
							size="sm"
							variant="ghost"
							onClick={onBack}
							className="gap-2 -ms-2"
						>
							<ArrowLeft className="size-4 rtl-flip" strokeWidth={1.6} />
							<span>{t("actions.backToInbox", { defaultValue: "Gmail" })}</span>
						</Button>
					</div>
				) : null}
				<div className="flex-1 min-h-0 grid place-items-center text-muted-foreground gap-2 text-[0.875rem]">
					<div className="flex items-center gap-2">
						<Spinner className="size-4" />
						<span>Loading…</span>
					</div>
				</div>
			</div>
		);
	}

	const handleSummarize = () => {
		// Hand the email content off to the Chat AI tab, which opens a fresh
		// conversation and auto-sends the summary request.
		setSummarizing(true);
		setHandoff({
			prompt: buildEmailSummaryPrompt(thread),
			title: thread.subject,
			newConversation: true,
		});
		toast.success(
			t("thread.summary.sentToChat", {
				defaultValue: "Summarizing in Chat AI…",
			}),
		);
		navigate("/app/chat");
	};

	const handleToggleStar = async () => {
		await toggleStar(thread.id);
		onRefresh();
		reload();
	};

	const handleArchive = async () => {
		await archiveThread(thread.id);
		toast(t("thread.archived"));
		selectThread(null);
		onRefresh();
	};

	const handleDelete = async () => {
		await deleteThread(thread.id);
		toast(t("thread.deleted"));
		selectThread(null);
		onRefresh();
	};

	return (
		<div className="flex-1 min-h-0 flex flex-col overflow-hidden">
			{onBack ? (
				<div className="flex-none lg:hidden px-4 py-2 border-b border-border">
					<Button
						type="button"
						size="sm"
						variant="ghost"
						onClick={onBack}
						className="gap-2 -ms-2"
					>
						<ArrowLeft className="size-4 rtl-flip" strokeWidth={1.6} />
						<span>{t("actions.backToInbox", { defaultValue: "Gmail" })}</span>
					</Button>
				</div>
			) : null}
			{/* Header */}
			<div className="flex-none px-5 py-4 border-b border-border flex items-start gap-3">
				<div className="flex-1 min-w-0">
					<h2 className="font-semibold tracking-tight text-[1.0625rem] text-foreground leading-snug">
						{thread.subject}
					</h2>
					<div className="flex items-center gap-2 mt-1.5 flex-wrap">
						{thread.labels.map((labelId) => {
							const label = LABELS.find((l) => l.id === labelId);
							if (!label) return null;
							return (
								<span
									key={label.id}
									className={cn(
										"inline-flex items-center rounded-full px-2 py-0.5",
										"text-[0.625rem] font-medium uppercase tracking-[0.12em]",
										"ring-1 ring-inset",
										labelToneClass(label.tone),
									)}
								>
									{label.name}
								</span>
							);
						})}
						<span className="text-[0.75rem] text-muted-foreground">
							{t("thread.messages", { count: thread.messages.length })}
						</span>
					</div>
				</div>
				<div className="flex items-center gap-1 shrink-0">
					<div
						role="group"
						aria-label={t("thread.view.label", { defaultValue: "View mode" })}
						className="me-1 inline-flex items-center rounded-[var(--radius-md)] border border-border p-0.5"
					>
						<button
							type="button"
							onClick={() => setViewMode("rich")}
							aria-pressed={viewMode === "rich"}
							title={t("thread.view.rich", { defaultValue: "Rich" })}
							className={cn(
								"inline-flex items-center gap-1.5 h-7 px-2 rounded-[var(--radius-sm)]",
								"text-[0.75rem] font-medium transition-colors duration-[var(--duration-fast)]",
								viewMode === "rich"
									? "bg-accent text-foreground"
									: "text-muted-foreground hover:text-foreground",
							)}
						>
							<Code2 className="size-3.5" strokeWidth={1.6} />
							<span className="hidden sm:inline">
								{t("thread.view.rich", { defaultValue: "Rich" })}
							</span>
						</button>
						<button
							type="button"
							onClick={() => setViewMode("plain")}
							aria-pressed={viewMode === "plain"}
							title={t("thread.view.plain", { defaultValue: "Plain" })}
							className={cn(
								"inline-flex items-center gap-1.5 h-7 px-2 rounded-[var(--radius-sm)]",
								"text-[0.75rem] font-medium transition-colors duration-[var(--duration-fast)]",
								viewMode === "plain"
									? "bg-accent text-foreground"
									: "text-muted-foreground hover:text-foreground",
							)}
						>
							<Type className="size-3.5" strokeWidth={1.6} />
							<span className="hidden sm:inline">
								{t("thread.view.plain", { defaultValue: "Plain" })}
							</span>
						</button>
					</div>
					<Button
						type="button"
						size="icon-sm"
						variant="ghost"
						onClick={handleToggleStar}
						aria-label={
							thread.starred ? t("actions.unstar") : t("actions.star")
						}
					>
						<Star
							className={cn(
								"size-3.5",
								thread.starred ? "text-warning fill-current" : "text-muted-foreground",
							)}
							strokeWidth={1.6}
						/>
					</Button>
					<Button
						type="button"
						size="icon-sm"
						variant="ghost"
						onClick={handleArchive}
						aria-label={t("actions.archive")}
					>
						<Archive className="size-3.5" strokeWidth={1.6} />
					</Button>
					<Button
						type="button"
						size="icon-sm"
						variant="ghost"
						onClick={handleDelete}
						aria-label={t("actions.delete")}
					>
						<Trash2 className="size-3.5 text-destructive" strokeWidth={1.6} />
					</Button>
				</div>
			</div>

			{/* Scroll area */}
			<div className="flex-1 min-h-0 overflow-y-auto">
				<div className="px-5 py-5 flex flex-col gap-5">
					{/* AI Summary */}
					<div
						className={cn(
							"rounded-[var(--radius-lg)] border border-ai/25 bg-ai-tint",
							"px-4 py-3.5",
						)}
					>
						<div className="flex items-start justify-between gap-3">
							<div className="flex items-center gap-2 text-ai">
								<Sparkles
									className="size-3.5 ambient-pulse"
									strokeWidth={1.8}
								/>
								<span className="text-[0.6875rem] font-medium uppercase tracking-[0.18em]">
									{t("thread.summary.label")}
								</span>
							</div>
							{!thread.aiSummary ? (
								<Button
									size="sm"
									variant="ai"
									onClick={handleSummarize}
									disabled={summarizing}
									className="gap-1.5 text-white [&_svg]:text-white "
								>
									{summarizing ? (
										<>
											<Spinner className="size-3.5" />
											<span>{t("thread.summary.opening", { defaultValue: "Opening Chat…" })}</span>
										</>
									) : (
										<>
											<Sparkles className="size-3" strokeWidth={1.8} />
											<span className="text-white">{t("thread.summary.generate")}</span>
										</>
									)}
								</Button>
							) : null}
						</div>
						{thread.aiSummary ? (
							<p className="mt-2 text-[0.875rem] leading-relaxed text-white">
								{thread.aiSummary}
							</p>
						) : (
							<p className="mt-2 text-[0.8125rem] text-white">
								{t("thread.summary.chatHint", {
									defaultValue:
										"Summarize this thread in Chat AI to get decisions, owners, and next steps.",
								})}
							</p>
						)}
					</div>

					{/* Messages */}
					{thread.messages.map((m) => (
						<article
							key={m.id}
							className="rounded-[var(--radius-lg)] border border-border bg-card overflow-hidden"
						>
							<header className="flex items-start gap-3 px-4 py-3 border-b border-border bg-surface-muted/40">
								<Avatar className="size-9 shrink-0">
									<AvatarImage src={m.from.avatarUrl} alt="" />
									<AvatarFallback className="bg-surface-muted text-foreground text-[0.75rem] font-medium">
										{initials(m.from.name)}
									</AvatarFallback>
								</Avatar>
								<div className="flex-1 min-w-0">
									<div className="flex items-center justify-between gap-2 flex-wrap">
										<span className="text-[0.875rem] font-medium text-foreground">
											{m.from.name}
										</span>
										<span className="text-[0.6875rem] text-muted-foreground font-mono">
											{fullTime(m.sentAt, language)}
										</span>
									</div>
									<div className="text-[0.75rem] text-muted-foreground truncate">
										{t("thread.toLabel")}{" "}
										{m.to.map((r) => r.name).join(", ")}
									</div>
								</div>
							</header>
							<div className="px-4 py-4">
								<EmailBody body={m.body} mode={viewMode} />
							</div>
						</article>
					))}
				</div>
			</div>

		</div>
	);
}
