import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { PageHeader } from "@/shared/components";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { RefreshCw, Send } from "lucide-react";
import { ApiError } from "@/shared/api";

import { useListReveal } from "@/shared/hooks/useListReveal";
import { useThreads } from "../hooks/useThreads";
import { useGmailStore } from "../store/gmailStore";
import { syncInbox, toggleStar } from "../services/gmailService";
import { FolderRail } from "../components/FolderRail";
import { MobileFolderPills } from "../components/MobileFolderPills";
import { InboxToolbar } from "../components/InboxToolbar";
import { ThreadList } from "../components/ThreadList";
import { ThreadView } from "../components/ThreadView";
import { ComposeDrawer } from "../components/ComposeDrawer";

// Auto-sync runs only once per app session. After the first sync the content
// stays rendered and only re-syncs when the user presses the Sync button.
let didAutoSync = false;

export default function GmailPage() {
	const { t } = useTranslation("gmail");
	const { threads, counts, loading, refresh } = useThreads();
	const openCompose = useGmailStore((s) => s.openCompose);
	const selectedThreadId = useGmailStore((s) => s.selectedThreadId);
	const selectThread = useGmailStore((s) => s.selectThread);
	const listScope = useRef<HTMLDivElement>(null);
	const listScroller = useRef<HTMLDivElement>(null);
	const [syncing, setSyncing] = useState(false);
	useListReveal(listScope, {
		deps: [threads.length, loading],
		scroller: listScroller,
	});

	const handleToggleStar = async (id: string) => {
		await toggleStar(id);
		refresh();
	};

	const handleSync = async (options?: { silent?: boolean }) => {
		const silent = options?.silent ?? false;
		setSyncing(true);
		try {
			const result = await syncInbox();
			if (!silent || result.synced > 0) {
				toast.success(
					t("actions.syncResult", {
						count: result.synced,
						defaultValue: "Synced {{count}} new messages",
					}),
				);
			}
			refresh();
		} catch (err) {
			// Stay quiet on the automatic first-load sync so a missing email
			// account doesn't greet the user with an error toast.
			if (!silent) {
				const message =
					err instanceof ApiError
						? err.status === 400
							? t("actions.syncNoAccount", {
									defaultValue:
										"No email account is connected. Sign in with Google to sync mail.",
								})
							: err.message
						: t("actions.syncError", {
								defaultValue: "Could not sync your inbox.",
							});
				toast.error(message);
			}
		} finally {
			setSyncing(false);
		}
	};

	// Auto-sync once per session on first open. After that, content stays
	// rendered and the user re-syncs manually via the Sync button.
	useEffect(() => {
		if (didAutoSync) return;
		didAutoSync = true;
		void handleSync({ silent: true });
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const showThreadOnMobile = selectedThreadId !== null;

	return (
		<div className="w-full px-4 sm:px-6 lg:px-8 pb-10">
			<PageHeader
				eyebrow={t("title")}
				title={t("title")}
				description={t("subtitle")}
				actions={
					<div className="flex items-center gap-2">
						<Button
							variant="outline"
							onClick={() => handleSync()}
							disabled={syncing}
							className="gap-2"
						>
							{syncing ? (
								<Spinner className="size-3.5" />
							) : (
								<RefreshCw className="size-3.5" strokeWidth={1.6} />
							)}
							<span>{t("actions.sync", { defaultValue: "Sync" })}</span>
						</Button>
						<Button onClick={() => openCompose()} className="gap-2">
							<Send className="size-3.5 rtl-flip" strokeWidth={1.6} />
							<span>{t("actions.compose")}</span>
						</Button>
					</div>
				}
			/>

			<MobileFolderPills counts={counts} />

			<div
				ref={listScope}
				data-stagger="1"
				className="flex items-start gap-4 lg:gap-5"
			>
				<FolderRail counts={counts} />

				<div
					className={cn(
						"flex-1 min-w-0",
						"rounded-[var(--radius-2xl)] border border-border bg-card overflow-hidden",
						"grid grid-cols-1 lg:grid-cols-[360px_1fr]",
					)}
					style={{ height: "calc(100dvh - 12rem)", maxHeight: "780px" }}
				>
					{/* Thread list pane — hidden on mobile when a thread is open */}
					<div
						className={cn(
							"flex flex-col min-h-0 border-b lg:border-b-0 lg:border-e border-border min-w-0 overflow-hidden",
							showThreadOnMobile && "hidden lg:flex",
						)}
					>
						<InboxToolbar />
						<div ref={listScroller} className="flex-1 min-h-0 overflow-y-auto">
							<ThreadList
								threads={threads}
								loading={loading}
								onToggleStar={handleToggleStar}
							/>
						</div>
					</div>

					{/* Thread view pane — hidden on mobile when no thread is selected */}
					<div
						className={cn(
							"flex flex-col min-h-0 min-w-0 overflow-hidden",
							!showThreadOnMobile && "hidden lg:flex",
						)}
					>
						<ThreadView
							onRefresh={refresh}
							onBack={() => selectThread(null)}
						/>
					</div>
				</div>
			</div>

			<ComposeDrawer onSent={refresh} />
		</div>
	);
}
