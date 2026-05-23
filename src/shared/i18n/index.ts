import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import { resources, namespaces } from "./resources";

export const SUPPORTED_LANGUAGES = ["en", "ar"] as const;
export type Language = (typeof SUPPORTED_LANGUAGES)[number];

export const RTL_LANGUAGES = new Set<Language>(["ar"]);

export const DEFAULT_LANGUAGE: Language = "en";
export const LANGUAGE_STORAGE_KEY = "sprintifai.lang";

void i18n
	.use(LanguageDetector)
	.use(initReactI18next)
	.init({
		resources,
		fallbackLng: DEFAULT_LANGUAGE,
		supportedLngs: [...SUPPORTED_LANGUAGES],
		ns: [...namespaces],
		defaultNS: "common",
		interpolation: {
			// React already escapes on render
			escapeValue: false,
		},
		detection: {
			order: ["localStorage"],
			lookupLocalStorage: LANGUAGE_STORAGE_KEY,
			caches: ["localStorage"],
		},
		returnNull: false,
	});

export function isRtl(language: string | undefined): boolean {
	if (!language) return false;
	return RTL_LANGUAGES.has(language as Language);
}

export function isSupportedLanguage(value: string): value is Language {
	return (SUPPORTED_LANGUAGES as readonly string[]).includes(value);
}

export default i18n;
