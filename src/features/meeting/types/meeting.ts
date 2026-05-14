/**
 * Meeting feature types.
 *
 * Wraps VideoSDK primitives in shapes that consumers can use without
 * importing the SDK directly. Components import from here; the SDK is
 * only touched by hooks/lib.
 */

export type SideBarMode = "chat" | "participants" | null;

export type ChatMessage = {
	id: string;
	senderId: string;
	senderName: string;
	text: string;
	timestamp: number;
};

export type MeetingMode = "joining" | "active" | "left";

export type RoomCreationResult =
	| { ok: true; meetingId: string }
	| { ok: false; error: string };

export type MeetingTheme = "dark" | "light";

export type ParticipantSummary = {
	id: string;
	name: string;
	isLocal: boolean;
	micOn: boolean;
	webcamOn: boolean;
};
