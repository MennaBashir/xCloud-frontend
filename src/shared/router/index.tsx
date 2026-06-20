import {
	createBrowserRouter,
	createRoutesFromElements,
	Navigate,
	Route,
} from "react-router-dom";

import LandingPage from "@/pages/Landing";
import CalendarPage from "@/pages/Calendar";
import GmailPage from "@/features/gmail/pages/GmailPage";
import MeetingPage from "@/features/meeting/pages/MeetingPage";
import NotFoundPage from "@/pages/NotFound";
import ChatPage from "@/features/chat/pages/ChatPage";
import RagPage from "@/features/rag/pages/RagPage";

import LoginPage from "@/features/auth/pages/LoginPage";

import FilesPage from "@/features/files/pages/FilesPage";
import NotificationsPage from "@/features/notifications/pages/NotificationsPage";

import { PublicLayout } from "../layout/PublicLayout";
import { AppLayout } from "../layout/AppLayout";

import { ProtectedRoute } from "./ProtectedRoute";
import { RedirectIfAuthenticated } from "./RedirectIfAuthenticated";

export const router = createBrowserRouter(
	createRoutesFromElements(
		<>
			{/* Public routes */}
			<Route element={<PublicLayout />}>
				<Route path="/" element={<LandingPage />} />
			</Route>

			{/* Auth — single Google-only entry point. Sign in and sign up are
			    the same action, so /signup and /forgot-password alias to /login. */}
			<Route element={<RedirectIfAuthenticated />}>
				<Route path="/login" element={<LoginPage />} />
			</Route>
			<Route path="/signup" element={<Navigate to="/login" replace />} />
			<Route
				path="/forgot-password"
				element={<Navigate to="/login" replace />}
			/>

			{/* Protected app shell */}
			<Route element={<ProtectedRoute />}>
				<Route path="/app" element={<AppLayout />}>
					<Route index element={<FilesPage />} />
					<Route path="calendar" element={<CalendarPage />} />
					<Route path="gmail" element={<GmailPage />} />
					<Route path="meeting" element={<MeetingPage />} />
					<Route path="chat" element={<ChatPage />} />
					<Route path="rag" element={<RagPage />} />
					<Route path="notifications" element={<NotificationsPage />} />
				</Route>
			</Route>

			{/* Legacy alias — redirect /chat to /app/chat */}
			<Route path="/chat" element={<Navigate to="/app/chat" replace />} />

			{/* 404 */}
			<Route path="*" element={<NotFoundPage />} />
		</>,
	),
);
