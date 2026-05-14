import { useEffect, useMemo, useRef, useState } from "react";
import { MeetingProvider } from "@videosdk.live/react-sdk";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { useAuthStore, selectUser } from "@/features/auth/store/authStore";

import { resolveVideoSdkToken } from "../lib/videosdk-config";
import { useMeetingStore } from "../store/meetingStore";
import { PreJoinScreen } from "../components/pre-join/PreJoinScreen";
import { MeetingRoom } from "../components/room/MeetingRoom";
import { LeaveScreen } from "../components/screens/LeaveScreen";

type JoinInput = { meetingId: string; participantName: string };

export default function MeetingPage() {
	const { t } = useTranslation("meeting");
	const user = useAuthStore(selectUser);
	const mode = useMeetingStore((s) => s.mode);
	const meetingId = useMeetingStore((s) => s.meetingId);
	const participantName = useMeetingStore((s) => s.participantName);
	const micOn = useMeetingStore((s) => s.micOn);
	const webcamOn = useMeetingStore((s) => s.webcamOn);
	const setMode = useMeetingStore((s) => s.setMode);
	const setMeetingId = useMeetingStore((s) => s.setMeetingId);

	// Token captured at join-time — so MeetingProvider's `token` prop is
	// stable while the meeting is active and doesn't trigger re-inits.
	const [activeToken, setActiveToken] = useState<string>("");
	const hasJoinedRef = useRef(false);

	// On unmount, reset hasJoined flag so the next entry can join cleanly.
	useEffect(() => {
		return () => {
			hasJoinedRef.current = false;
		};
	}, []);

	const handleJoin = (input: JoinInput) => {
		// Resolve token once, up-front. If missing, abort and stay on pre-join.
		const token = resolveVideoSdkToken();
		if (!token) {
			toast.error(t("prejoin.errors.createFailed"), {
				description: t("prejoin.errors.permission"),
			});
			return;
		}
		setActiveToken(token);
		setMeetingId(input.meetingId);
		// Mark mode last — once everything is staged, the MeetingProvider
		// can mount with stable, complete props.
		setMode("active");
		hasJoinedRef.current = true;
	};

	// Memoize the MeetingProvider config so reference equality is stable
	// while the meeting is active. Reference changes would cause the
	// provider to reinit and tear down the local media stream.
	const providerConfig = useMemo(
		() => ({
			meetingId,
			micEnabled: micOn,
			webcamEnabled: webcamOn,
			name: participantName,
			participantId: user?.id,
			debugMode: false,
		}),
		// IMPORTANT: do NOT depend on `micOn`/`webcamOn` after join — that
		// would re-init the meeting on every toggle. The SDK exposes
		// toggleMic/toggleWebcam for runtime control.
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[meetingId, participantName, user?.id],
	);

	if (mode === "left") {
		return <LeaveScreen />;
	}

	if (
		mode === "active" &&
		meetingId &&
		participantName &&
		activeToken
	) {
		return (
			<MeetingProvider
				config={providerConfig}
				token={activeToken}
				joinWithoutUserInteraction={true}
				reinitialiseMeetingOnConfigChange={false}
			>
				<MeetingRoom />
			</MeetingProvider>
		);
	}

	// Default: pre-join. If something forced active mode without complete
	// state, falling back here keeps the user safe.
	return <PreJoinScreen onJoin={handleJoin} />;
}
