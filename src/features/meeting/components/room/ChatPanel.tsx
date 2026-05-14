import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { usePubSub } from "@videosdk.live/react-sdk";
import { Send, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

type ChatPanelProps = {
	onClose: () => void;
	selfSenderId?: string;
};

type SdkMessage = {
	id: string;
	message: string;
	senderId: string;
	senderName: string;
	timestamp: string;
};

export function ChatPanel({ onClose, selfSenderId }: ChatPanelProps) {
	const { t } = useTranslation("meeting");
	const [draft, setDraft] = useState("");
	const endRef = useRef<HTMLDivElement>(null);

	const { publish, messages } = usePubSub("CHAT") as {
		publish: (msg: string, opts: { persist: boolean }) => Promise<void>;
		messages: SdkMessage[];
	};

	useEffect(() => {
		endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
	}, [messages.length]);

	const handleSend = async () => {
		const text = draft.trim();
		if (!text) return;
		setDraft("");
		try {
			await publish(text, { persist: true });
		} catch {
			/* noop */
		}
	};

	return (
		<aside
			className={cn(
				"flex flex-col w-full lg:w-[340px] h-full shrink-0",
				"border-s border-white/8 bg-zinc-950 text-white",
			)}
		>
			<header className="flex-none flex items-center justify-between gap-2 px-4 py-3 border-b border-white/8">
				<span className="text-[0.875rem] font-semibold tracking-tight">
					{t("sidebar.chat")}
				</span>
				<button
					type="button"
					onClick={onClose}
					aria-label={t("sidebar.close")}
					className="grid size-8 place-items-center rounded-full text-white/65 hover:bg-white/8 hover:text-white transition-colors"
				>
					<X className="size-3.5" strokeWidth={1.8} />
				</button>
			</header>

			<div className="flex-1 min-h-0 overflow-y-auto px-4 py-3">
				{messages.length === 0 ? (
					<p className="text-center text-[0.8125rem] text-white/55 py-8">
						{t("chat.empty")}
					</p>
				) : (
					<div className="flex flex-col gap-3">
						{messages.map((m) => {
							const isSelf = m.senderId === selfSenderId;
							return (
								<div
									key={m.id}
									className={cn(
										"flex flex-col gap-1",
										isSelf ? "items-end" : "items-start",
									)}
								>
									<span className="text-[0.6875rem] text-white/55 px-1">
										{isSelf ? t("chat.you") : m.senderName}
									</span>
									<div
										className={cn(
											"max-w-[80%] rounded-2xl px-3 py-2",
											"text-[0.875rem] leading-relaxed",
											isSelf
												? "bg-white text-zinc-950 rounded-tr-sm"
												: "bg-white/8 text-white rounded-tl-sm",
										)}
									>
										{m.message}
									</div>
								</div>
							);
						})}
						<div ref={endRef} />
					</div>
				)}
			</div>

			<footer className="flex-none border-t border-white/8 p-3 flex items-center gap-2">
				<Input
					value={draft}
					onChange={(e) => setDraft(e.target.value)}
					onKeyDown={(e) => {
						if (e.key === "Enter" && !e.shiftKey) {
							e.preventDefault();
							void handleSend();
						}
					}}
					placeholder={t("chat.placeholder")}
					className="bg-white/6 border-white/12 text-white placeholder:text-white/40 focus-visible:border-white/40 focus-visible:ring-white/20"
				/>
				<button
					type="button"
					onClick={handleSend}
					disabled={!draft.trim()}
					aria-label={t("chat.send")}
					className={cn(
						"inline-grid place-items-center size-10 rounded-full",
						"bg-white text-zinc-950 hover:bg-white/95",
						"disabled:opacity-40 disabled:cursor-not-allowed",
						"transition-[transform,opacity] duration-[var(--duration-fast)] ease-[cubic-bezier(0.32,0.72,0,1)]",
						"active:scale-[0.96]",
					)}
				>
					<Send className="size-4 rtl-flip" strokeWidth={1.8} />
				</button>
			</footer>
		</aside>
	);
}
