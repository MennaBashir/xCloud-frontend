import AllFiles from "@/features/files/pages/AllFiles";
import RecentFiles from "@/features/files/pages/RecentFiles";

function MainContentSidebar({ currentTab }: { currentTab: string }) {
  return (
    <div>
      {
        currentTab === "recent" ? <RecentFiles /> :
        currentTab === "allFiles" ? <AllFiles /> :
        currentTab === "recordes" ? <div>Showing Recordes Content</div>:
        currentTab === "savedTasks" ? <div>Showing Saved Tasks Content</div>:
        currentTab === "savedNotes" ? <div>Showing Saved Notes Content</div>:
        <div>Welcome! Please select a tab from the sidebar.</div>
      }
    </div> 
  );
}

export default MainContentSidebar;
