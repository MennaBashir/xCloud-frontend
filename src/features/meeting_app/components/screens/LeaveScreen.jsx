export function LeaveScreen({ setIsMeetingLeft }) {
  return (
    <div className="bg-[#F3F4F6] h-screen flex flex-col flex-1 items-center justify-center gap-8">
      <h1 className="text-[#162E54] text-4xl font-bold">You left the meeting!</h1>
      <div>
        <button
          className="bg-[#3B82F6] hover:bg-[#2563EB] text-white px-16 py-3 rounded-lg text-sm font-medium transition-colors shadow-lg"
          onClick={() => {
            setIsMeetingLeft(false);
          }}
        >
          Rejoin the Meeting
        </button>
      </div>
    </div>
  );
}
