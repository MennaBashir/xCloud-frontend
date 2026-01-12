import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import FilesLayout from "../layout/FilesLayout";
import LandingPage from "@/pages/Landing";
import CalendarPage from "@/pages/Calendar";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<LandingPage />} />
      <Route>
        <Route path="/app" element={<MainLayout />}>
          <Route index element={<p>FileSidebar</p>} />
          <Route path="calendar" element={<CalendarPage />} />
          <Route path="gmail" element={<p>Gmail</p>} />
          <Route path="meeting" element={<p>Meeting</p>} />
		  <Route path="chat" element={<p>Chat</p>} />
        </Route>
      </Route>
      {/* <Route path="/learn" element={<FilesLayout />}>
        <Route index element={<h1>Learn</h1>} />
        <Route path="think" element={<h1>Think</h1>} />
        <Route path="install" element={<h1>Install</h1>} />
      </Route> */}
    </>
  )
);
