import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import LandingPage from "@/pages/Landing";
import CalendarPage from "@/pages/Calendar";
import LayoutSidebar from "../ui/layoutSidebar";
import Chat from "@/features/chat/Chat";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<LandingPage />} />
      <Route>
        <Route path="/app" element={<MainLayout />}>
          <Route index element={<LayoutSidebar />} />
          <Route path="calendar" element={<CalendarPage />} />
          <Route path="gmail" element={<p>Gmail</p>} />
          <Route path="meeting" element={<p>Meeting</p>} />
        </Route>
          <Route path="chat" element={<Chat />} />
      </Route>
    </>
  )
);
