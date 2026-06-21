import { create } from "zustand";

import type { MeetingMode, MeetingTheme, SideBarMode } from "../types/meeting";

type MeetingState = {
	mode: MeetingMode;
	meetingId: string;
	participantName: string;
	micOn: boolean;
	webcamOn: boolean;
	sideBar: SideBarMode;
	theme: MeetingTheme;
	/** Whether the active meeting is currently in fullscreen takeover. */
	isMeetingActive: boolean;
	/**
	 * When true (default), recording starts automatically the moment the
	 * meeting is joined. Audio-only — captures the user's microphone.
	 */
	autoRecord: boolean;
};

type MeetingActions = {
	setMode: (mode: MeetingMode) => void;
	setMeetingId: (id: string) => void;
	setParticipantName: (name: string) => void;
	setMicOn: (on: boolean) => void;
	setWebcamOn: (on: boolean) => void;
	setSideBar: (mode: SideBarMode) => void;
	toggleSideBar: (mode: Exclude<SideBarMode, null>) => void;
	setTheme: (theme: MeetingTheme) => void;
	setMeetingActive: (active: boolean) => void;
	setAutoRecord: (value: boolean) => void;
	reset: () => void;
};

/**
 * Live registry of every REMOTE participant's mic audio track, keyed by
 * participant id. Kept OUTSIDE reactive zustand state (a plain module-level
 * Map) so registering/unregistering tracks never triggers re-renders. The
 * recorder reads this synchronously to mix all voices into one file.
 *
 * Each ParticipantTile owns the lifecycle of its own entry.
 */
const remoteAudioTracks = new Map<string, MediaStreamTrack>();

export const audioRegistry = {
	register(participantId: string, track: MediaStreamTrack) {
		remoteAudioTracks.set(participantId, track);
	},
	unregister(participantId: string) {
		remoteAudioTracks.delete(participantId);
	},
	/** Snapshot of all currently-live remote audio tracks. */
	getTracks(): MediaStreamTrack[] {
		return Array.from(remoteAudioTracks.values()).filter(
			(t) => t.readyState === "live",
		);
	},
	clear() {
		remoteAudioTracks.clear();
	},
};

const INITIAL: MeetingState = {
	mode: "joining",
	meetingId: "",
	participantName: "",
	micOn: true,
	webcamOn: true,
	sideBar: null,
	theme: "dark",
	isMeetingActive: false,
	autoRecord: true,
};

export const useMeetingStore = create<MeetingState & MeetingActions>(
	(set) => ({
		...INITIAL,
		setMode: (mode) => set({ mode }),
		setMeetingId: (meetingId) => set({ meetingId }),
		setParticipantName: (participantName) => set({ participantName }),
		setMicOn: (micOn) => set({ micOn }),
		setWebcamOn: (webcamOn) => set({ webcamOn }),
		setSideBar: (sideBar) => set({ sideBar }),
		toggleSideBar: (mode) =>
			set((s) => ({ sideBar: s.sideBar === mode ? null : mode })),
		setTheme: (theme) => set({ theme }),
		setMeetingActive: (isMeetingActive) => set({ isMeetingActive }),
		setAutoRecord: (autoRecord) => set({ autoRecord }),
		reset: () =>
			set((s) => ({
				...INITIAL,
				// Preserve the user's auto-record preference across meetings.
				autoRecord: s.autoRecord,
			})),
	}),
);

export const selectIsMeetingActive = (
	s: MeetingState & MeetingActions,
): boolean => s.isMeetingActive;
