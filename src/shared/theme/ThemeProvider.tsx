import {
	createContext,
	useContext,
	useEffect,
	useMemo,
	useState,
	type ReactNode,
} from "react";

export type Theme = "light" | "dark";

type ThemeContextValue = {
	theme: Theme;
	resolvedTheme: Theme;
	setTheme: (theme: Theme) => void;
};

const STORAGE_KEY = "sprintifai.theme";

const ThemeContext = createContext<ThemeContextValue | null>(null);

function readStoredTheme(defaultTheme: Theme): Theme {
	if (typeof window === "undefined") return defaultTheme;
	const stored = window.localStorage.getItem(STORAGE_KEY);
	if (stored === "light" || stored === "dark") {
		return stored;
	}
	// Migrate legacy "system" (or any other unknown value) silently to dark.
	if (stored !== null) {
		try {
			window.localStorage.setItem(STORAGE_KEY, defaultTheme);
		} catch {
			// noop — storage may be unavailable
		}
	}
	return defaultTheme;
}

function applyTheme(resolved: Theme) {
	const root = document.documentElement;
	root.classList.toggle("dark", resolved === "dark");
	root.style.colorScheme = resolved;
}

type ThemeProviderProps = {
	children: ReactNode;
	defaultTheme?: Theme;
};

export function ThemeProvider({
	children,
	defaultTheme = "dark",
}: ThemeProviderProps) {
	const [theme, setThemeState] = useState<Theme>(() => {
		if (typeof window === "undefined") return defaultTheme;
		return readStoredTheme(defaultTheme);
	});

	useEffect(() => {
		applyTheme(theme);
	}, [theme]);

	const setTheme = (next: Theme) => {
		try {
			window.localStorage.setItem(STORAGE_KEY, next);
		} catch {
			// noop
		}
		setThemeState(next);
	};

	const value = useMemo(
		() => ({ theme, resolvedTheme: theme, setTheme }),
		[theme],
	);

	return (
		<ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
	);
}

export function useTheme(): ThemeContextValue {
	const ctx = useContext(ThemeContext);
	if (!ctx) {
		throw new Error("useTheme must be used inside <ThemeProvider>");
	}
	return ctx;
}
