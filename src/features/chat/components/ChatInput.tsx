import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { ArrowUp, Square } from "lucide-react";

import { cn } from "@/lib/utils";

type ChatInputProps = {
	onSend: (value: string) => void;
	onStop: () => void;
	isStreaming: boolean;
	/** When true, use the short placeholder ("Reply to…"). */
	hasMessages: boolean;
	/** Optional value to inject from outside (e.g. suggestion click). */
	seedValue?: string;
	/**
	 * Bumped by the parent each time `seedValue` is re-applied. Lets the
	 * user click the same suggestion twice and still re-seed the input
	 * (e.g. after they cleared it). Ignored when `seedValue` is empty.
	 */
	seedNonce?: number;
	/** Slot rendered to the left of the action button (e.g. model picker). */
	leftSlot?: React.ReactNode;
	/** Slot rendered just before the send button (e.g. RAG toggle). */
	rightSlot?: React.ReactNode;
};

export function ChatInput({
	onSend,
	onStop,
	isStreaming,
	hasMessages,
	seedValue,
	seedNonce,
	leftSlot,
	rightSlot,
}: ChatInputProps) {
	const { t } = useTranslation("chat");
	const [value, setValue] = useState("");
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	// External seed (e.g. when a suggestion card is clicked). Re-runs every
	// time the parent bumps `seedNonce` so the same suggestion can be
	// clicked twice in a row.
	useEffect(() => {
		if (!seedValue) return;
		setValue(seedValue);
		const el = textareaRef.current;
		if (el) {
			el.focus();
			// Move caret to the end so the user can keep typing/editing.
			const end = seedValue.length;
			requestAnimationFrame(() => el.setSelectionRange(end, end));
		}
	}, [seedValue, seedNonce]);

	// Auto-resize
	useEffect(() => {
		const el = textareaRef.current;
		if (!el) return;
		el.style.height = "auto";
		el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
	}, [value]);

	const canSend = value.trim().length > 0 && !isStreaming;

	const submit = () => {
		if (!canSend) return;
		onSend(value);
		setValue("");
	};

	const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (event.key === "Enter" && !event.shiftKey) {
			event.preventDefault();
			submit();
		}
	};

	return (
		<div
			className="px-4 sm:px-6"
			style={{
				paddingBottom: "max(1rem, env(safe-area-inset-bottom))",
			}}
		>
			<div className="mx-auto w-full max-w-[760px] sm:pb-2">
				<div
					className={cn(
						"relative rounded-[var(--radius-2xl)] border border-border bg-card",
						"shadow-[0_1px_2px_oklch(0_0_0/0.04),0_24px_48px_-24px_oklch(0_0_0/0.12)]",
						"transition-[border-color,box-shadow] duration-[var(--duration-fast)] ease-[cubic-bezier(0.32,0.72,0,1)]",
						"focus-within:border-border-strong focus-within:ring-2 focus-within:ring-ring/30",
					)}
				>
					<textarea
						ref={textareaRef}
						value={value}
						onChange={(e) => setValue(e.target.value)}
						onKeyDown={handleKeyDown}
						placeholder={
							hasMessages
								? t("input.placeholderShort")
								: t("input.placeholder")
						}
						aria-label={t("input.placeholder")}
						rows={1}
						className={cn(
							"block w-full resize-none bg-transparent outline-none",
							"px-4 pt-3.5 pb-12 sm:pb-14",
							"text-[0.9375rem] leading-relaxed text-foreground placeholder:text-muted-foreground/70",
							"selection:bg-ring/20",
						)}
						style={{ minHeight: "3.5rem" }}
					/>

					{/* Action row */}
					<div className="absolute inset-x-2 bottom-2 flex items-center justify-between gap-2">
						<div className="flex items-center gap-1">{leftSlot}</div>

						<div className="flex items-center gap-1.5">
						{rightSlot}

						{isStreaming ? (
							<button
								type="button"
								onClick={onStop}
								aria-label={t("input.stop")}
								className={cn(
									"inline-flex items-center gap-1.5",
									"h-9 px-3 rounded-full",
									"bg-foreground text-background",
									"text-[0.8125rem] font-medium",
									"transition-[transform,opacity] duration-[var(--duration-fast)] ease-[cubic-bezier(0.32,0.72,0,1)]",
									"active:scale-[0.98]",
								)}
							>
								<Square className="size-3 fill-current" strokeWidth={0} />
								<span>{t("input.stop")}</span>
							</button>
						) : (
							<button
								type="button"
								onClick={submit}
								disabled={!canSend}
								aria-label={t("input.send")}
								className={cn(
									"inline-grid place-items-center size-9 rounded-full",
									"transition-[transform,background-color,opacity] duration-[var(--duration-fast)] ease-[cubic-bezier(0.32,0.72,0,1)]",
									"active:scale-[0.96]",
									canSend
										? "bg-foreground text-background hover:bg-foreground/92"
										: "bg-surface-muted text-muted-foreground/60 cursor-not-allowed",
								)}
							>
								<ArrowUp className="size-4" strokeWidth={2} />
							</button>
						)}
						</div>
					</div>
				</div>

				<p className="mt-2 text-center text-[0.6875rem] text-muted-foreground">
					{t("input.hint")}
				</p>
			</div>
		</div>
	);
}
