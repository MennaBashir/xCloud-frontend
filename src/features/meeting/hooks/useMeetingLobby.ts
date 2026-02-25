import {
	createCameraVideoTrack,
	useMediaDevice,
} from "@videosdk.live/react-sdk";
import { useEffect, useState } from "react";

interface MediaDeviceInfo {
	deviceId: string;
	label: string;
}

export const useMeetingLobby = () => {
	// useMediaDevice , to get a list of available cameras and mics
	const { getCameras, getMicrophones } = useMediaDevice();

	// State to hold devices and selections
	const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
	const [mics, setMics] = useState<MediaDeviceInfo[]>([]);
	const [selectedCamId, setSelectedCamId] = useState<string>();
	const [selectedMicId, setSelectedMicId] = useState<string>();
	// state to hold user choices bout mic and webcam
	const [isMicOn, setIsMicOn] = useState(true);
	const [isWebcamOn, setIsWebcamOn] = useState(true);

	// state for custom video preview
	const [customStream, setCustomStream] = useState<MediaStream | null>(null);

	// Fetch available devices on mount
	useEffect(() => {
		const fetchDevices = async () => {
			try {
				const camList = await getCameras();
				const micList = await getMicrophones();
				setCameras(camList);
				setMics(micList);

				if (camList.length > 0) setSelectedCamId(camList[0].deviceId);
				if (micList.length > 0) setSelectedMicId(micList[0].deviceId);
			} catch (err) {
				console.error("Error fetching devices", err);
			}
		};
		fetchDevices();
	}, [getCameras, getMicrophones]);

	// Effect to handle webcam preview based on user selection
	useEffect(() => {
		let currentTrack: MediaStream | null = null;

		const startPreview = async () => {
			if (isWebcamOn && selectedCamId) {
				try {
					const stream = await createCameraVideoTrack({
						cameraId: selectedCamId,
						encoderConfig: "h540p_w960p",
						optimizationMode: "motion",
						multiStream: false,
					});

					currentTrack = stream;
					setCustomStream(stream);
				} catch (error) {
					console.error("Error creating camera track", error);
				}
			} else {
				if (customStream) {
					customStream.getTracks().forEach((track) => track.stop());
					setCustomStream(null);
				}
			}
		};

		startPreview();

		return () => {
			if (currentTrack) {
				currentTrack.getTracks().forEach((track) => track.stop());
			}
		};
	}, [isWebcamOn, selectedCamId]);

	// handlers for toggling mic and webcam states
	const handleToggleMic = () => setIsMicOn(!isMicOn);
	const handleToggleWebcam = () => setIsWebcamOn(!isWebcamOn);

	const handleDeviceChange = (type: "mic" | "cam", deviceId: string) => {
		if (type === "cam") {
			setSelectedCamId(deviceId);
		} else {
			setSelectedMicId(deviceId);
		}
	};

	const [isRecording, setIsRecording] = useState(false);
	const [isSummarizing, setIsSummarizing] = useState(false);

	return {
		cameras,
		mics,
		selectedCamId,
		selectedMicId,
		isMicOn,
		isWebcamOn,
		customStream,
		handleToggleMic,
		handleToggleWebcam,
		handleDeviceChange,
		isRecording,
		isSummarizing,
		setIsRecording,
		setIsSummarizing,
	};
};
