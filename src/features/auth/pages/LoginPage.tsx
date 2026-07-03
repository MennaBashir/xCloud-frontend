import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AlertCircle } from "lucide-react";

import { AuthLayout } from "../components/AuthLayout";
import { GoogleSignInButton } from "../components/GoogleSignInButton";
import { HowItWorks } from "../components/HowItWorks";
import { useAuth } from "../hooks/useAuth";
import { useAuthStore } from "../store/authStore";
import type { User } from "../types/user";

export default function LoginPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { loginWithGoogle, status, error, clearError } = useAuth();

  useEffect(() => {
    clearError();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isSubmitting = status === "authenticating";

  const handleGoogle = async () => {
    try {
      await loginWithGoogle();
      const from = params.get("from");
      navigate(from && from.startsWith("/") ? from : "/app", {
        replace: true,
      });
    } catch {
      /* error already set on store (or cancelled) */
    }
  };

  const handleDevSkip = () => {
    const devUser: User = {
      id: "dev-user",
      username: "developer",
      name: "Developer",
      email: "dev@sprintifai.com",
      role: "admin",
      videoSdkToken: import.meta.env.VITE_VIDEOSDK_TOKEN ?? "",
      workspaceId: "dev-workspace",
      createdAt: new Date().toISOString(),
    };
    useAuthStore.setState({
      user: devUser,
      token: "dev-token",
      status: "authenticated",
      error: null,
    });
    navigate("/app", { replace: true });
  };

  const errorMessage = error
    ? t(`auth:google.errors.${error.code}`, { defaultValue: error.message })
    : null;

  return (
    <AuthLayout
      eyebrow={t("brand.name")}
      title={t("auth:login.title")}
      subtitle={t("auth:login.subtitle")}
    >
      <div className="flex flex-col gap-5">
        {errorMessage ? (
          <div
            role="alert"
            className="flex items-start gap-2.5 rounded-[var(--radius-md)] border border-destructive/30 bg-destructive/10 px-3.5 py-3 text-[0.875rem] text-destructive"
          >
            <AlertCircle className="size-4 shrink-0 mt-0.5" strokeWidth={1.6} />
            <span>{errorMessage}</span>
          </div>
        ) : null}

        <GoogleSignInButton
          label={t("auth:google.signIn")}
          loading={isSubmitting}
          onClick={handleGoogle}
        />

        <p className="text-[0.8125rem] leading-relaxed text-muted-foreground text-center">
          {t("auth:google.loginHint")}
        </p>

        <p className="text-[0.75rem] leading-relaxed text-muted-foreground/80 text-center">
          {t("auth:google.terms")}
        </p>

        <HowItWorks />

        <button
          type="button"
          onClick={handleDevSkip}
          className="mt-2 rounded-[var(--radius-md)] border border-dashed border-border bg-muted/40 px-3.5 py-2.5 text-[0.8125rem] font-medium text-muted-foreground transition-colors duration-[var(--duration-fast)] [transition-timing-function:var(--ease-out-soft)] hover:bg-muted hover:text-foreground active:scale-[0.98]"
        >
          Skip login (dev)
        </button>
      </div>
    </AuthLayout>
  );
}
