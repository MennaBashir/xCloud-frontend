import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { useState } from "react";
import MainContentSidebar from "./MainContentSidebar";

export default function LayoutSidebar() {
   const [currentTab, setCurrentTab] = useState("recent");
  return (
    <SidebarProvider className="min-h-0 ">
      <AppSidebar setCurrentTab={setCurrentTab} currentTab={currentTab} />
      <main className="w-full"> 
        <SidebarTrigger className="relative hidden max-md:block" />
        <div className="p-5">
          <MainContentSidebar currentTab={currentTab} />
        </div>
      </main>
    </SidebarProvider>
  )
}