import { useState } from "react";
import { useTranslation } from "react-i18next";
import { PanelLeftClose, PanelLeftOpen, Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
	selectActiveConversation,
	selectActiveMessages,
	selectIsStreaming,
	useChatStore,
} from "../store/chatStore";
import { useMockChat } from "../hooks/useMockChat";

import { ConversationSidebar } from "../components/ConversationSidebar";
import { ChatWelcome } from "../components/ChatWelcome";
import { MessageList } from "../components/MessageList";
import { ChatInput } from "../components/ChatInput";
import { ModelPicker } from "../components/ModelPicker";

export default function ChatPage() {
	const { t } = useTranslation("chat");
	const messages = useChatStore(selectActiveMessages);
	const conversation = useChatStore(selectActiveConversation);
	const isStreaming = useChatStore(selectIsStreaming);
	const createConversation = useChatStore((s) => s.createConversation);
	const { sendMessage, stop } = useMockChat();
	const [seedValue] = useState<string>("");
	const [sidebarOpen, setSidebarOpen] = useState(true);

	const handleSend = (value: string) => {
		void sendMessage(value);
	};

	const handleSuggestion = (prompt: string) => {
		void sendMessage(prompt);
	};

	const hasMessages = messages.length > 0;

	return (
		<div
			className="w-full px-4 sm:px-6 lg:px-8 pb-6 flex flex-col"
			style={{ minHeight: "calc(100dvh - 3.5rem)" }}
		>
			{/* Chat shell — fills the viewport vertically */}
			<div
				className={cn(
					"flex-1 min-h-0 mt-4",
					"flex gap-4 lg:gap-5",
				)}
				style={{ height: "calc(100dvh - 5rem)" }}
			>
				{/* Sidebar — collapsible on lg+ */}
				<div
					className={cn(
						"hidden lg:flex flex-col h-full transition-[width] duration-[var(--duration-base)] ease-[cubic-bezier(0.32,0.72,0,1)]",
						sidebarOpen ? "w-[280px]" : "w-0 overflow-hidden",
					)}
				>
					<ConversationSidebar />
				</div>

				{/* Main chat column */}
				<div
					className={cn(
						"flex-1 min-w-0 flex flex-col rounded-[var(--radius-2xl)]",
						"border border-border bg-card overflow-hidden",
						"shadow-[0_1px_2px_oklch(0_0_0/0.04),inset_0_1px_0_oklch(1_0_0/0.05)]",
					)}
				>
					{/* Sticky chat header */}
					<div className="flex-none flex items-center justify-between gap-3 px-5 py-3 border-b border-border bg-card">
						<div className="flex items-center gap-3 min-w-0">
							{/* Sidebar collapse toggle (lg+) */}
							<button
								type="button"
								onClick={() => setSidebarOpen((v) => !v)}
								aria-label={
									sidebarOpen
										? t("sidebar.collapse")
										: t("sidebar.expand")
								}
								className={cn(
									"hidden lg:inline-flex items-center justify-center size-8 rounded-[var(--radius-sm)]",
									"text-muted-foreground hover:bg-accent hover:text-foreground transition-colors",
								)}
							>
								{sidebarOpen ? (
									<PanelLeftClose className="size-4 rtl-flip" strokeWidth={1.6} />
								) : (
									<PanelLeftOpen className="size-4 rtl-flip" strokeWidth={1.6} />
								)}
							</button>

							<div className="flex items-center gap-2 min-w-0">
								<span className="grid size-7 place-items-center rounded-[var(--radius-sm)] bg-ai-tint text-ai ring-1 ring-inset ring-ai/20 shrink-0 ambient-pulse">
									<Sparkles className="size-3.5" strokeWidth={1.7} />
								</span>
								<div className="flex flex-col min-w-0">
									<span className="text-[0.875rem] font-medium text-foreground truncate">
										{conversation?.title ?? t("title")}
									</span>
									<span className="text-[0.6875rem] text-muted-foreground truncate">
										{t("hero.eyebrow")}
									</span>
								</div>
							</div>
						</div>

						<div className="flex items-center gap-2 shrink-0">
							{hasMessages ? (
								<Button
									size="sm"
									variant="ghost"
									onClick={() => createConversation()}
									className="gap-1.5"
								>
									<span>{t("conversation.new")}</span>
								</Button>
							) : null}
						</div>
					</div>

					{/* Body */}
					{hasMessages ? (
						<MessageList />
					) : (
						<ChatWelcome onPrompt={handleSuggestion} />
					)}

					{/* Input */}
					<div className="flex-none border-t border-border bg-surface-muted/30">
						<ChatInput
							onSend={handleSend}
							onStop={stop}
							isStreaming={isStreaming}
							hasMessages={hasMessages}
							seedValue={seedValue}
							leftSlot={<ModelPicker />}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
