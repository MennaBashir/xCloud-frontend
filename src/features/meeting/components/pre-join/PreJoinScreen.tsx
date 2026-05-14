import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import {
	ArrowRight,
	Camera,
	Circle,
	Mic,
	MicOff,
	Speaker,
	Video,
	VideoOff,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useAuthStore, selectUser } from "@/features/auth/store/authStore";
import { EyebrowTag } from "@/shared/components/EyebrowTag";

import { useMediaDevices } from "../../hooks/useMediaDevices";
import { useDeviceStream } from "../../hooks/useDeviceStream";
import { createRoom, validateRoom } from "../../lib/videosdk-config";
import { useMeetingStore } from "../../store/meetingStore";
import { DevicePreview } from "./DevicePreview";
import { DevicePicker } from "./DevicePicker";

type PreJoinScreenProps = {
	onJoin: (input: { meetingId: string; participantName: string }) => void;
};

export function PreJoinScreen({ onJoin }: PreJoinScreenProps) {
	const { t } = useTranslation("meeting");
	const user = useAuthStore(selectUser);

	const micOn = useMeetingStore((s) => s.micOn);
	const webcamOn = useMeetingStore((s) => s.webcamOn);
	const setMicOn = useMeetingStore((s) => s.setMicOn);
	const setWebcamOn = useMeetingStore((s) => s.setWebcamOn);
	const setStoreName = useMeetingStore((s) => s.setParticipantName);
	const autoRecord = useMeetingStore((s) => s.autoRecord);
	const setAutoRecord = useMeetingStore((s) => s.setAutoRecord);

	const [name, setName] = useState(user?.name ?? "");
	const [meetingId, setMeetingId] = useState("");
	const [cameraId, setCameraId] = useState<string | undefined>();
	const [micId, setMicId] = useState<string | undefined>();
	const [speakerId, setSpeakerId] = useState<string | undefined>();
	const [busy, setBusy] = useState<"creating" | "joining" | null>(null);
	const [nameError, setNameError] = useState<string | null>(null);

	const devices = useMediaDevices();
	const { stream, error } = useDeviceStream({
		micOn,
		webcamOn,
		cameraDeviceId: cameraId,
		micDeviceId: micId,
	});

	// Default device selection once devices are enumerated
	useEffect(() => {
		if (!cameraId && devices.cameras.length > 0) {
			setCameraId(devices.cameras[0].deviceId);
		}
		if (!micId && devices.microphones.length > 0) {
			setMicId(devices.microphones[0].deviceId);
		}
		if (!speakerId && devices.speakers.length > 0) {
			setSpeakerId(devices.speakers[0].deviceId);
		}
	}, [devices, cameraId, micId, speakerId]);

	const validateName = (): boolean => {
		if (!name.trim()) {
			setNameError(t("prejoin.errors.nameRequired"));
			return false;
		}
		setNameError(null);
		return true;
	};

	const handleCreate = async () => {
		if (!validateName()) return;
		setBusy("creating");
		const result = await createRoom();
		setBusy(null);
		if (!result.ok) {
			toast.error(t("prejoin.errors.createFailed"), {
				description: result.error,
			});
			return;
		}
		setStoreName(name.trim());
		onJoin({
			meetingId: result.meetingId,
			participantName: name.trim(),
		});
	};

	const handleJoin = async () => {
		if (!validateName()) return;
		const id = meetingId.trim();
		if (!id) {
			toast.error(t("prejoin.errors.invalidId"));
			return;
		}
		setBusy("joining");
		const result = await validateRoom(id);
		setBusy(null);
		if (!result.ok) {
			toast.error(t("prejoin.errors.invalidId"), {
				description: result.error,
			});
			return;
		}
		setStoreName(name.trim());
		onJoin({
			meetingId: result.meetingId,
			participantName: name.trim(),
		});
	};

	return (
		<div className="relative isolate min-h-[100dvh] w-full overflow-hidden bg-zinc-950 text-white">
			{/* Mesh gradient backdrop */}
			<div
				aria-hidden="true"
				className="absolute inset-0 -z-10 opacity-90"
				style={{
					background: `
						radial-gradient(at 18% 22%, oklch(0.65 0.2 285 / 0.32) 0px, transparent 50%),
						radial-gradient(at 82% 18%, oklch(0.62 0.19 245 / 0.28) 0px, transparent 55%),
						radial-gradient(at 50% 100%, oklch(0.55 0.2 285 / 0.24) 0px, transparent 60%),
						linear-gradient(160deg, oklch(0.14 0.02 280) 0%, oklch(0.08 0.01 270) 100%)
					`,
				}}
			/>

			<div className="mx-auto max-w-[1180px] px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col gap-6">
				{/* Top */}
				<div className="flex items-center justify-between">
					<EyebrowTag className="!border-white/15 !bg-white/8 !text-white/85">
						{t("prejoin.eyebrow")}
					</EyebrowTag>
				</div>

				{/* Hero */}
				<div className="flex flex-col gap-2 max-w-2xl">
					<h1 className="font-semibold tracking-tight leading-[1.06] text-[1.875rem] sm:text-[2.5rem]">
						{t("prejoin.title")}
					</h1>
					<p className="text-[0.9375rem] sm:text-[1rem] leading-relaxed text-white/65">
						{t("prejoin.subtitle")}
					</p>
				</div>

				{/* Split: preview + setup */}
				<div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 lg:gap-8 mt-2">
					{/* Preview + device pickers */}
					<div className="flex flex-col gap-4">
						<DevicePreview
							stream={stream}
							micOn={micOn}
							webcamOn={webcamOn}
							displayName={name}
							error={error}
						/>

						{/* Quick toggles */}
						<div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-2">
							<div className="flex items-center gap-2 flex-wrap">
								<button
									type="button"
									onClick={() => setMicOn(!micOn)}
									aria-label={micOn ? t("controls.micOn") : t("controls.micOff")}
									className={cn(
										"inline-flex items-center gap-2 h-10 px-4 rounded-full",
										"text-[0.8125rem] font-medium",
										"transition-[background-color,border-color] duration-[var(--duration-fast)] ease-[cubic-bezier(0.32,0.72,0,1)]",
										"active:scale-[0.97]",
										micOn
											? "bg-white/8 border border-white/12 text-white hover:bg-white/14"
											: "bg-destructive/15 border border-destructive/30 text-destructive",
									)}
								>
									{micOn ? (
										<Mic className="size-3.5" strokeWidth={1.6} />
									) : (
										<MicOff className="size-3.5" strokeWidth={1.6} />
									)}
									<span>{micOn ? t("controls.mic") : t("controls.micOff")}</span>
								</button>
								<button
									type="button"
									onClick={() => setWebcamOn(!webcamOn)}
									aria-label={webcamOn ? t("controls.camOn") : t("controls.camOff")}
									className={cn(
										"inline-flex items-center gap-2 h-10 px-4 rounded-full",
										"text-[0.8125rem] font-medium",
										"transition-[background-color,border-color] duration-[var(--duration-fast)] ease-[cubic-bezier(0.32,0.72,0,1)]",
										"active:scale-[0.97]",
										webcamOn
											? "bg-white/8 border border-white/12 text-white hover:bg-white/14"
											: "bg-destructive/15 border border-destructive/30 text-destructive",
									)}
								>
									{webcamOn ? (
										<Video className="size-3.5" strokeWidth={1.6} />
									) : (
										<VideoOff className="size-3.5" strokeWidth={1.6} />
									)}
									<span>
										{webcamOn ? t("controls.camera") : t("controls.camOff")}
									</span>
								</button>
							</div>

							<div className="flex sm:ms-auto items-center gap-2 flex-wrap w-full sm:w-auto">
								<DevicePicker
									label={t("prejoin.deviceCamera")}
									icon={Camera}
									devices={devices.cameras}
									selectedId={cameraId}
									onSelect={setCameraId}
								/>
								<DevicePicker
									label={t("prejoin.deviceMic")}
									icon={Mic}
									devices={devices.microphones}
									selectedId={micId}
									onSelect={setMicId}
								/>
								{devices.speakers.length > 0 ? (
									<DevicePicker
										label={t("prejoin.deviceSpeaker")}
										icon={Speaker}
										devices={devices.speakers}
										selectedId={speakerId}
										onSelect={setSpeakerId}
									/>
								) : null}
							</div>
						</div>
					</div>

					{/* Setup card */}
					<div
						className={cn(
							"flex flex-col gap-5 self-start",
							"rounded-[var(--radius-2xl)] border border-white/8 bg-white/4 backdrop-blur-md",
							"p-5 sm:p-6",
						)}
					>
						<div className="flex flex-col gap-1.5">
							<Label
								htmlFor="participant-name"
								className="text-[0.8125rem] font-medium text-white"
							>
								{t("prejoin.nameLabel")}
							</Label>
							<Input
								id="participant-name"
								value={name}
								onChange={(e) => {
									setName(e.target.value);
									if (nameError) setNameError(null);
								}}
								placeholder={t("prejoin.namePlaceholder")}
								className="bg-white/8 border-white/12 text-white placeholder:text-white/40 focus-visible:border-white/40 focus-visible:ring-white/20"
								aria-invalid={Boolean(nameError)}
							/>
							{nameError ? (
								<p className="text-[0.75rem] text-destructive">{nameError}</p>
							) : null}
						</div>

						<Button
							onClick={handleCreate}
							disabled={busy !== null}
							size="lg"
							className={cn(
								"w-full gap-2 bg-white text-zinc-950 hover:bg-white/95",
							)}
						>
							{busy === "creating" ? (
								<span>{t("prejoin.creating")}</span>
							) : (
								<>
									<span>{t("prejoin.create")}</span>
									<ArrowRight className="size-4 rtl-flip" strokeWidth={1.8} />
								</>
							)}
						</Button>

						<div className="flex items-center gap-3">
							<span className="h-px flex-1 bg-white/10" />
							<span className="text-[0.6875rem] uppercase tracking-[0.16em] text-white/55">
								{t("prejoin.orJoinExisting")}
							</span>
							<span className="h-px flex-1 bg-white/10" />
						</div>

						<div className="flex flex-col gap-1.5">
							<Label
								htmlFor="meeting-id"
								className="text-[0.8125rem] font-medium text-white"
							>
								{t("prejoin.roomIdLabel")}
							</Label>
							<Input
								id="meeting-id"
								value={meetingId}
								onChange={(e) => setMeetingId(e.target.value)}
								placeholder={t("prejoin.roomIdPlaceholder")}
								className="bg-white/8 border-white/12 text-white placeholder:text-white/40 focus-visible:border-white/40 focus-visible:ring-white/20 font-mono text-[0.875rem]"
							/>
						</div>

						<Button
							onClick={handleJoin}
							disabled={busy !== null}
							size="lg"
							variant="outline"
							className={cn(
								"w-full gap-2",
								"bg-transparent border-white/15 text-white hover:bg-white/8 hover:text-white",
							)}
						>
							{busy === "joining" ? (
								<span>{t("prejoin.validating")}</span>
							) : (
								<span>{t("prejoin.join")}</span>
							)}
						</Button>

						{/* Auto-record toggle */}
						<div
							className={cn(
								"flex items-start gap-3 rounded-[var(--radius-lg)]",
								"border border-white/10 bg-white/4 px-3.5 py-3",
								"transition-[border-color,background-color] duration-[var(--duration-fast)] ease-[cubic-bezier(0.32,0.72,0,1)]",
								autoRecord && "border-destructive/25 bg-destructive/10",
							)}
						>
							<span
								className={cn(
									"grid size-7 place-items-center rounded-full shrink-0 mt-0.5",
									autoRecord
										? "bg-destructive/15 text-destructive ring-1 ring-inset ring-destructive/30"
										: "bg-white/8 text-white/65 ring-1 ring-inset ring-white/10",
								)}
								aria-hidden="true"
							>
								<Circle className="size-3 fill-current" strokeWidth={0} />
							</span>
							<div className="flex-1 min-w-0">
								<Label
									htmlFor="auto-record"
									className="text-[0.8125rem] font-medium text-white block cursor-pointer"
								>
									{t("recording.autoLabel")}
								</Label>
								<p className="mt-0.5 text-[0.6875rem] text-white/55 leading-relaxed">
									{t("recording.autoHint")}
								</p>
							</div>
							<Switch
								id="auto-record"
								checked={autoRecord}
								onCheckedChange={setAutoRecord}
								className={cn(
									"shrink-0 mt-0.5",
									"data-[state=checked]:bg-destructive",
									"data-[state=unchecked]:bg-white/15",
								)}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
