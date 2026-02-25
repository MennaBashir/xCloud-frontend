import { useState } from "react";
import { MeetingProvider } from "@videosdk.live/react-sdk";
import { createMeeting, getAuthToken } from "@/features/meeting/api";
import MeetingView from "./pages/Meeting";
import JoinMeetingView from "./pages/JoinMeeting";
import MeetingLobbyView from "./pages/MeetingLobby";

export function Meeting() {
	const [meetingId, setMeetingId] = useState<string | null>(null);
	const [isMeetingStarted, setIsMeetingStarted] = useState(false);

	const [micEnabled, setMicEnabled] = useState(true);
	const [webcamEnabled, setWebcamEnabled] = useState(true);

	const getMeetingAndToken = async (id?: string) => {
		const meetingId = id == null ? await createMeeting(getAuthToken()) : id;
		setMeetingId(meetingId);
	};

	if (!meetingId) {
		return <JoinMeetingView getMeetingAndToken={getMeetingAndToken} />;
	}

	if (!isMeetingStarted) {
		return (
			<MeetingLobbyView
				meetingId={meetingId}
				onClickJoin={({ micEnabled, webcamEnabled }) => {
					setMicEnabled(micEnabled);
					setWebcamEnabled(webcamEnabled);
					setIsMeetingStarted(true);
				}}
			/>
		);
	}

	return (
		<MeetingProvider
			config={{
				debugMode: true,
				meetingId,
				micEnabled: micEnabled,
				webcamEnabled: webcamEnabled,
				name: "User Name",
			}}
			token={getAuthToken()}
			joinWithoutUserInteraction={true}>
			<MeetingView
				meetingId={meetingId}
				onMeetingLeave={() => {
					setMeetingId(null);
					setIsMeetingStarted(false);
				}}
			/>
		</MeetingProvider>
	);
}

export default Meeting;
