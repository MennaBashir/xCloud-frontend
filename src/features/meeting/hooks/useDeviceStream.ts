import { useEffect, useRef, useState } from "react";

type Options = {
	micOn: boolean;
	webcamOn: boolean;
	micDeviceId?: string;
	cameraDeviceId?: string;
};

type Result = {
	stream: MediaStream | null;
	error: "permission" | "unsupported" | "unknown" | null;
};

/**
 * Lifecycle-managed local preview stream for the pre-join screen.
 *
 * Requests mic + camera based on flags, swaps tracks when the user picks a
 * different device, and tears the stream down completely on unmount so we
 * never leak a hot camera light.
 */
export function useDeviceStream({
	micOn,
	webcamOn,
	micDeviceId,
	cameraDeviceId,
}: Options): Result {
	const [stream, setStream] = useState<MediaStream | null>(null);
	const [error, setError] = useState<Result["error"]>(null);
	const streamRef = useRef<MediaStream | null>(null);

	useEffect(() => {
		streamRef.current = stream;
	}, [stream]);

	useEffect(() => {
		if (typeof navigator === "undefined" || !navigator.mediaDevices) {
			setError("unsupported");
			return;
		}

		let cancelled = false;

		const stop = (s: MediaStream | null) => {
			s?.getTracks().forEach((t) => t.stop());
		};

		const acquire = async () => {
			if (!micOn && !webcamOn) {
				stop(streamRef.current);
				setStream(null);
				setError(null);
				return;
			}

			const constraints: MediaStreamConstraints = {
				audio: micOn
					? micDeviceId
						? { deviceId: { exact: micDeviceId } }
						: true
					: false,
				video: webcamOn
					? cameraDeviceId
						? { deviceId: { exact: cameraDeviceId } }
						: true
					: false,
			};

			try {
				const next = await navigator.mediaDevices.getUserMedia(constraints);
				if (cancelled) {
					stop(next);
					return;
				}
				stop(streamRef.current);
				setStream(next);
				setError(null);
			} catch (err) {
				if (cancelled) return;
				setStream(null);
				setError(
					err instanceof DOMException &&
						(err.name === "NotAllowedError" ||
							err.name === "PermissionDeniedError")
						? "permission"
						: "unknown",
				);
			}
		};

		void acquire();

		return () => {
			cancelled = true;
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [micOn, webcamOn, micDeviceId, cameraDeviceId]);

	useEffect(() => {
		return () => {
			streamRef.current?.getTracks().forEach((t) => t.stop());
		};
	}, []);

	return { stream, error };
}
