import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Keyboard } from "lucide-react";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useShortcutsStore } from "./shortcuts-store";

type Shortcut = {
	keys: string[];
	labelKey: string;
};

type ShortcutGroup = {
	titleKey: string;
	shortcuts: Shortcut[];
};

const GROUPS: ShortcutGroup[] = [
	{
		titleKey: "shortcuts.groups.general",
		shortcuts: [
			{ keys: ["⌘", "K"], labelKey: "shortcuts.openCommand" },
			{ keys: ["⌘", "B"], labelKey: "shortcuts.toggleSidebar" },
			{ keys: ["?"], labelKey: "shortcuts.openHelp" },
		],
	},
	{
		titleKey: "shortcuts.groups.navigate",
		shortcuts: [
			{ keys: ["G", "F"], labelKey: "shortcuts.goFiles" },
			{ keys: ["G", "C"], labelKey: "shortcuts.goCalendar" },
			{ keys: ["G", "M"], labelKey: "shortcuts.goMeeting" },
			{ keys: ["G", "A"], labelKey: "shortcuts.goChat" },
			{ keys: ["G", "R"], labelKey: "shortcuts.goRag" },
			{ keys: ["G", "I"], labelKey: "shortcuts.goInbox" },
			{ keys: ["G", "H"], labelKey: "shortcuts.goHome" },
		],
	},
];

export function ShortcutsDialog() {
	const { t } = useTranslation();
	const open = useShortcutsStore((s) => s.isOpen);
	const close = useShortcutsStore((s) => s.close);

	// Esc handler — DialogContent already handles this, but we keep state explicit
	useEffect(() => {
		if (!open) return;
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") close();
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [open, close]);

	return (
		<Dialog open={open} onOpenChange={(o) => (o ? null : close())}>
			<DialogContent className="sm:max-w-[480px] rounded-[var(--radius-2xl)]">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2.5 text-foreground font-semibold tracking-tight">
						<span className="grid size-7 place-items-center rounded-[var(--radius-sm)] bg-surface-muted text-muted-foreground ring-1 ring-inset ring-border">
							<Keyboard className="size-3.5" strokeWidth={1.6} />
						</span>
						{t("shortcuts.title", { defaultValue: "Keyboard shortcuts" })}
					</DialogTitle>
					<DialogDescription className="text-[0.875rem] text-muted-foreground">
						{t("shortcuts.description", {
							defaultValue:
								"Move faster through SprintifAI without touching your mouse.",
						})}
					</DialogDescription>
				</DialogHeader>

				<div className="flex flex-col gap-5 mt-2">
					{GROUPS.map((group) => (
						<div key={group.titleKey} className="flex flex-col gap-2">
							<div className="text-[0.6875rem] font-medium uppercase tracking-[0.16em] text-muted-foreground">
								{t(group.titleKey, {
									defaultValue:
										group.titleKey === "shortcuts.groups.general"
											? "General"
											: "Navigate",
								})}
							</div>
							<div className="flex flex-col">
								{group.shortcuts.map((s) => (
									<div
										key={s.labelKey}
										className={cn(
											"flex items-center justify-between gap-3 py-2",
											"border-b border-border last:border-b-0",
										)}
									>
										<span className="text-[0.875rem] text-foreground">
											{t(s.labelKey, {
												defaultValue: defaultLabel(s.labelKey),
											})}
										</span>
										<div className="flex items-center gap-1">
											{s.keys.map((k, i) => (
												<span key={i} className="contents">
													<kbd
														className={cn(
															"inline-flex items-center justify-center min-w-[1.5rem] h-6 px-1.5",
															"rounded-[var(--radius-xs)] border border-border bg-card",
															"font-mono text-[0.6875rem] font-medium text-foreground",
															"shadow-[0_1px_0_oklch(0_0_0/0.05)]",
														)}
													>
														{k}
													</kbd>
													{i < s.keys.length - 1 ? (
														<span className="text-[0.625rem] text-muted-foreground px-0.5">
															then
														</span>
													) : null}
												</span>
											))}
										</div>
									</div>
								))}
							</div>
						</div>
					))}
				</div>
			</DialogContent>
		</Dialog>
	);
}

function defaultLabel(key: string): string {
	const map: Record<string, string> = {
		"shortcuts.openCommand": "Open command palette",
		"shortcuts.toggleSidebar": "Toggle sidebar",
		"shortcuts.openHelp": "Open this dialog",
		"shortcuts.goFiles": "Go to Files",
		"shortcuts.goCalendar": "Go to Calendar",
		"shortcuts.goMeeting": "Go to Meeting",
		"shortcuts.goChat": "Go to Chat AI",
		"shortcuts.goRag": "Go to RAG",
		"shortcuts.goInbox": "Go to Gmail",
		"shortcuts.goHome": "Go to landing page",
	};
	return map[key] ?? key;
}
