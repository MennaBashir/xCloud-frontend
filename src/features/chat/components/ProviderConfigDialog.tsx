import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import type { ChatProvider } from "../types/chat";

type ProviderConfigDialogProps = {
	provider: ChatProvider | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onSave: (
		providerId: string,
		config: { apiKey?: string; baseUrl?: string },
	) => Promise<boolean>;
};

/**
 * Configure a custom LLM provider (API key / base URL).
 *
 * Fields come from the backend provider registry (`GET /llm/providers`) so
 * new providers show up automatically. Secret fields never echo the stored
 * value — a placeholder indicates one is already saved.
 */
export function ProviderConfigDialog({
	provider,
	open,
	onOpenChange,
	onSave,
}: ProviderConfigDialogProps) {
	const { t } = useTranslation("chat");
	const [values, setValues] = useState<Record<string, string>>({});
	const [isSaving, setIsSaving] = useState(false);

	useEffect(() => {
		if (open) setValues({});
	}, [open, provider?.id]);

	if (!provider) return null;

	const handleSave = async () => {
		setIsSaving(true);
		const ok = await onSave(provider.id, {
			apiKey: values.api_key || undefined,
			baseUrl: values.base_url || undefined,
		});
		setIsSaving(false);
		if (ok) {
			toast(t("provider.configSaved", { provider: provider.label }));
			onOpenChange(false);
		} else {
			toast.error(t("provider.configError"));
		}
	};

	const hasInput = Object.values(values).some((v) => v.trim().length > 0);

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>
						{t("provider.configTitle", { provider: provider.label })}
					</DialogTitle>
					<DialogDescription>
						{t("provider.configDescription")}
					</DialogDescription>
				</DialogHeader>

				<div className="flex flex-col gap-4 py-2">
					{provider.fields.map((field) => (
						<div key={field.key} className="flex flex-col gap-2">
							<Label htmlFor={`provider-${provider.id}-${field.key}`}>
								{field.label}
							</Label>
							<Input
								id={`provider-${provider.id}-${field.key}`}
								type={field.secret ? "password" : "text"}
								autoComplete="off"
								placeholder={
									field.secret && field.hasValue
										? t("provider.secretSaved")
										: field.placeholder ||
											field.label
								}
								value={values[field.key] ?? ""}
								onChange={(e) =>
									setValues((v) => ({
										...v,
										[field.key]: e.target.value,
									}))
								}
							/>
						</div>
					))}
				</div>

				<DialogFooter>
					<Button
						variant="outline"
						onClick={() => onOpenChange(false)}
						disabled={isSaving}
					>
						{t("provider.cancel")}
					</Button>
					<Button
						onClick={handleSave}
						disabled={isSaving || !hasInput}
					>
						{isSaving
							? t("provider.saving")
							: t("provider.save")}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
