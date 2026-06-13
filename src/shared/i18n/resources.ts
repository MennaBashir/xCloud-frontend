/**
 * Static resource bundle. Bundling everything for two languages is
 * cheaper than the overhead of an HTTP backend and avoids flash of
 * untranslated content on first render.
 *
 * When adding a new namespace, register it both here AND in `namespaces`
 * inside `./index.ts`.
 */
import enCommon from "./locales/en/common.json";
import enLanding from "./locales/en/landing.json";
import enAuth from "./locales/en/auth.json";
import enFiles from "./locales/en/files.json";
import enChat from "./locales/en/chat.json";
import enCalendar from "./locales/en/calendar.json";
import enMeeting from "./locales/en/meeting.json";
import enGmail from "./locales/en/gmail.json";
import enNotifications from "./locales/en/notifications.json";
import enRag from "./locales/en/rag.json";
import enErrors from "./locales/en/errors.json";

import arCommon from "./locales/ar/common.json";
import arLanding from "./locales/ar/landing.json";
import arAuth from "./locales/ar/auth.json";
import arFiles from "./locales/ar/files.json";
import arChat from "./locales/ar/chat.json";
import arCalendar from "./locales/ar/calendar.json";
import arMeeting from "./locales/ar/meeting.json";
import arGmail from "./locales/ar/gmail.json";
import arNotifications from "./locales/ar/notifications.json";
import arRag from "./locales/ar/rag.json";
import arErrors from "./locales/ar/errors.json";

export const resources = {
	en: {
		common: enCommon,
		landing: enLanding,
		auth: enAuth,
		files: enFiles,
		chat: enChat,
		calendar: enCalendar,
		meeting: enMeeting,
		gmail: enGmail,
		notifications: enNotifications,
		rag: enRag,
		errors: enErrors,
	},
	ar: {
		common: arCommon,
		landing: arLanding,
		auth: arAuth,
		files: arFiles,
		chat: arChat,
		calendar: arCalendar,
		meeting: arMeeting,
		gmail: arGmail,
		notifications: arNotifications,
		rag: arRag,
		errors: arErrors,
	},
} as const;

export const namespaces = [
	"common",
	"landing",
	"auth",
	"files",
	"chat",
	"calendar",
	"meeting",
	"gmail",
	"notifications",
	"rag",
	"errors",
] as const;

export type Namespace = (typeof namespaces)[number];
