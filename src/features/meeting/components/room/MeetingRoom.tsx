import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useMeeting } from "@videosdk.live/react-sdk";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { useMeetingStore } from "../../store/meetingStore";
import { ConnectingScreen } from "../screens/ConnectingScreen";
import { ParticipantGrid } from "./ParticipantGrid";
import { PresenterView } from "./PresenterView";
import { BottomBar } from "./BottomBar";
import { ChatPanel } from "./ChatPanel";
import { ParticipantsPanel } from "./ParticipantsPanel";
import type { RecordingControlHandle } from "./RecordingControl";

export function MeetingRoom() {
	const { t } = useTranslation("meeting");
	const navigate = useNavigate();
	const sideBar = useMeetingStore((s) => s.sideBar);
	const setSideBar = useMeetingStore((s) => s.setSideBar);
	const setMeetingActive = useMeetingStore((s) => s.setMeetingActive);
	const setMode = useMeetingStore((s) => s.setMode);
	const autoRecord = useMeetingStore((s) => s.autoRecord);

	const [activeSpeakerId, setActiveSpeakerId] = useState<string | null>(null);
	const [presenterId, setPresenterId] = useState<string | null>(null);
	const [connected, setConnected] = useState(false);

	// Track whether we've ever successfully joined. If we receive `onMeetingLeft`
	// or `onError` BEFORE joining once, we treat it as a fatal init error and
	// bail back to pre-join instead of toggling `isMeetingActive`. This is the
	// guard that prevents the re-render loop.
	const everJoinedRef = useRef(false);

	// Recording handle (forwarded through BottomBar). Used to imperatively
	// trigger auto-start exactly once when the user joined with `autoRecord`.
	const recorderRef = useRef<RecordingControlHandle | null>(null);
	const autoRecordTriggeredRef = useRef(false);

	const { participants, localParticipant } = useMeeting({
		onMeetingJoined: () => {
			everJoinedRef.current = true;
			setConnected(true);
			setMeetingActive(true);
		},
		onMeetingLeft: () => {
			// Only react to a real "left" event — i.e. after we've actually been
			// in the meeting. Ignore the spurious one VideoSDK fires during init
			// errors, otherwise we'd toggle isMeetingActive and unmount.
			if (!everJoinedRef.current) return;
			setMeetingActive(false);
			setMode("left");
		},
		onParticipantJoined: (p: { displayName?: string }) => {
			toast(t("toasts.joined", { name: p?.displayName ?? "Guest" }));
		},
		onParticipantLeft: (p: { displayName?: string }) => {
			toast(t("toasts.left", { name: p?.displayName ?? "Guest" }));
		},
		onSpeakerChanged: (id: string | null) => {
			setActiveSpeakerId(id);
		},
		onPresenterChanged: (id: string | null) => {
			setPresenterId(id);
		},
		onError: (err: { message?: string; code?: string }) => {
			const message = err?.message ?? "Meeting error";
			toast.error(message);
			// If we never made it into the meeting, treat as fatal init failure:
			// surface the error and return to pre-join cleanly.
			if (!everJoinedRef.current) {
				setMeetingActive(false);
				setMode("joining");
				navigate("/app/meeting", { replace: true });
			}
		},
	}) as {
		participants: Map<string, { id?: string }>;
		localParticipant: { id?: string } | null;
	};

	// Safety net: if we don't get `onMeetingJoined` within 20s, bail back to
	// pre-join with an error. This catches stuck-on-connecting scenarios
	// (network issues, invalid token, etc.) without trapping the user.
	useEffect(() => {
		if (connected) return;
		const id = window.setTimeout(() => {
			if (everJoinedRef.current || connected) return;
			toast.error(t("prejoin.errors.createFailed"));
			setMeetingActive(false);
			setMode("joining");
		}, 20_000);
		return () => window.clearTimeout(id);
	}, [connected, setMeetingActive, setMode, t]);

	// Auto-record: once we're connected AND the user opted in, kick off
	// recording on the recorder's imperative handle. Exactly once per join.
	useEffect(() => {
		if (!connected) return;
		if (!autoRecord) return;
		if (autoRecordTriggeredRef.current) return;
		autoRecordTriggeredRef.current = true;

		// Give the BottomBar a frame to mount and attach the ref before we fire.
		const id = window.setTimeout(async () => {
			const handle = recorderRef.current;
			if (!handle) return;
			const ok = await handle.start();
			if (ok) {
				toast.success(t("recording.autoStarted"));
			} else {
				// `start()` already surfaced the specific error via toast.
				// We add a hint so the user knows the manual control still exists.
				toast(t("recording.error.autoFailed"));
			}
		}, 400);

		return () => window.clearTimeout(id);
	}, [connected, autoRecord, t]);

	const ids = useMemo(
		() => Array.from(participants.keys()),
		[participants],
	);
	const others = useMemo(
		() => ids.filter((id) => id !== presenterId),
		[ids, presenterId],
	);

	const localId = localParticipant?.id ?? null;

	if (!connected) {
		return <ConnectingScreen />;
	}

	return (
		<div className="fixed inset-0 z-50 flex flex-col bg-zinc-950 text-white">
			{/* Stage */}
			<div className="flex-1 min-h-0 flex">
				<main className="flex-1 min-w-0 p-3 sm:p-5 flex flex-col">
					{presenterId ? (
						<PresenterView
							presenterId={presenterId}
							otherIds={others}
							localId={localId}
						/>
					) : (
						<ParticipantGrid
							participantIds={ids}
							activeSpeakerId={activeSpeakerId}
						/>
					)}
				</main>

				{/* Side panel */}
				<div
					className={cn(
						"transition-[width] duration-[var(--duration-base)] ease-[cubic-bezier(0.32,0.72,0,1)] overflow-hidden",
						sideBar ? "w-full sm:w-[320px] lg:w-[360px]" : "w-0",
					)}
				>
					{sideBar === "chat" ? (
						<ChatPanel
							onClose={() => setSideBar(null)}
							selfSenderId={localId ?? undefined}
						/>
					) : null}
					{sideBar === "participants" ? (
						<ParticipantsPanel onClose={() => setSideBar(null)} />
					) : null}
				</div>
			</div>

			<BottomBar
				ref={recorderRef}
				participantCount={ids.length}
				isPresenter={presenterId === localId}
			/>
		</div>
	);
}
