import { create } from "zustand";

interface MeetingState {
  isMeetingActive: boolean;
  setMeetingActive: (active: boolean) => void;
}

const useMeetingStore = create<MeetingState>((set) => ({
  isMeetingActive: false,
  setMeetingActive: (active) => set({ isMeetingActive: active }),
}));

export default useMeetingStore;
