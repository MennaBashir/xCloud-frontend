import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Send } from "lucide-react";

import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/shared/i18n/LanguageProvider";

import { sendDraft } from "../services/gmailService";
import { useGmailStore } from "../store/gmailStore";

type ComposeDrawerProps = {
	onSent: () => void;
};

export function ComposeDrawer({ onSent }: ComposeDrawerProps) {
	const { t } = useTranslation("gmail");
	const { isRtl } = useLanguage();
	const open = useGmailStore((s) => s.composeOpen);
	const close = useGmailStore((s) => s.closeCompose);

	const [to, setTo] = useState("");
	const [subject, setSubject] = useState("");
	const [body, setBody] = useState("");
	const [sending, setSending] = useState(false);
	const [errors, setErrors] = useState<{ to?: string; subject?: string }>({});

	const resetForm = () => {
		setTo("");
		setSubject("");
		setBody("");
		setErrors({});
	};

	const handleSend = async () => {
		const nextErrors: typeof errors = {};
		if (!to.trim()) nextErrors.to = t("validation.recipientRequired");
		if (!subject.trim()) nextErrors.subject = t("validation.subjectRequired");
		if (Object.keys(nextErrors).length > 0) {
			setErrors(nextErrors);
			return;
		}

		setSending(true);
		try {
			await sendDraft({ to, subject, body });
			toast.success(t("thread.sent"));
			resetForm();
			close();
			onSent();
		} finally {
			setSending(false);
		}
	};

	return (
		<Sheet
			open={open}
			onOpenChange={(o) => {
				if (!o) {
					resetForm();
					close();
				}
			}}
		>
			<SheetContent
				side={isRtl ? "left" : "right"}
				className="w-[28rem] sm:w-[34rem] max-w-[100vw] p-0 flex flex-col"
			>
				<SheetHeader className="px-6 pt-6 pb-4 border-b border-border">
					<SheetTitle className="text-[1.0625rem] font-semibold tracking-tight">
						{t("compose.title")}
					</SheetTitle>
					<SheetDescription className="sr-only">
						{t("compose.title")}
					</SheetDescription>
				</SheetHeader>

				<div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-4">
					<div className="flex flex-col gap-1.5">
						<Label
							htmlFor="compose-to"
							className="text-[0.8125rem] font-medium"
						>
							{t("compose.to")}
						</Label>
						<Input
							id="compose-to"
							type="email"
							placeholder={t("compose.toPlaceholder")}
							value={to}
							onChange={(e) => setTo(e.target.value)}
							aria-invalid={Boolean(errors.to)}
						/>
						{errors.to ? (
							<p className="text-[0.75rem] text-destructive">{errors.to}</p>
						) : null}
					</div>

					<div className="flex flex-col gap-1.5">
						<Label
							htmlFor="compose-subject"
							className="text-[0.8125rem] font-medium"
						>
							{t("compose.subject")}
						</Label>
						<Input
							id="compose-subject"
							placeholder={t("compose.subjectPlaceholder")}
							value={subject}
							onChange={(e) => setSubject(e.target.value)}
							aria-invalid={Boolean(errors.subject)}
						/>
						{errors.subject ? (
							<p className="text-[0.75rem] text-destructive">
								{errors.subject}
							</p>
						) : null}
					</div>

					<div className="flex flex-col gap-1.5 flex-1">
						<Label
							htmlFor="compose-body"
							className="text-[0.8125rem] font-medium"
						>
							{t("compose.body")}
						</Label>
						<Textarea
							id="compose-body"
							placeholder={t("compose.bodyPlaceholder")}
							value={body}
							onChange={(e) => setBody(e.target.value)}
							rows={12}
							className="resize-none min-h-[300px]"
						/>
					</div>
				</div>

				<footer
					className="border-t border-border px-6 pt-4 flex items-center justify-between gap-2"
					style={{
						paddingBottom: "max(1rem, env(safe-area-inset-bottom))",
					}}
				>
					<Button variant="ghost" size="sm" onClick={() => close()}>
						{t("actions.discard")}
					</Button>
					<Button
						size="sm"
						onClick={handleSend}
						disabled={sending}
						className={cn("gap-2")}
					>
						{sending ? (
							<>
								<Spinner className="size-3.5" />
								<span>{t("compose.sending")}</span>
							</>
						) : (
							<>
								<Send className="size-3.5 rtl-flip" strokeWidth={1.6} />
								<span>{t("actions.send")}</span>
							</>
						)}
					</Button>
				</footer>
			</SheetContent>
		</Sheet>
	);
}
