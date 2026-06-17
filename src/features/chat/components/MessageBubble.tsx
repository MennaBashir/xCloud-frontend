import { useTranslation } from "react-i18next";
import { useState } from "react";
import {
	Avatar,
	AvatarFallback,
} from "@/components/ui/avatar";
import {
	Check,
	Copy,
	ExternalLink,
	Eye,
	FileText,
	Globe,
	Loader2,
	RefreshCcw,
	Sparkles,
} from "lucide-react";

import { cn } from "@/lib/utils";
import {
	selectUser,
	useAuthStore,
} from "@/features/auth/store/authStore";
import { useFilePreview } from "@/features/files/components/FilePreview";
import type { ChatMessage, Citation } from "../types/chat";

type MessageBubbleProps = {
	message: ChatMessage;
	isStreaming: boolean;
	onRegenerate?: () => void;
};

function initials(name: string) {
	return name
		.split(" ")
		.map((w) => w[0])
		.slice(0, 2)
		.join("")
		.toUpperCase();
}

export function MessageBubble({
	message,
	isStreaming,
	onRegenerate,
}: MessageBubbleProps) {
	const { t } = useTranslation("chat");
	const user = useAuthStore(selectUser);
	const [copied, setCopied] = useState(false);
	const isAssistant = message.role === "assistant";
	const filePreview = useFilePreview();

	// AI is "thinking" once the stream has started but no content has arrived.
	const isThinking = isStreaming && !message.content;

	// Split citations: previewable files (the files the AI found) vs web links.
	const citations = message.citations ?? [];
	const fileResults = citations.filter((c) => Boolean(c.filePath));
	const webSources = citations.filter((c) => c.kind === "web" && c.url);

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(message.content);
			setCopied(true);
			setTimeout(() => setCopied(false), 1500);
		} catch {
			/* noop */
		}
	};

	return (
		<div
			className={cn(
				"flex gap-3 sm:gap-4 group/msg",
				isAssistant ? "items-start" : "items-start",
			)}
		>
			{/* Avatar */}
			{isAssistant ? (
				<div
					aria-hidden="true"
					className={cn(
						"grid place-items-center size-9 rounded-[var(--radius-md)] shrink-0",
						"bg-ai-tint text-ai ring-1 ring-inset ring-ai/20",
					)}
				>
					<Sparkles className="size-4" strokeWidth={1.7} />
				</div>
			) : (
				<Avatar className="size-9 shrink-0">
					<AvatarFallback className="bg-surface-muted text-foreground text-[0.75rem] font-medium">
						{initials(user?.name ?? "User")}
					</AvatarFallback>
				</Avatar>
			)}

			{/* Body */}
			<div className="flex-1 min-w-0 flex flex-col gap-1.5">
				<div className="flex items-center gap-2 text-[0.75rem]">
					<span className="font-medium text-foreground">
						{isAssistant ? t("message.assistant") : t("message.you")}
					</span>
					{isStreaming && !isThinking ? (
						<span className="inline-flex items-center gap-1.5 text-muted-foreground">
							<span className="relative grid size-1.5 place-items-center">
								<span className="absolute inset-0 rounded-full bg-ai/60 animate-ping" />
								<span className="relative size-1.5 rounded-full bg-ai" />
							</span>
							<span>{t("conversation.streaming")}</span>
						</span>
					) : null}
					{message.status === "error" ? (
						<span className="text-destructive">
							{t("conversation.errorMessage")}
						</span>
					) : null}
				</div>

				{isThinking ? (
					<ThinkingIndicator label={t("conversation.thinking")} />
				) : (
					<div
						className={cn(
							"text-[0.9375rem] leading-relaxed text-foreground",
							"whitespace-pre-wrap break-words",
						)}
					>
						{message.content}
						{isStreaming && message.content ? <BlinkingCursor /> : null}
					</div>
				)}

				{/* File results the AI found */}
				{isAssistant && fileResults.length > 0 ? (
					<div className="mt-3 flex flex-col gap-2">
						<div className="text-[0.625rem] uppercase tracking-[0.16em] text-muted-foreground">
							{t("message.filesFound", { count: fileResults.length })}
						</div>
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
							{fileResults.map((c) => (
								<FileResultCard
									key={c.id}
									citation={c}
									loading={filePreview.loadingPath === c.filePath}
									onPreview={() =>
										void filePreview.open(c.filePath as string)
									}
									onOpenTab={() =>
										void filePreview.openInNewTab(
											c.filePath as string,
										)
									}
									previewLabel={t("message.previewFile")}
									openTabLabel={t("message.openInNewTab")}
								/>
							))}
						</div>
					</div>
				) : null}

				{/* Web / other sources */}
				{isAssistant && webSources.length > 0 ? (
					<div className="mt-2 flex flex-col gap-1.5">
						<div className="text-[0.625rem] uppercase tracking-[0.16em] text-muted-foreground">
							{t("message.sources")}
						</div>
						<div className="flex items-center gap-1.5 flex-wrap">
							{webSources.map((c) => (
								<a
									key={c.id}
									href={c.url}
									target="_blank"
									rel="noopener noreferrer"
									title={c.detail || c.url}
									className={cn(
										"inline-flex items-center gap-1.5",
										"rounded-full border border-border bg-card",
										"px-2.5 py-1 text-[0.75rem] cursor-pointer",
										"hover:border-border-strong hover:bg-accent/40 transition-colors",
									)}
								>
									<Globe
										className="size-3 text-muted-foreground"
										strokeWidth={1.6}
									/>
									<span className="font-medium text-foreground truncate max-w-[14rem]">
										{c.title}
									</span>
									{c.detail ? (
										<span className="text-muted-foreground truncate max-w-[10rem]">
											· {c.detail}
										</span>
									) : null}
								</a>
							))}
						</div>
					</div>
				) : null}

				{/* Actions */}
				{isAssistant &&
				!isStreaming &&
				message.status !== "error" &&
				message.content ? (
					<div className="mt-1.5 flex items-center gap-0.5 opacity-0 group-hover/msg:opacity-100 transition-opacity duration-[var(--duration-fast)]">
						<button
							type="button"
							onClick={handleCopy}
							aria-label={t("message.copy")}
							className="inline-flex items-center gap-1.5 h-7 px-2 rounded-[var(--radius-sm)] text-[0.75rem] text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
						>
							{copied ? (
								<Check className="size-3" strokeWidth={1.8} />
							) : (
								<Copy className="size-3" strokeWidth={1.6} />
							)}
							<span>{copied ? t("message.copied") : t("message.copy")}</span>
						</button>
						{onRegenerate ? (
							<button
								type="button"
								onClick={onRegenerate}
								aria-label={t("message.regenerate")}
								className="inline-flex items-center gap-1.5 h-7 px-2 rounded-[var(--radius-sm)] text-[0.75rem] text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
							>
								<RefreshCcw className="size-3" strokeWidth={1.6} />
								<span>{t("message.regenerate")}</span>
							</button>
						) : null}
					</div>
				) : null}
			</div>

			{filePreview.dialog}
		</div>
	);
}

