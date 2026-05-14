import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
	Bell,
	CalendarDays,
	FolderClosed,
	Home,
	Inbox,
	Languages,
	Moon,
	Search,
	Sparkles,
	Sun,
	Video,
} from "lucide-react";

import {
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
} from "@/components/ui/command";
import { useCommandPalette } from "./command-palette-store";
import { useTheme } from "@/shared/theme/ThemeProvider";
import { useLanguage } from "@/shared/i18n/LanguageProvider";

export function CommandPalette() {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const isOpen = useCommandPalette((s) => s.isOpen);
	const close = useCommandPalette((s) => s.close);
	const toggle = useCommandPalette((s) => s.toggle);
	const { setTheme } = useTheme();
	const { setLanguage } = useLanguage();

	// ⌘K / Ctrl+K global shortcut
	useEffect(() => {
		const handler = (event: KeyboardEvent) => {
			if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
				event.preventDefault();
				toggle();
			}
			if (event.key === "Escape" && isOpen) {
				close();
			}
		};
		window.addEventListener("keydown", handler);
		return () => window.removeEventListener("keydown", handler);
	}, [toggle, close, isOpen]);

	const go = (to: string) => () => {
		close();
		navigate(to);
	};

	const themeAction = (mode: "light" | "dark" | "system") => () => {
		setTheme(mode);
		close();
	};

	const languageAction = (code: "en" | "ar") => () => {
		setLanguage(code);
		close();
	};

	return (
		<CommandDialog
			open={isOpen}
			onOpenChange={(o) => (o ? null : close())}
			title={t("actions.search")}
			description={t("actions.search")}
		>
			<CommandInput placeholder={t("actions.search")} />
			<CommandList>
				<CommandEmpty>{t("states.empty")}</CommandEmpty>

				<CommandGroup heading={t("nav.home")}>
					<CommandItem onSelect={go("/")}>
						<Home className="size-3.5" strokeWidth={1.6} />
						<span>{t("nav.home")}</span>
					</CommandItem>
					<CommandItem onSelect={go("/app")}>
						<FolderClosed className="size-3.5" strokeWidth={1.6} />
						<span>{t("nav.files")}</span>
					</CommandItem>
					<CommandItem onSelect={go("/app/meeting")}>
						<Video className="size-3.5" strokeWidth={1.6} />
						<span>{t("nav.meeting")}</span>
					</CommandItem>
					<CommandItem onSelect={go("/app/calendar")}>
						<CalendarDays className="size-3.5" strokeWidth={1.6} />
						<span>{t("nav.calendar")}</span>
					</CommandItem>
					<CommandItem onSelect={go("/app/chat")}>
						<Sparkles className="size-3.5 text-ai" strokeWidth={1.6} />
						<span>{t("nav.chat")}</span>
					</CommandItem>
					<CommandItem onSelect={go("/app/gmail")}>
						<Inbox className="size-3.5" strokeWidth={1.6} />
						<span>{t("nav.gmail")}</span>
					</CommandItem>
					<CommandItem onSelect={go("/app/notifications")}>
						<Bell className="size-3.5" strokeWidth={1.6} />
						<span>{t("notifications:title")}</span>
					</CommandItem>
				</CommandGroup>

				<CommandSeparator />

				<CommandGroup heading={t("theme.label")}>
					<CommandItem onSelect={themeAction("light")}>
						<Sun className="size-3.5" strokeWidth={1.6} />
						<span>{t("theme.light")}</span>
					</CommandItem>
					<CommandItem onSelect={themeAction("dark")}>
						<Moon className="size-3.5" strokeWidth={1.6} />
						<span>{t("theme.dark")}</span>
					</CommandItem>
					<CommandItem onSelect={themeAction("system")}>
						<Search className="size-3.5" strokeWidth={1.6} />
						<span>{t("theme.system")}</span>
					</CommandItem>
				</CommandGroup>

				<CommandSeparator />

				<CommandGroup heading={t("language.label")}>
					<CommandItem onSelect={languageAction("en")}>
						<Languages className="size-3.5" strokeWidth={1.6} />
						<span>English</span>
					</CommandItem>
					<CommandItem onSelect={languageAction("ar")}>
						<Languages className="size-3.5" strokeWidth={1.6} />
						<span>العربية</span>
					</CommandItem>
				</CommandGroup>
			</CommandList>
		</CommandDialog>
	);
}
