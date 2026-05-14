import { useTranslation } from "react-i18next";
import { Check, ChevronsUpDown, Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useChatStore } from "../store/chatStore";
import { CHAT_MODELS } from "../mock/models";

export function ModelPicker() {
	const { t } = useTranslation("chat");
	const modelId = useChatStore((s) => s.modelId);
	const setModelId = useChatStore((s) => s.setModelId);
	const current =
		CHAT_MODELS.find((m) => m.id === modelId) ?? CHAT_MODELS[0];

	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				className={cn(
					"inline-flex items-center gap-1.5",
					"h-8 px-2.5 rounded-full",
					"text-[0.75rem] font-medium text-muted-foreground",
					"hover:bg-accent hover:text-foreground transition-colors",
					"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card",
				)}
				aria-label={t("model.changeModel")}
			>
				<Sparkles className="size-3 text-ai" strokeWidth={1.8} />
				<span>{current.label}</span>
				<ChevronsUpDown className="size-3 opacity-70" strokeWidth={1.6} />
			</DropdownMenuTrigger>
			<DropdownMenuContent
				align="start"
				side="top"
				className="min-w-[15rem] rounded-[var(--radius-lg)]"
			>
				<DropdownMenuLabel className="text-[0.6875rem] uppercase tracking-[0.16em] text-muted-foreground">
					{t("model.label")}
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				{CHAT_MODELS.map((m) => {
					const active = m.id === modelId;
					return (
						<DropdownMenuItem
							key={m.id}
							onSelect={() => setModelId(m.id)}
							className="cursor-pointer items-start gap-2"
						>
							<span className="grid size-6 place-items-center mt-0.5">
								{active ? (
									<Check
										className="size-3.5 text-foreground"
										strokeWidth={1.8}
									/>
								) : null}
							</span>
							<span className="flex flex-col">
								<span className="text-[0.875rem] font-medium text-foreground">
									{m.label}
								</span>
								<span className="text-[0.6875rem] text-muted-foreground">
									{m.tagline}
								</span>
							</span>
						</DropdownMenuItem>
					);
				})}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
