import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
	type ReactNode,
} from "react";
import { useTranslation } from "react-i18next";

import {
	DEFAULT_LANGUAGE,
	LANGUAGE_STORAGE_KEY,
	SUPPORTED_LANGUAGES,
	isRtl,
	isSupportedLanguage,
	type Language,
} from "./index";

type LanguageContextValue = {
	language: Language;
	direction: "ltr" | "rtl";
	isRtl: boolean;
	supportedLanguages: readonly Language[];
	setLanguage: (next: Language) => void;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

function syncDocument(language: Language) {
	if (typeof document === "undefined") return;
	const dir = isRtl(language) ? "rtl" : "ltr";
	document.documentElement.lang = language;
	document.documentElement.dir = dir;
}

type LanguageProviderProps = {
	children: ReactNode;
};

export function LanguageProvider({ children }: LanguageProviderProps) {
	const { i18n } = useTranslation();

	const initial = useMemo<Language>(() => {
		const current = i18n.resolvedLanguage ?? i18n.language ?? DEFAULT_LANGUAGE;
		return isSupportedLanguage(current) ? current : DEFAULT_LANGUAGE;
	}, [i18n.language, i18n.resolvedLanguage]);

	const [language, setLanguageState] = useState<Language>(initial);

	// Keep <html lang>/<dir> in sync on every language change
	useEffect(() => {
		syncDocument(language);
	}, [language]);

	// React to external language changes (browser detector, dev tools, etc.)
	useEffect(() => {
		const handler = (lng: string) => {
			if (isSupportedLanguage(lng)) {
				setLanguageState(lng);
			}
		};
		i18n.on("languageChanged", handler);
		return () => {
			i18n.off("languageChanged", handler);
		};
	}, [i18n]);

	const setLanguage = useCallback(
		(next: Language) => {
			void i18n.changeLanguage(next);
			try {
				window.localStorage.setItem(LANGUAGE_STORAGE_KEY, next);
			} catch {
				/* ignore */
			}
			setLanguageState(next);
		},
		[i18n],
	);

	const value = useMemo<LanguageContextValue>(
		() => ({
			language,
			direction: isRtl(language) ? "rtl" : "ltr",
			isRtl: isRtl(language),
			supportedLanguages: SUPPORTED_LANGUAGES,
			setLanguage,
		}),
		[language, setLanguage],
	);

	return (
		<LanguageContext.Provider value={value}>
			{children}
		</LanguageContext.Provider>
	);
}

export function useLanguage(): LanguageContextValue {
	const ctx = useContext(LanguageContext);
	if (!ctx) {
		throw new Error("useLanguage must be used inside <LanguageProvider>");
	}
	return ctx;
}
