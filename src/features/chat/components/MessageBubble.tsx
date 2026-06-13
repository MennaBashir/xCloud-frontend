import { useTranslation } from "react-i18next";
import { useState } from "react";
import {
	Avatar,
	AvatarFallback,
} from "@/components/ui/avatar";
import {
	Check,
	Copy,
	FileText,
	FolderClosed,
	Globe,
	RefreshCcw,
	Sparkles,
	Video,
} from "lucide-react";

import { cn } from "@/lib/utils";
import {
	selectUser,
	useAuthStore,
} from "@/features/auth/store/authStore";
import type { ChatMessage } from "../types/chat";

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
					{isStreaming ? (
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

				<div
					className={cn(
						"text-[0.9375rem] leading-relaxed text-foreground",
						"whitespace-pre-wrap break-words",
					)}
				>
					{message.content || (isStreaming ? <BlinkingCursor /> : null)}
					{isStreaming && message.content ? <BlinkingCursor /> : null}
				</div>

				{/* Citations */}
				{isAssistant && message.citations && message.citations.length > 0 ? (
					<div className="mt-2 flex flex-col gap-1.5">
						<div className="text-[0.625rem] uppercase tracking-[0.16em] text-muted-foreground">
							{t("message.sources")}
						</div>
						<div className="flex items-center gap-1.5 flex-wrap">
							{message.citations.map((c) => {
								const Icon =
									c.kind === "meeting"
										? Video
										: c.kind === "web"
											? Globe
											: c.kind === "rag"
												? FileText
												: FolderClosed;
								const isLink = c.kind === "web" && c.url;
								const content = (
									<>
										<Icon
											className="size-3 text-muted-foreground"
											strokeWidth={1.6}
										/>
										<span className="font-medium text-foreground truncate max-w-[14rem]">
											{c.title}
										</span>
										{c.kind === "web" && c.detail ? (
											<span className="text-muted-foreground truncate max-w-[10rem]">
												· {c.detail}
											</span>
										) : null}
									</>
								);
								const className = cn(
									"inline-flex items-center gap-1.5",
									"rounded-full border border-border bg-card",
									"px-2.5 py-1 text-[0.75rem]",
									"hover:border-border-strong hover:bg-accent/40 transition-colors",
								);
								return isLink ? (
									<a
										key={c.id}
										href={c.url}
										target="_blank"
										rel="noopener noreferrer"
										className={className}
										title={c.detail || c.url}
									>
										{content}
									</a>
								) : (
									<button
										key={c.id}
										type="button"
										className={className}
										title={c.detail}
									>
										{content}
									</button>
								);
							})}
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
