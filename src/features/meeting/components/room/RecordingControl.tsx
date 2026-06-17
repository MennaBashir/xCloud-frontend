import {
	forwardRef,
	useCallback,
	useEffect,
	useImperativeHandle,
	useRef,
	useState,
} from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Circle, Download, Loader2, Square } from "lucide-react";

import { cn } from "@/lib/utils";

type RecState =
	| "idle"
	| "starting"
	| "recording"
	| "stopping"
	| "ready"
	| "error";

/**
 * Imperative handle exposed to parents (e.g. MeetingRoom) so we can
 * auto-start recording when the user opted in on the pre-join screen.
 */
export type RecordingControlHandle = {
	start: () => Promise<boolean>;
	stop: () => void;
	getState: () => RecState;
};

// Audio-only MIME candidates (no video tracks).
const MIME_CANDIDATES = [
	"audio/webm;codecs=opus",
	"audio/webm",
	"audio/ogg;codecs=opus",
	"audio/mp4",
];

// Dedicated mic constraints. The recorder always opens its OWN mic so it is
// fully independent of the in-meeting mic (VideoSDK) — toggling the meeting
// mic, camera, or screen share never touches this stream.
const MIC_CONSTRAINTS: MediaStreamConstraints = {
	audio: {
		echoCancellation: true,
		noiseSuppression: true,
		autoGainControl: true,
	},
	video: false,
};

function pickSupportedMime(): string | null {
	if (typeof MediaRecorder === "undefined") return null;
	for (const m of MIME_CANDIDATES) {
		if (MediaRecorder.isTypeSupported(m)) return m;
	}
	return null;
}

function extensionFor(mime: string): string {
	if (mime.startsWith("audio/webm")) return "webm";
	if (mime.startsWith("audio/ogg")) return "ogg";
	if (mime.startsWith("audio/mp4")) return "m4a";
	return "audio";
}

