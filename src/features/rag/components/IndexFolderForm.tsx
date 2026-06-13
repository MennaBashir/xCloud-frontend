import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FolderInput, Info, Square } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

const indexSchema = z.object({
	folderPath: z.string().trim().min(1, "rag:errors.pathRequired"),
	collectionName: z
		.string()
		.trim()
		.min(1, "rag:errors.collectionRequired")
		.regex(/^[a-zA-Z0-9_-]+$/, "rag:errors.collectionInvalid"),
});

type IndexFormValues = z.infer<typeof indexSchema>;

type IndexFolderFormProps = {
	isIndexing: boolean;
	progress: {
		phase: "starting" | "reading" | "embedding";
		done: number;
		total: number;
	} | null;
	onSubmit: (folderPath: string, collectionName: string) => Promise<boolean>;
	onCancel: () => void | Promise<void>;
};

export function IndexFolderForm({
	isIndexing,
	progress,
	onSubmit,
	onCancel,
}: IndexFolderFormProps) {
	const { t } = useTranslation("rag");

	const form = useForm<IndexFormValues>({
		resolver: zodResolver(indexSchema),
		mode: "onTouched",
		defaultValues: { folderPath: "", collectionName: "default" },
	});

	const submit = async (values: IndexFormValues) => {
		const ok = await onSubmit(values.folderPath, values.collectionName);
		if (ok) {
			form.reset({ folderPath: "", collectionName: "default" });
		}
	};

	const pathError = form.formState.errors.folderPath?.message;
	const nameError = form.formState.errors.collectionName?.message;

	return (
		<form
			onSubmit={form.handleSubmit(submit)}
			className="flex flex-col gap-4 p-5"
			noValidate
		>
			<div className="flex flex-col gap-1.5">
				<div className="flex items-center gap-2">
					<span className="grid size-7 place-items-center rounded-[var(--radius-sm)] bg-ai-tint text-ai ring-1 ring-inset ring-ai/20">
						<FolderInput className="size-3.5" strokeWidth={1.7} />
					</span>
					<h2 className="text-[0.9375rem] font-medium text-foreground">
						{t("index.title")}
					</h2>
				</div>
				<p className="text-[0.8125rem] text-muted-foreground leading-relaxed">
					{t("index.subtitle")}
				</p>
			</div>

			<div className="flex flex-col gap-1.5">
				<Label htmlFor="folderPath">{t("index.pathLabel")}</Label>
				<Input
					id="folderPath"
					placeholder={t("index.pathPlaceholder")}
					aria-invalid={Boolean(pathError)}
					aria-describedby="folderPath-help"
					className="font-mono text-[0.8125rem]"
					{...form.register("folderPath")}
				/>
				<p
					id="folderPath-help"
					className="flex items-start gap-1.5 text-[0.75rem] text-muted-foreground"
				>
					<Info className="size-3.5 shrink-0 mt-0.5" strokeWidth={1.6} />
					<span>{t("index.pathHelp")}</span>
				</p>
				{pathError ? (
					<p className="text-[0.75rem] text-destructive">{t(pathError)}</p>
				) : null}
			</div>

			<div className="flex flex-col gap-1.5">
				<Label htmlFor="collectionName">
					{t("index.collectionLabel")}
				</Label>
				<Input
					id="collectionName"
					placeholder="default"
					aria-invalid={Boolean(nameError)}
					className="font-mono text-[0.8125rem] max-w-[20rem]"
					{...form.register("collectionName")}
				/>
				{nameError ? (
					<p className="text-[0.75rem] text-destructive">{t(nameError)}</p>
				) : null}
			</div>

			{isIndexing ? (
				<div className="flex flex-col gap-3">
					<div className="flex items-center gap-3">
						<Button
							type="button"
							variant="outline"
							onClick={() => void onCancel()}
							className="gap-2"
						>
							<Square
								className="size-3 fill-current"
								strokeWidth={0}
							/>
							<span>{t("index.stop")}</span>
						</Button>
						<span className="inline-flex items-center gap-2 text-[0.75rem] text-muted-foreground">
							<Spinner className="size-4" />
							<span>
								{progress?.phase === "reading" ||
								progress?.phase === "starting"
									? t("index.phaseReading")
									: progress && progress.total > 0
										? t("index.progress", {
												done: progress.done,
												total: progress.total,
												percent: Math.round(
													(progress.done /
														progress.total) *
														100,
												),
											})
										: t("index.indexingHint")}
							</span>
						</span>
					</div>

					{progress?.phase === "embedding" &&
					progress.total > 0 ? (
						<div className="h-1.5 w-full max-w-[28rem] overflow-hidden rounded-full bg-surface-muted">
							<div
								className="h-full rounded-full bg-ai transition-[width] duration-[var(--duration-base)] ease-[cubic-bezier(0.32,0.72,0,1)]"
								style={{
									width: `${Math.min(
										100,
										Math.round(
											(progress.done / progress.total) *
												100,
										),
									)}%`,
								}}
							/>
						</div>
					) : null}
				</div>
			) : (
				<div>
					<Button type="submit" className="gap-2">
						<FolderInput className="size-4" strokeWidth={1.7} />
						<span>{t("index.submit")}</span>
					</Button>
				</div>
			)}
		</form>
	);
}
