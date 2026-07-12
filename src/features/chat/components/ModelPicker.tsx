import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
	Check,
	ChevronsUpDown,
	KeyRound,
	Pin,
	RotateCcw,
	Settings2,
} from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Spinner } from "@/components/ui/spinner";
import { useModels } from "../hooks/useModels";
import { useProviders } from "../hooks/useProviders";
import type { ChatProvider } from "../types/chat";
import { ModelLogo } from "./ModelLogo";
import { ProviderConfigDialog } from "./ProviderConfigDialog";

/** The built-in local provider — works out of the box, no API key needed. */
const DEFAULT_PROVIDER_ID = "ollama";

/** True when a custom provider still needs its API key before it can be used. */
function needsApiKey(provider: ChatProvider): boolean {
	return provider.fields.some((f) => f.secret && !f.hasValue);
}

export function ModelPicker() {
	const { t } = useTranslation("chat");
	const {
		models,
		modelId,
		setModelId,
		defaultModel,
		saveDefaultModel,
		isLoading,
		error,
		reload,
	} = useModels();
	const {
		providers,
		currentProvider,
		isSwitching,
		switchProvider,
		configureProvider,
	} = useProviders();

	const [configProvider, setConfigProvider] =
		useState<ChatProvider | null>(null);
	const [configOpen, setConfigOpen] = useState(false);
	/** When set, switch to this provider right after its key is saved. */
	const [pendingSwitchId, setPendingSwitchId] = useState<string | null>(
		null,
	);

	const current = models.find((m) => m.id === modelId);
	const triggerLabel = current?.label
		? current.label
		: isLoading
			? t("model.loading")
			: t("model.label");

	const defaultProvider = providers.find(
		(p) => p.id === DEFAULT_PROVIDER_ID,
	);
	const customProviders = providers.filter(
		(p) => p.id !== DEFAULT_PROVIDER_ID,
	);

	const doSwitch = async (provider: ChatProvider) => {
		const ok = await switchProvider(provider.id);
		if (ok) {
			toast(t("provider.switched", { provider: provider.label }));
			await reload({ resetSelection: true });
		} else {
			toast.error(t("provider.switchError"));
		}
		return ok;
	};

	const handleSelectProvider = async (provider: ChatProvider) => {
		if (provider.isCurrent) return;
		// Custom providers must be configured before they can be used.
		if (needsApiKey(provider)) {
			setPendingSwitchId(provider.id);
			setConfigProvider(provider);
			setConfigOpen(true);
			return;
		}
		await doSwitch(provider);
	};

	const handleConfigSaved = async (
		providerId: string,
		config: { apiKey?: string; baseUrl?: string },
	) => {
		const ok = await configureProvider(providerId, config);
		if (ok && pendingSwitchId === providerId) {
			setPendingSwitchId(null);
			const provider = providers.find((p) => p.id === providerId);
			if (provider) await doSwitch({ ...provider, isCurrent: false });
		}
		return ok;
	};

	const openConfig = (provider: ChatProvider) => {
		setPendingSwitchId(null);
		setConfigProvider(provider);
		setConfigOpen(true);
	};

	const handleSetDefault = async (id: string) => {
		const ok = await saveDefaultModel(id);
		if (ok) {
			toast(
				id === "auto"
					? t("model.defaultReset")
					: t("model.defaultSet", { model: id }),
			);
		} else {
			toast.error(t("model.defaultError"));
		}
	};

	const renderProviderItem = (p: ChatProvider) => {
		const locked = needsApiKey(p);
		return (
			<DropdownMenuItem
				key={p.id}
				disabled={isSwitching}
				onSelect={(e) => {
					e.preventDefault();
					void handleSelectProvider(p);
				}}
				className="group/provider cursor-pointer items-center gap-2"
			>
				<span className="grid size-4 place-items-center">
					{p.isCurrent ? (
						<Check
							className="size-3.5 text-foreground"
							strokeWidth={1.8}
						/>
					) : null}
				</span>
				<span className="flex min-w-0 flex-1 flex-col">
					<span className="truncate text-[0.8125rem] font-medium text-foreground">
						{p.label}
					</span>
					{locked ? (
						<span className="inline-flex items-center gap-1 text-[0.6875rem] text-muted-foreground">
							<KeyRound className="size-3" strokeWidth={1.6} />
							{t("provider.apiKeyRequired")}
						</span>
					) : null}
				</span>
				{p.fields.length > 0 ? (
					<button
						type="button"
						aria-label={t("provider.configure", {
							provider: p.label,
						})}
						title={t("provider.configure", { provider: p.label })}
						className={cn(
							"grid size-6 shrink-0 place-items-center rounded-md",
							"text-muted-foreground opacity-0 group-hover/provider:opacity-100",
							"hover:bg-accent hover:text-foreground",
							"transition-colors focus-visible:opacity-100",
						)}
						onClick={(e) => {
							e.stopPropagation();
							e.preventDefault();
							openConfig(p);
						}}
					>
						<Settings2 className="size-3.5" strokeWidth={1.6} />
					</button>
				) : null}
			</DropdownMenuItem>
		);
	};

	return (
		<>
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
					<ChevronsUpDown
						className="size-3 opacity-70"
						strokeWidth={1.6}
					/>
				</DropdownMenuTrigger>
				<DropdownMenuContent
					align="start"
					side="top"
					className="min-w-[17rem] max-w-[22rem] rounded-[var(--radius-lg)]"
				>
					{/* ---- Default (local) provider --------------------------- */}
					{defaultProvider ? (
						<>
							<DropdownMenuLabel className="text-[0.6875rem] uppercase tracking-[0.16em] text-muted-foreground">
								{t("provider.defaultSection")}
							</DropdownMenuLabel>
							{renderProviderItem(defaultProvider)}
						</>
					) : null}

					{/* ---- Custom providers ----------------------------------- */}
					{customProviders.length > 0 ? (
						<>
							<DropdownMenuLabel className="text-[0.6875rem] uppercase tracking-[0.16em] text-muted-foreground">
								{t("provider.customSection")}
							</DropdownMenuLabel>
							{customProviders.map(renderProviderItem)}
							<DropdownMenuSeparator />
						</>
					) : null}

					{/* ---- Models of the active provider ---------------------- */}
					<DropdownMenuLabel className="flex items-center gap-2 text-[0.6875rem] uppercase tracking-[0.16em] text-muted-foreground">
						{t("model.sectionTitle", {
							provider: currentProvider?.label ?? "",
						})}
						{isLoading || isSwitching ? (
							<Spinner className="size-3" />
						) : null}
					</DropdownMenuLabel>

					{error ? (
						<div className="px-2 py-2 text-[0.75rem] text-destructive">
							{error}
						</div>
					) : null}

					{!error && !isLoading && models.length === 0 ? (
						<div className="px-2 py-2 text-[0.75rem] text-muted-foreground">
							{t("model.empty")}
						</div>
					) : null}

					{models.map((m) => {
						const active = m.id === modelId;
						const isDefault = m.id === defaultModel;
						return (
							<DropdownMenuItem
								key={m.id}
								disabled={m.isEmbedding}
								onSelect={() => setModelId(m.id)}
								className="group/model cursor-pointer items-start gap-2"
							>
								<span className="mt-0.5 grid size-4 place-items-center">
									{active ? (
										<Check
											className="size-3.5 text-foreground"
											strokeWidth={1.8}
										/>
									) : null}
								</span>
								<ModelLogo family={m.family} className="mt-0.5" />
								<span className="flex min-w-0 flex-1 flex-col">
									<span className="flex items-center gap-1.5">
										<span className="truncate text-[0.875rem] font-medium text-foreground">
											{m.label}
										</span>
										{isDefault ? (
											<span className="shrink-0 rounded-full bg-ai-tint px-1.5 py-px text-[0.625rem] font-medium text-ai ring-1 ring-inset ring-ai/20">
												{t("model.defaultBadge")}
											</span>
										) : null}
									</span>
									{m.tagline ? (
										<span className="truncate text-[0.6875rem] text-muted-foreground">
											{m.tagline}
										</span>
									) : null}
								</span>
								{!m.isEmbedding && !isDefault ? (
									<button
										type="button"
										aria-label={t("model.setDefault", {
											model: m.label,
										})}
										title={t("model.setDefault", {
											model: m.label,
										})}
										className={cn(
											"mt-0.5 grid size-6 shrink-0 place-items-center rounded-md",
											"text-muted-foreground opacity-0 group-hover/model:opacity-100",
											"hover:bg-accent hover:text-foreground",
											"transition-colors focus-visible:opacity-100",
										)}
										onClick={(e) => {
											e.stopPropagation();
											e.preventDefault();
											void handleSetDefault(m.id);
										}}
									>
										<Pin
											className="size-3.5"
											strokeWidth={1.6}
										/>
									</button>
								) : null}
							</DropdownMenuItem>
						);
					})}

					{defaultModel ? (
						<>
							<DropdownMenuSeparator />
							<DropdownMenuItem
								onSelect={(e) => {
									e.preventDefault();
									void handleSetDefault("auto");
								}}
								className="cursor-pointer gap-2 text-[0.8125rem] text-muted-foreground"
							>
								<RotateCcw
									className="size-3.5"
									strokeWidth={1.6}
								/>
								{t("model.resetDefault")}
							</DropdownMenuItem>
						</>
					) : null}
				</DropdownMenuContent>
			</DropdownMenu>

			<ProviderConfigDialog
				provider={configProvider}
				open={configOpen}
				onOpenChange={(open) => {
					setConfigOpen(open);
					if (!open) setPendingSwitchId(null);
				}}
				onSave={handleConfigSaved}
			/>
		</>
	);
}