function formatDuration(seconds: number): string {
	const m = Math.floor(seconds / 60);
	const s = seconds % 60;
	return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

/**
 * Audio-only meeting recorder.
 *
 * Captures the user's microphone with the browser's MediaRecorder API,
 * encodes to WebM/Opus (or the best supported audio mime), and downloads
 * a single audio file when stopped. No screen capture, no video tracks.
 *
 * The recording is held in memory as a Blob URL until the user clicks
 * Download or dismisses. We only revoke the URL when the user dismisses
 * the result OR the component unmounts.
 */
export const RecordingControl = forwardRef<RecordingControlHandle>(
	function RecordingControl(_, ref) {
		const { t } = useTranslation("meeting");
		const [state, setState] = useState<RecState>("idle");
		const [elapsed, setElapsed] = useState(0);
		const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
		const [downloadName, setDownloadName] = useState<string>(
			"recording.webm",
		);

		const recorderRef = useRef<MediaRecorder | null>(null);
		const chunksRef = useRef<Blob[]>([]);
		const streamRef = useRef<MediaStream | null>(null);
		const tickRef = useRef<number | null>(null);
		const mimeRef = useRef<string>("audio/webm");
		// When true the user explicitly asked to stop; track-`ended` events
		// must NOT try to recover the mic in that case.
		const intentionalStopRef = useRef(false);
		// Guards against a double `onstop` / recovery race.
		const recoveringRef = useRef(false);

		const cleanupStream = useCallback(() => {
			if (streamRef.current) {
				streamRef.current.getTracks().forEach((track) => track.stop());
				streamRef.current = null;
			}
			if (tickRef.current !== null) {
				window.clearInterval(tickRef.current);
				tickRef.current = null;
			}
		}, []);

		// Attach a track-`ended` handler. A MediaRecorder is bound to the
		// stream it was constructed with and cannot transparently swap tracks,
		// so if the OS / another consumer drops the mic device mid-recording we
		// gracefully FINALIZE whatever we've captured (flush + stop) into a
		// downloadable file — never losing the recording or leaving it cut and
		// unsaved. The user can then restart cleanly.
		const attachTrackEndGuard = useCallback((stream: MediaStream) => {
			stream.getAudioTracks().forEach((track) => {
				track.addEventListener("ended", () => {
					// User-initiated stop already handles finalization.
					if (intentionalStopRef.current) return;
					if (recoveringRef.current) return;
					const rec = recorderRef.current;
					if (!rec || rec.state !== "recording") return;
					recoveringRef.current = true;
					try {
						rec.requestData();
						rec.stop();
						toast.message(t("recording.saved"));
					} catch {
						/* noop */
					}
				});
			});
		}, [t]);

		// Component-level unmount cleanup.
		useEffect(() => {
			return () => {
				cleanupStream();
				if (downloadUrl) URL.revokeObjectURL(downloadUrl);
			};
			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, []);

		const start = useCallback(async (): Promise<boolean> => {
			// Don't restart if we're already going.
			if (
				state === "starting" ||
				state === "recording" ||
				state === "stopping"
			) {
				return state === "recording";
			}

			const mime = pickSupportedMime();
			if (!mime) {
				toast.error(t("recording.error.unsupported"));
				setState("error");
				return false;
			}
			mimeRef.current = mime;

			setState("starting");
			intentionalStopRef.current = false;
			recoveringRef.current = false;
			try {
				// Audio-only. No display media, no video. Independent mic.
				const audioStream =
					await navigator.mediaDevices.getUserMedia(MIC_CONSTRAINTS);

				streamRef.current = audioStream;
				const recorder = new MediaRecorder(audioStream, { mimeType: mime });
				chunksRef.current = [];

				recorder.ondataavailable = (e) => {
					if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
				};

				recorder.onstop = () => {
					recoveringRef.current = false;
					const blob = new Blob(chunksRef.current, { type: mime });
					if (blob.size === 0) {
						// Nothing was recorded — bail without offering a broken download.
						cleanupStream();
						setState("idle");
						toast.error(t("recording.error.permission"));
						return;
					}
					const url = URL.createObjectURL(blob);
					const ts = new Date().toISOString().replace(/[:.]/g, "-");
					const ext = extensionFor(mime);
					setDownloadUrl(url);
					setDownloadName(`sprintifai-meeting-${ts}.${ext}`);
					setState("ready");
					cleanupStream();
					toast.success(t("recording.saved"));
				};

				recorder.onerror = () => {
					toast.error(t("recording.error.permission"));
					cleanupStream();
					setState("error");
				};

				// Resilient: if the mic device drops mid-recording, finalize
				// the file gracefully instead of cutting / losing it.
				attachTrackEndGuard(audioStream);

				// 1-second timeslices so the chunk list grows incrementally.
				recorder.start(1000);
				recorderRef.current = recorder;
				setElapsed(0);
				tickRef.current = window.setInterval(() => {
					setElapsed((v) => v + 1);
				}, 1000);
				setState("recording");
				return true;
			} catch (err) {
				console.error("[recording] failed to start", err);
				toast.error(t("recording.error.permission"));
				cleanupStream();
				setState("idle");
				return false;
			}
		}, [attachTrackEndGuard, cleanupStream, state, t]);

		const stop = useCallback(() => {
			const recorder = recorderRef.current;
			if (!recorder || recorder.state !== "recording") return;
			// Mark intentional so the track-`ended` recovery handler stands down.
			intentionalStopRef.current = true;
			setState("stopping");
			try {
				// Flush the trailing (<1s) buffer before stopping so the tail of
				// the recording isn't lost.
				recorder.requestData();
				recorder.stop();
			} catch {
				/* noop */
			}
		}, []);

		const getState = useCallback((): RecState => state, [state]);

		// Expose imperative API to parent (used by auto-record + leave).
		useImperativeHandle(
			ref,
			() => ({ start, stop, getState }),
			[start, stop, getState],
		);

		const handleDownload = useCallback(() => {
			if (!downloadUrl) return;
			// Create a fresh anchor each time so repeat clicks work reliably.
			const a = document.createElement("a");
			a.href = downloadUrl;
			a.download = downloadName;
			a.rel = "noopener";
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
		}, [downloadUrl, downloadName]);

		const handleDismiss = useCallback(() => {
			if (downloadUrl) URL.revokeObjectURL(downloadUrl);
			setDownloadUrl(null);
			setDownloadName("recording.webm");
			setElapsed(0);
			setState("idle");
		}, [downloadUrl]);

		const isLoading = state === "starting" || state === "stopping";
		const isRecording = state === "recording";
		const isReady = state === "ready";

		if (isReady) {
			return (
				<div className="inline-flex items-center gap-2">
					<button
						type="button"
						onClick={handleDownload}
						className={cn(
							"inline-flex items-center gap-2 h-9 px-3.5 rounded-full",
							"bg-white text-zinc-950 hover:bg-white/95",
							"text-[0.8125rem] font-medium",
							"transition-[transform,opacity] duration-[var(--duration-fast)] ease-[cubic-bezier(0.32,0.72,0,1)]",
							"active:scale-[0.96]",
						)}
					>
						<Download className="size-3.5" strokeWidth={1.8} />
						<span>{t("recording.download")}</span>
					</button>
					<button
						type="button"
						onClick={handleDismiss}
						aria-label="Dismiss"
						className="inline-flex items-center justify-center size-9 rounded-full text-white/70 hover:text-white hover:bg-white/8 transition-colors"
					>
						<svg
							viewBox="0 0 24 24"
							className="size-3.5"
							fill="none"
							stroke="currentColor"
							strokeWidth={1.8}
							strokeLinecap="round"
							aria-hidden="true"
						>
							<path d="M6 6l12 12M18 6l-12 12" />
						</svg>
					</button>
				</div>
			);
		}

		return (
			<button
				type="button"
				onClick={isRecording ? stop : () => void start()}
				disabled={isLoading}
				aria-label={
					isRecording ? t("recording.stop") : t("recording.start")
				}
				className={cn(
					"inline-flex items-center gap-2 h-9 px-3.5 rounded-full",
					"text-[0.8125rem] font-medium",
					"transition-[transform,background-color,border-color,color] duration-[var(--duration-fast)] ease-[cubic-bezier(0.32,0.72,0,1)]",
					"active:scale-[0.96] disabled:opacity-60 disabled:cursor-not-allowed",
					"border",
					isRecording
						? "bg-destructive/15 text-destructive border-destructive/30 hover:bg-destructive/20"
						: "bg-white/8 text-white border-white/12 hover:bg-white/14 hover:border-white/20",
				)}
			>
				{isLoading ? (
					<Loader2 className="size-3.5 animate-spin" strokeWidth={2} />
				) : isRecording ? (
					<>
						<span className="relative grid size-2 place-items-center">
							<span className="absolute inset-0 rounded-full bg-destructive/70 animate-ping" />
							<span className="relative size-2 rounded-full bg-destructive" />
						</span>
						<span className="font-mono tabular-nums">
							{formatDuration(elapsed)}
						</span>
						<Square
							className="size-3 fill-current ms-0.5"
							strokeWidth={0}
						/>
					</>
				) : (
					<>
						<Circle className="size-3 fill-current" strokeWidth={0} />
						<span>{t("recording.start")}</span>
					</>
				)}
			</button>
		);
	},
);
