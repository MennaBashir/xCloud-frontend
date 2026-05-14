import { forwardRef, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useMeeting } from "@videosdk.live/react-sdk";
import { toast } from "sonner";
import {
	Copy,
	Mic,
	MicOff,
	MessageSquare,
	Monitor,
	MonitorOff,
	PhoneOff,
	Users,
	Video,
	VideoOff,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { useMeetingStore } from "../../store/meetingStore";
import { ControlButton } from "./ControlButton";
import {
	RecordingControl,
	type RecordingControlHandle,
} from "./RecordingControl";

type BottomBarProps = {
	participantCount: number;
	isPresenter: boolean;
};

/**
 * Forwarded ref → RecordingControlHandle so the parent (MeetingRoom) can
 * imperatively start/stop the recorder when auto-record is enabled.
 */
export const BottomBar = forwardRef<RecordingControlHandle, BottomBarProps>(
	function BottomBar({ participantCount, isPresenter }, recorderRef) {
		const { t } = useTranslation("meeting");
		const navigate = useNavigate();
		const sideBar = useMeetingStore((s) => s.sideBar);
		const toggleSideBar = useMeetingStore((s) => s.toggleSideBar);
		const setMode = useMeetingStore((s) => s.setMode);
		const setMeetingActive = useMeetingStore((s) => s.setMeetingActive);
		const meetingId = useMeetingStore((s) => s.meetingId);

		const {
			toggleMic,
			toggleWebcam,
			toggleScreenShare,
			leave,
			localMicOn,
			localWebcamOn,
		} = useMeeting() as {
			toggleMic: () => void;
			toggleWebcam: () => void;
			toggleScreenShare: () => void;
			leave: () => void;
			localMicOn: boolean;
			localWebcamOn: boolean;
		};

		const [copyState, setCopyState] = useState<"idle" | "copied">("idle");

		const handleLeave = useCallback(() => {
			// Stop any active recording first so the file is flushed and
			// available for download on the leave screen / via the prior
			// download button in the bottom bar.
			try {
				if (
					recorderRef &&
					typeof recorderRef === "object" &&
					"current" in recorderRef &&
					recorderRef.current
				) {
					const state = recorderRef.current.getState();
					if (state === "recording") {
						recorderRef.current.stop();
					}
				}
			} catch {
				/* noop */
			}

			try {
				leave();
			} catch {
				/* noop */
			}
			setMeetingActive(false);
			setMode("left");
			navigate("/app/meeting");
		}, [leave, navigate, recorderRef, setMeetingActive, setMode]);

		const handleCopyInvite = async () => {
			if (!meetingId) return;
			try {
				await navigator.clipboard.writeText(meetingId);
				setCopyState("copied");
				toast.success(t("toasts.linkCopied"));
				window.setTimeout(() => setCopyState("idle"), 1800);
			} catch {
				/* noop */
			}
		};

		return (
			<div
				className={cn(
					"flex-none px-3 sm:px-6 py-3",
					"border-t border-white/8 bg-zinc-950/85 backdrop-blur-md",
				)}
			>
				<div className="flex items-center gap-3">
					{/* Meeting ID + copy */}
					<button
						type="button"
						onClick={handleCopyInvite}
						className={cn(
							"hidden sm:inline-flex items-center gap-2 h-9 px-3 rounded-full",
							"bg-white/6 border border-white/10 text-white/80",
							"text-[0.75rem] font-mono",
							"hover:bg-white/12 hover:text-white transition-colors",
						)}
						aria-label={t("controls.copyLink")}
					>
						<Copy className="size-3" strokeWidth={1.8} />
						<span>
							{meetingId.slice(0, 16)}
							{meetingId.length > 16 ? "…" : ""}
						</span>
						<span className="text-[0.625rem] text-white/45 uppercase tracking-[0.16em] ms-1">
							{copyState === "copied"
								? t("controls.copied")
								: t("controls.copyLink")}
						</span>
					</button>

					{/* Center cluster */}
					<div className="flex-1 flex items-center justify-center gap-2">
						<ControlButton
							icon={localMicOn ? Mic : MicOff}
							label={
								localMicOn ? t("controls.micOn") : t("controls.micOff")
							}
							pressed={!localMicOn}
							variant={localMicOn ? "neutral" : "danger"}
							onClick={() => toggleMic()}
						/>
						<ControlButton
							icon={localWebcamOn ? Video : VideoOff}
							label={
								localWebcamOn
									? t("controls.camOn")
									: t("controls.camOff")
							}
							pressed={!localWebcamOn}
							variant={localWebcamOn ? "neutral" : "danger"}
							onClick={() => toggleWebcam()}
						/>
						<ControlButton
							icon={isPresenter ? MonitorOff : Monitor}
							label={
								isPresenter
									? t("controls.stopSharing")
									: t("controls.shareScreen")
							}
							pressed={isPresenter}
							onClick={() => toggleScreenShare()}
						/>
						{/* Single recording instance — visible on all sizes,
						    centered with the rest of the cluster. */}
						<RecordingControl ref={recorderRef} />
						<ControlButton
							icon={MessageSquare}
							label={t("controls.chat")}
							pressed={sideBar === "chat"}
							onClick={() => toggleSideBar("chat")}
						/>
						<ControlButton
							icon={Users}
							label={t("controls.participants")}
							pressed={sideBar === "participants"}
							badge={participantCount > 1 ? participantCount : null}
							onClick={() => toggleSideBar("participants")}
						/>
					</div>

					{/* Leave — right cluster */}
					<ControlButton
						icon={PhoneOff}
						label={t("controls.leave")}
						variant="destructive"
						onClick={handleLeave}
						className="!size-11"
					/>
				</div>
			</div>
		);
	},
);
