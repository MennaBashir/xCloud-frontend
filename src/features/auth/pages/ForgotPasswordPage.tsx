import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

import { AuthLayout } from "../components/AuthLayout";
import {
	forgotSchema,
	type ForgotFormValues,
} from "../schemas/forgotSchema";
import { useAuth } from "../hooks/useAuth";

export default function ForgotPasswordPage() {
	const { t } = useTranslation();
	const { requestPasswordReset } = useAuth();
	const [status, setStatus] = useState<"idle" | "submitting" | "sent">(
		"idle",
	);

	const form = useForm<ForgotFormValues>({
		resolver: zodResolver(forgotSchema),
		mode: "onTouched",
		defaultValues: { email: "" },
	});

	const onSubmit = async (values: ForgotFormValues) => {
		setStatus("submitting");
		await requestPasswordReset(values.email);
		setStatus("sent");
	};

	return (
		<AuthLayout
			eyebrow={t("brand.name")}
			title={t("auth:forgot.title")}
			subtitle={t("auth:forgot.subtitle")}
			footer={
				<Link
					to="/login"
					className="inline-flex items-center gap-1.5 text-foreground font-medium hover:underline underline-offset-4"
				>
					<ArrowLeft className="size-3.5 rtl-flip" strokeWidth={1.8} />
					{t("auth:forgot.backToLogin")}
				</Link>
			}
		>
			{status === "sent" ? (
				<div className="flex flex-col gap-4 rounded-[var(--radius-lg)] border border-success/30 bg-[color-mix(in_oklch,var(--success)_10%,transparent)] px-5 py-5 text-foreground">
					<div className="grid size-10 place-items-center rounded-full bg-success/15 text-success">
						<CheckCircle2 className="size-5" strokeWidth={1.6} />
					</div>
					<p className="text-[0.9375rem] leading-relaxed">
						{t("auth:forgot.success")}
					</p>
				</div>
			) : (
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="flex flex-col gap-4"
					noValidate
				>
					<EmailField
						label={t("auth:login.emailLabel")}
						placeholder={t("auth:login.emailPlaceholder")}
						error={form.formState.errors.email?.message}
						register={form.register("email")}
					/>

					<Button
						type="submit"
						size="lg"
						disabled={status === "submitting"}
						className="mt-2 gap-2"
					>
						{status === "submitting" ? (
							<>
								<Spinner className="size-4" />
								<span>{t("states.loading")}</span>
							</>
						) : (
							<span>{t("auth:forgot.submit")}</span>
						)}
					</Button>
				</form>
			)}
		</AuthLayout>
	);
}

type EmailFieldProps = {
	label: string;
	placeholder?: string;
	error?: string;
	register: ReturnType<ReturnType<typeof useForm>["register"]>;
};

function EmailField({ label, placeholder, error, register }: EmailFieldProps) {
	const { t } = useTranslation();
	const errorText = error ? t(error) : null;

	return (
		<div className="flex flex-col gap-1.5">
			<label
				htmlFor="email"
				className="text-[0.8125rem] font-medium text-foreground"
			>
				{label}
			</label>
			<Input
				id="email"
				type="email"
				placeholder={placeholder}
				autoComplete="email"
				aria-invalid={Boolean(error)}
				aria-describedby={error ? "email-error" : undefined}
				{...register}
			/>
			{errorText ? (
				<p id="email-error" className="text-[0.75rem] text-destructive">
					{errorText}
				</p>
			) : null}
		</div>
	);
}
