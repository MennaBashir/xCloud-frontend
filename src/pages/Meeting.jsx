import MeetingApp from "@/features/meeting_app/MeetingApp.jsx";
import useMeetingStore from "@/features/meeting_app/useMeetingStore.ts";

const MeetingPage = () => {
  const isMeetingActive = useMeetingStore((s) => s.isMeetingActive);

  return (
    <div
      className={
        isMeetingActive
          ? "fixed inset-0 z-50 flex items-center justify-center"
          : "flex items-center justify-center"
      }
    >
      <MeetingApp />
    </div>
  );
};

export default MeetingPage;
