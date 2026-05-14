import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "@/shared/i18n";
import App from "./App";
import { ThemeProvider } from "@/shared/theme/ThemeProvider";
import { LanguageProvider } from "@/shared/i18n/LanguageProvider";
import { AuthProvider } from "@/features/auth/AuthProvider";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<ThemeProvider defaultTheme="dark">
			<LanguageProvider>
				<AuthProvider>
					<App />
				</AuthProvider>
			</LanguageProvider>
		</ThemeProvider>
	</StrictMode>,
);
