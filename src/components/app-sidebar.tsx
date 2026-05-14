import {
  ClipboardCheck,
  Clock3,
  Folder,
  Music2,
  NotebookPen,
  Search,
  Settings,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "./ui/separator";

// Menu items.
const items = [
  {
    title: "Recent",
    icon: Clock3,
    type: "recent",
  },
  {
    title: "All files",
    icon: Folder,
    type: "allFiles",
  },
  {
    title: "Recordes",
    icon: Music2,
    type: "recordes",
  },
  {
    title: "Saved Tasks",
    icon: ClipboardCheck,
    type: "savedTasks",
  },
  {
    title: "Saved Notes",
    icon: NotebookPen,
    type: "savedNotes",
  },
];

export function AppSidebar({
  setCurrentTab,
  currentTab,
}: {
  setCurrentTab: (tab: string) => void;
  currentTab: string;
}) {
  return (
    <Sidebar className="min-h-0" collapsible="icon">
      <SidebarContent className="pt-20 bg-skyblue-50">
        <SidebarGroup>
          <SidebarGroup className="flex gap-1 items-center flex-row-reverse">
            <SidebarTrigger className="cursor-pointer pl-4" />
            <div className="relative flex justify-between items-center pl-3 pr-1 h-14 bg-skyblue-200 rounded-[48px]">
              <input
                type="text"
                placeholder="Search..."
                className="w-full flex-1 focus:outline-none focus:ring-2 focus-visible:ring-0 bg-transparent"
              />
              <button className="bg-skyblue-500 w-11 h-11 flex justify-center items-center rounded-full cursor-pointer">
                <Search
                  className="w-[26px] h-[26px] text-white "
                  strokeWidth={1.4}
                />
              </button>
            </div>
          </SidebarGroup>
          <Separator
            orientation="horizontal"
            className="mt-2 mb-6 text-gray-300"
          />
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    onClick={() => setCurrentTab(item.type)}
                    className={`hover:bg-skyblue-300 rounded-2xl cursor-pointer p-4 transition duration-100 h-[54px] ${
                      item.type === currentTab ? "bg-skyblue-300" : ""
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <item.icon
                        style={{ width: 20, height: 20 }}
                        className={` ${
                          item.type === "recent"
                            ? "text-[#14B8A6]"
                            : item.type === "allFiles"
                            ? "text-[#EBC428]"
                            : item.type === "recordes"
                            ? "text-[#F35549]"
                            : item.type === "savedTasks"
                            ? "text-[#8B5CFC]"
                            : item.type === "savedNotes"
                            ? "text-[#3B82F6]"
                            : ""
                        }`}
                      />
                      <span className="text-skyblue-950 text-xl font-bold">
                        {item.title}
                      </span>
                    </span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
          <Separator
            orientation="horizontal"
            className="mt-2 mb-6 text-gray-300"
          />
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className={`hover:bg-skyblue-300 rounded-2xl cursor-pointer p-4 transition duration-100 h-[54px]`}
                >
                  <span className="flex items-center gap-3">
                    <Settings
                      style={{ width: 20, height: 20 }}
                      className={`text-[#8695AA]`}
                    />
                    <span className="text-skyblue-950 text-xl font-bold">
                      Settings
                    </span>
                  </span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
