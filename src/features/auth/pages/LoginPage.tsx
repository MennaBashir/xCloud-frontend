import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, ArrowRight, AlertCircle } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

import { AuthLayout } from "../components/AuthLayout";
import { SsoButtonRow } from "../components/SsoButtonRow";
import {
	loginSchema,
	type LoginFormValues,
} from "../schemas/loginSchema";
import { useAuth } from "../hooks/useAuth";

export default function LoginPage() {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const [params] = useSearchParams();
	const { login, status, error, clearError } = useAuth();
	const [showPassword, setShowPassword] = useState(false);

	const form = useForm<LoginFormValues>({
		resolver: zodResolver(loginSchema),
		mode: "onTouched",
		defaultValues: { username: "", password: "" },
	});

	useEffect(() => {
		// Reset any stale error from a previous failed attempt when the page mounts
		clearError();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const onSubmit = async (values: LoginFormValues) => {
		try {
			await login(values);
			const from = params.get("from");
			navigate(from && from.startsWith("/") ? from : "/app", {
				replace: true,
			});
		} catch {
			/* error already set on store */
		}
	};

	const isSubmitting = status === "authenticating";

	return (
		<AuthLayout
			eyebrow={t("brand.name")}
			title={t("auth:login.title")}
			subtitle={t("auth:login.subtitle")}
			footer={
				<span>
					{t("auth:login.noAccount")}{" "}
					<Link
						to="/signup"
						className="text-foreground font-medium underline-offset-4 hover:underline"
					>
						{t("auth:login.signUpCta")}
					</Link>
				</span>
			}
		>
			<div className="flex flex-col gap-5">
				{error ? (
					<div
						role="alert"
						className="flex items-start gap-2.5 rounded-[var(--radius-md)] border border-destructive/30 bg-destructive/10 px-3.5 py-3 text-[0.875rem] text-destructive"
					>
						<AlertCircle className="size-4 shrink-0 mt-0.5" strokeWidth={1.6} />
						<span>{error.message}</span>
					</div>
				) : null}

				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="flex flex-col gap-4"
					noValidate
				>
					<Field
						id="username"
						label={t("auth:login.usernameLabel")}
						placeholder={t("auth:login.usernamePlaceholder")}
						type="text"
						autoComplete="username"
						error={form.formState.errors.username?.message}
						register={form.register("username")}
					/>

					<Field
						id="password"
						label={t("auth:login.passwordLabel")}
						placeholder={t("auth:login.passwordPlaceholder")}
						type={showPassword ? "text" : "password"}
						autoComplete="current-password"
						error={form.formState.errors.password?.message}
						register={form.register("password")}
						trailing={
							<button
								type="button"
								onClick={() => setShowPassword((v) => !v)}
								aria-label={showPassword ? "Hide password" : "Show password"}
								className="grid size-7 place-items-center rounded-[var(--radius-xs)] text-muted-foreground hover:text-foreground transition-colors"
							>
								{showPassword ? (
									<EyeOff className="size-3.5" strokeWidth={1.6} />
								) : (
									<Eye className="size-3.5" strokeWidth={1.6} />
								)}
							</button>
						}
						footer={
							<div className="flex justify-end">
								<Link
									to="/forgot-password"
									className="text-[0.8125rem] text-muted-foreground hover:text-foreground transition-colors"
								>
									{t("auth:login.forgotPassword")}
								</Link>
							</div>
						}
					/>

					<Button
						type="submit"
						size="lg"
						disabled={isSubmitting}
						className="mt-2 gap-2"
					>
						{isSubmitting ? (
							<>
								<Spinner className="size-4" />
								<span>{t("states.loading")}</span>
							</>
						) : (
							<>
								<span>{t("auth:login.submit")}</span>
								<ArrowRight className="size-4 rtl-flip" strokeWidth={1.8} />
							</>
						)}
					</Button>
				</form>

				<SsoButtonRow />
			</div>
		</AuthLayout>
	);
}

type FieldProps = {
	id: string;
	label: string;
	placeholder?: string;
	type?: string;
	autoComplete?: string;
	error?: string;
	register: ReturnType<ReturnType<typeof useForm>["register"]>;
	trailing?: React.ReactNode;
	footer?: React.ReactNode;
};

function Field({
	id,
	label,
	placeholder,
	type = "text",
	autoComplete,
	error,
	register,
	trailing,
	footer,
}: FieldProps) {
	const { t } = useTranslation();
	// Error messages are i18n keys like "auth:errors.invalidEmail".
	// react-i18next supports the "namespace:key" lookup natively.
	const errorText = error ? t(error) : null;

	return (
		<div className="flex flex-col gap-1.5">
			<label
				htmlFor={id}
				className="text-[0.8125rem] font-medium text-foreground"
			>
				{label}
			</label>

			<div className="relative">
				<Input
					id={id}
					type={type}
					placeholder={placeholder}
					autoComplete={autoComplete}
					aria-invalid={Boolean(error)}
					aria-describedby={error ? `${id}-error` : undefined}
					className={cn(trailing && "pe-12")}
					{...register}
				/>
				{trailing ? (
					<div className="absolute inset-y-0 end-2 flex items-center">
						{trailing}
					</div>
				) : null}
			</div>

			{errorText ? (
				<p
					id={`${id}-error`}
					className="text-[0.75rem] text-destructive"
				>
					{errorText}
				</p>
			) : null}

			{footer}
		</div>
	);
}
