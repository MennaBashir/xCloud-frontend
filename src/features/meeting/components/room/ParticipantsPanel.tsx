import { useTranslation } from "react-i18next";
import { useMeeting, useParticipant } from "@videosdk.live/react-sdk";
import { Mic, MicOff, Video, VideoOff, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { useMeetingStore } from "../../store/meetingStore";

type ParticipantsPanelProps = {
	onClose: () => void;
};

function initials(name: string) {
	return name
		.trim()
		.split(/\s+/)
		.map((w) => w[0])
		.slice(0, 2)
		.join("")
		.toUpperCase();
}

function Row({ participantId }: { participantId: string }) {
	const { displayName, micOn, webcamOn, isLocal } =
		useParticipant(participantId);
	const meName = useMeetingStore((s) => s.participantName);

	return (
		<div className="flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-md)] hover:bg-white/6 transition-colors">
			<div className="grid place-items-center size-8 rounded-full bg-white/8 text-white text-[0.6875rem] font-semibold shrink-0">
				{initials(displayName || meName || "?")}
			</div>
			<div className="flex-1 min-w-0">
				<div className="flex items-center gap-1.5 text-[0.875rem] text-white truncate">
					<span className="truncate">
						{displayName || "—"}
					</span>
					{isLocal ? (
						<span className="text-[0.6875rem] text-white/45">
							(you)
						</span>
					) : null}
				</div>
			</div>
			<div className="flex items-center gap-1.5 text-white/65">
				{micOn ? (
					<Mic className="size-3.5" strokeWidth={1.6} />
				) : (
					<MicOff className="size-3.5 text-destructive" strokeWidth={1.6} />
				)}
				{webcamOn ? (
					<Video className="size-3.5" strokeWidth={1.6} />
				) : (
					<VideoOff className="size-3.5 text-destructive" strokeWidth={1.6} />
				)}
			</div>
		</div>
	);
}

export function ParticipantsPanel({ onClose }: ParticipantsPanelProps) {
	const { t } = useTranslation("meeting");
	const { participants } = useMeeting() as {
		participants: Map<string, unknown>;
	};
	const ids = Array.from(participants.keys());

	return (
		<aside
			className={cn(
				"flex flex-col w-full lg:w-[320px] h-full shrink-0",
				"border-s border-white/8 bg-zinc-950 text-white",
			)}
		>
			<header className="flex-none flex items-center justify-between gap-2 px-4 py-3 border-b border-white/8">
				<div className="flex flex-col">
					<span className="text-[0.875rem] font-semibold tracking-tight">
						{t("sidebar.participants")}
					</span>
					<span className="text-[0.6875rem] text-white/55">
						{t("participants.count", { count: ids.length })}
					</span>
				</div>
				<button
					type="button"
					onClick={onClose}
					aria-label={t("sidebar.close")}
					className="grid size-8 place-items-center rounded-full text-white/65 hover:bg-white/8 hover:text-white transition-colors"
				>
					<X className="size-3.5" strokeWidth={1.8} />
				</button>
			</header>

			<div className="flex-1 min-h-0 overflow-y-auto p-2">
				{ids.length === 0 ? (
					<p className="px-3 py-6 text-center text-[0.8125rem] text-white/55">
						{t("participants.empty")}
					</p>
				) : (
					<div className="flex flex-col gap-0.5">
						{ids.map((id) => (
							<Row key={id} participantId={id} />
						))}
					</div>
				)}
			</div>
		</aside>
	);
}
