import { useMeeting, useParticipant } from "@videosdk.live/react-sdk";

const useMeetingControls = () => {
	const {
		leave,
		toggleMic,
		toggleWebcam,
		toggleScreenShare,
		localParticipant,
		recordingState,
		startRecording,
		stopRecording,
	} = useMeeting();

	const { micOn, webcamOn, screenShareOn } = useParticipant(
		localParticipant?.id || "",
	);

	const isRecording =
		recordingState === "RECORDING_STARTED" ||
		recordingState === "RECORDING_STARTING";

	const handleRecordClick = () =>
		isRecording ? stopRecording() : startRecording();
	const handleWebcamClick = () => toggleWebcam();
	const handleMicClick = () => toggleMic();
	const handleScreenShareClick = () => toggleScreenShare();
	const handleLeaveClick = () => leave();

	return {
		micOn,
		webcamOn,
		screenShareOn,
		isRecording,
		handleRecordClick,
		handleWebcamClick,
		handleMicClick,
		handleScreenShareClick,
		handleLeaveClick,
	};
};

export default useMeetingControls;
