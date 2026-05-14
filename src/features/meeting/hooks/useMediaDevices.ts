import { useCallback, useEffect, useState } from "react";

export type DeviceInfo = {
	deviceId: string;
	label: string;
};

type DevicesState = {
	cameras: DeviceInfo[];
	microphones: DeviceInfo[];
	speakers: DeviceInfo[];
};

/**
 * Enumerates browser media devices and watches for device changes
 * (hot-plug headsets, etc.). Returns labeled devices once permission
 * has been granted; before permission, labels are empty per spec.
 */
export function useMediaDevices(): DevicesState & {
	refresh: () => Promise<void>;
} {
	const [state, setState] = useState<DevicesState>({
		cameras: [],
		microphones: [],
		speakers: [],
	});

	const refresh = useCallback(async () => {
		if (typeof navigator === "undefined" || !navigator.mediaDevices) return;
		try {
			const devices = await navigator.mediaDevices.enumerateDevices();
			const cameras: DeviceInfo[] = [];
			const microphones: DeviceInfo[] = [];
			const speakers: DeviceInfo[] = [];
			for (const d of devices) {
				const entry: DeviceInfo = {
					deviceId: d.deviceId,
					label: d.label || labelFromKind(d.kind, devices),
				};
				if (d.kind === "videoinput") cameras.push(entry);
				else if (d.kind === "audioinput") microphones.push(entry);
				else if (d.kind === "audiooutput") speakers.push(entry);
			}
			setState({ cameras, microphones, speakers });
		} catch {
			// Silent — pre-join screen will surface a permission state.
		}
	}, []);

	useEffect(() => {
		void refresh();
		const md = navigator.mediaDevices;
		if (!md?.addEventListener) return;
		const handler = () => void refresh();
		md.addEventListener("devicechange", handler);
		return () => md.removeEventListener("devicechange", handler);
	}, [refresh]);

	return { ...state, refresh };
}

function labelFromKind(
	kind: MediaDeviceKind,
	devices: MediaDeviceInfo[],
): string {
	const same = devices.filter((d) => d.kind === kind);
	const idx = same.findIndex((d) => d.deviceId === same[0]?.deviceId);
	const base =
		kind === "videoinput"
			? "Camera"
			: kind === "audioinput"
				? "Microphone"
				: "Speaker";
	return `${base} ${idx + 1}`;
}