function ThinkingIndicator({ label }: { label: string }) {
	return (
		<div
			className="inline-flex items-center gap-2.5 text-[0.9375rem] text-muted-foreground"
			role="status"
			aria-live="polite"
		>
			<span className="flex items-center gap-1" aria-hidden="true">
				<span className="size-1.5 rounded-full bg-ai animate-bounce [animation-delay:-0.3s]" />
				<span className="size-1.5 rounded-full bg-ai animate-bounce [animation-delay:-0.15s]" />
				<span className="size-1.5 rounded-full bg-ai animate-bounce" />
			</span>
			<span className="bg-gradient-to-r from-muted-foreground via-foreground to-muted-foreground bg-[length:200%_100%] bg-clip-text text-transparent animate-shimmer">
				{label}
			</span>
		</div>
	);
}

function BlinkingCursor() {
	return (
		<span
			aria-hidden="true"
			className="inline-block w-[2px] h-[1.1em] align-[-2px] bg-foreground/70 animate-pulse ms-0.5"
		/>
	);
}

type FileResultCardProps = {
	citation: Citation;
	loading: boolean;
	onPreview: () => void;
	onOpenTab: () => void;
	previewLabel: string;
	openTabLabel: string;
};

function FileResultCard({
	citation,
	loading,
	onPreview,
	onOpenTab,
	previewLabel,
	openTabLabel,
}: FileResultCardProps) {
	return (
		<div
			className={cn(
				"group/file flex items-center gap-3 min-w-0",
				"rounded-[var(--radius-md)] border border-border bg-card",
				"ps-3 pe-2 py-2",
				"hover:border-border-strong hover:bg-accent/30 transition-colors",
			)}
		>
			<button
				type="button"
				onClick={onPreview}
				disabled={loading}
				title={previewLabel}
				className="flex items-center gap-2.5 min-w-0 flex-1 text-start cursor-pointer disabled:cursor-wait"
			>
				<span className="grid size-8 place-items-center rounded-[var(--radius-sm)] bg-ai-tint text-ai ring-1 ring-inset ring-ai/20 shrink-0">
					{loading ? (
						<Loader2 className="size-4 animate-spin" strokeWidth={1.7} />
					) : (
						<FileText className="size-4" strokeWidth={1.7} />
					)}
				</span>
				<span className="min-w-0 flex-1">
					<span className="block truncate text-[0.8125rem] font-medium text-foreground">
						{citation.title}
					</span>
					{citation.detail ? (
						<span className="block truncate text-[0.6875rem] text-muted-foreground">
							{citation.detail}
						</span>
					) : null}
				</span>
			</button>

			<div className="flex items-center gap-0.5 shrink-0">
				<button
					type="button"
					onClick={onPreview}
					disabled={loading}
					aria-label={previewLabel}
					title={previewLabel}
					className="grid size-7 place-items-center rounded-[var(--radius-sm)] text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
				>
					<Eye className="size-3.5" strokeWidth={1.6} />
				</button>
				<button
					type="button"
					onClick={onOpenTab}
					disabled={loading}
					aria-label={openTabLabel}
					title={openTabLabel}
					className="grid size-7 place-items-center rounded-[var(--radius-sm)] text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
				>
					<ExternalLink className="size-3.5 rtl-flip" strokeWidth={1.6} />
				</button>
			</div>
		</div>
	);
}
