import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRight, RotateCw, Video } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useMeetingStore } from "../../store/meetingStore";

export function LeaveScreen() {
	const { t } = useTranslation("meeting");
	const navigate = useNavigate();
	const reset = useMeetingStore((s) => s.reset);

	const handleRejoin = () => {
		reset();
	};

	const handleReturn = () => {
		reset();
		navigate("/app");
	};

	return (
		<div className="relative isolate min-h-[100dvh] grid place-items-center bg-zinc-950 text-white overflow-hidden px-6">
			<div
				aria-hidden="true"
				className="absolute inset-0 -z-10 opacity-80"
				style={{
					background: `
						radial-gradient(at 30% 30%, oklch(0.55 0.2 285 / 0.18) 0px, transparent 50%),
						radial-gradient(at 70% 70%, oklch(0.62 0.19 245 / 0.16) 0px, transparent 55%),
						linear-gradient(180deg, oklch(0.14 0.02 280) 0%, oklch(0.08 0.01 270) 100%)
					`,
				}}
			/>

			<div className="flex flex-col items-center gap-6 text-center max-w-[440px]">
				<div className="grid place-items-center size-16 rounded-full bg-white/8 ring-1 ring-inset ring-white/12">
					<Video className="size-6" strokeWidth={1.6} />
				</div>

				<div className="flex flex-col gap-2">
					<h1 className="font-semibold tracking-tight text-[2rem] leading-tight">
						{t("leave.title")}
					</h1>
					<p className="text-[0.9375rem] leading-relaxed text-white/65">
						{t("leave.subtitle")}
					</p>
				</div>

				<div className="flex items-center gap-2 flex-wrap justify-center">
					<Button
						onClick={handleRejoin}
						className="gap-2 bg-white text-zinc-950 hover:bg-white/95"
					>
						<RotateCw className="size-3.5" strokeWidth={1.8} />
						<span>{t("leave.newMeeting")}</span>
					</Button>
					<Button
						onClick={handleReturn}
						variant="outline"
						className="gap-2 bg-transparent border-white/15 text-white hover:bg-white/8 hover:text-white"
					>
						<span>{t("leave.returnHome")}</span>
						<ArrowRight className="size-3.5 rtl-flip" strokeWidth={1.8} />
					</Button>
				</div>
			</div>
		</div>
	);
}
