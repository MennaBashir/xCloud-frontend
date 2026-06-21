import { useTranslation } from "react-i18next";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useModels } from "../hooks/useModels";
import { ModelLogo } from "./ModelLogo";

export function ModelPicker() {
	const { t } = useTranslation("chat");
	const { models, modelId, setModelId, isLoading, error } = useModels();

	const current = models.find((m) => m.id === modelId);
	const triggerLabel = current?.label
		? current.label
		: isLoading
			? t("model.loading")
			: t("model.label");

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
				{current ? (
					<ModelLogo family={current.family} className="size-4" />
				) : null}
				<span className="max-w-[12rem] truncate">{triggerLabel}</span>
				<ChevronsUpDown className="size-3 opacity-70" strokeWidth={1.6} />
			</DropdownMenuTrigger>
			<DropdownMenuContent
				align="start"
				side="top"
				className="min-w-[15rem] max-w-[20rem] rounded-[var(--radius-lg)]"
			>
				<DropdownMenuLabel className="text-[0.6875rem] uppercase tracking-[0.16em] text-muted-foreground">
					{t("model.label")}
				</DropdownMenuLabel>
				<DropdownMenuSeparator />

				{error ? (
					<div className="px-2 py-2 text-[0.75rem] text-destructive">
						{error}
					</div>
				) : null}

				{!error && models.length === 0 ? (
					<div className="px-2 py-2 text-[0.75rem] text-muted-foreground">
						{isLoading ? t("model.loading") : t("model.empty")}
					</div>
				) : null}

				{models.map((m) => {
					const active = m.id === modelId;
					return (
						<DropdownMenuItem
							key={m.id}
							onSelect={() => setModelId(m.id)}
							className="cursor-pointer items-start gap-2"
						>
							<span className="grid size-4 place-items-center mt-0.5">
								{active ? (
									<Check
										className="size-3.5 text-foreground"
										strokeWidth={1.8}
									/>
								) : null}
							</span>
							<ModelLogo family={m.family} className="mt-0.5" />
							<span className="flex flex-col min-w-0">
								<span className="text-[0.875rem] font-medium text-foreground truncate">
									{m.label}
								</span>
								{m.tagline ? (
									<span className="text-[0.6875rem] text-muted-foreground truncate">
										{m.tagline}
									</span>
								) : null}
							</span>
						</DropdownMenuItem>
					);
				})}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
