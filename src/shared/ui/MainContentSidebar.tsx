function MainContentSidebar({ currentTab }: { currentTab: string }) {
  return (
    <div>
      {
        currentTab === "recent" ? <div>Showing Recent Content</div>:
        currentTab === "allFiles" ? <div>Showing All Files Content</div>:
        currentTab === "recordes" ? <div>Showing Recordes Content</div>:
        currentTab === "savedTasks" ? <div>Showing Saved Tasks Content</div>:
        currentTab === "savedNotes" ? <div>Showing Saved Notes Content</div>:
        <div>Welcome! Please select a tab from the sidebar.</div>
      }
    </div>
  );
}

export default MainContentSidebar;
