
import { useMeeting } from "@videosdk.live/react-sdk";
import useIsRecording from "../../hooks/useIsRecording";
import { useRef } from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useMemo } from "react";
import { Constants } from "@videosdk.live/react-sdk";
import { OutlinedButton } from "../../components/buttons/OutlinedButton";
import RecordingIcon from "../../icons/Bottombar/RecordingIcon";
const RecordingBTN = () => {
  const { startRecording, stopRecording, recordingState, meetingId } =
    useMeeting();

  const defaultOptions = {
    loop: true,
    autoplay: true,
    // animationData,
    rendererSettings: { preserveAspectRatio: "xMidYMid slice" },
    height: 64,
    width: 160,
  };

  const isRecording = useIsRecording();
  const isRecordingRef = useRef(isRecording);
  const prevRecordingRef = useRef(isRecording);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    isRecordingRef.current = isRecording;
  }, [isRecording]);

  useEffect(() => {
    const wasRecording = prevRecordingRef.current;
    prevRecordingRef.current = isRecording;

    if (wasRecording && !isRecording) {
      fetchRecordingAndOpen();
    }
  }, [isRecording]);

  const fetchRecordingAndOpen = async () => {
    setNotification({ type: "loading", message: "جاري تجهيز التسجيل..." });

    try {
      await new Promise((resolve) => setTimeout(resolve, 8000));

      const response = await fetch(
        `https://api.videosdk.live/v2/recordings?roomId=${meetingId}`,
        {
          headers: {
            Authorization: import.meta.env.VITE_VIDEOSDK_TOKEN,
          },
        },
      );

      const data = await response.json();
      const fileUrl = data?.data?.[0]?.file?.fileUrl;

      if (fileUrl) {
        window.open(fileUrl, "_blank");
        setNotification({
          type: "ready",
          message: "✅ التسجيل جاهز!",
          url: fileUrl,
        });
        setTimeout(() => setNotification(null), 10000);
      } else {
        setNotification({
          type: "error",
          message: "⚠️ الرابط مش جاهز لسه، حاولي بعد شوية.",
        });
        setTimeout(() => setNotification(null), 6000);
      }
    } catch (err) {
      console.error("Recording fetch error:", err);
      setNotification({
        type: "error",
        message: "❌ فيه مشكلة في جلب التسجيل.",
      });
      setTimeout(() => setNotification(null), 6000);
    }
  };

  const { isRequestProcessing } = useMemo(
    () => ({
      isRequestProcessing:
        recordingState === Constants.recordingEvents.RECORDING_STARTING ||
        recordingState === Constants.recordingEvents.RECORDING_STOPPING,
    }),
    [recordingState],
  );

  const _handleClick = () => {
    if (isRecordingRef.current) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <>
      {notification && (
        <div
          style={{
            position: "fixed",
            bottom: 24,
            right: 24,
            zIndex: 9999,
            background: notification.type === "error" ? "#c0392b" : "#1a1a2e",
            color: "#fff",
            padding: "14px 20px",
            borderRadius: 12,
            boxShadow: "0 4px 24px rgba(0,0,0,0.5)",
            display: "flex",
            flexDirection: "column",
            gap: 8,
            minWidth: 260,
          }}
        >
          <span style={{ fontWeight: 600, fontSize: 14 }}>
            {notification.message}
          </span>

          {notification.type === "loading" && (
            <span style={{ fontSize: 12, opacity: 0.6 }}>
              يمكن تاخد لحظة...
            </span>
          )}

          {notification.type === "ready" && notification.url && (
            <a
              href={notification.url}
              target="_blank"
              rel="noreferrer"
              style={{
                color: "#7ec8e3",
                fontSize: 13,
                textDecoration: "underline",
              }}
            >
              افتح التسجيل يدوياً ↗
            </a>
          )}

          <button
            onClick={() => setNotification(null)}
            style={{
              alignSelf: "flex-end",
              background: "transparent",
              border: "none",
              color: "#aaa",
              cursor: "pointer",
              fontSize: 12,
            }}
          >
            ✕ إغلاق
          </button>
        </div>
      )}

      <OutlinedButton
        Icon={RecordingIcon}
        onClick={_handleClick}
        isFocused={isRecording}
        tooltip={
          recordingState === Constants.recordingEvents.RECORDING_STARTED
            ? "Stop Recording"
            : recordingState === Constants.recordingEvents.RECORDING_STARTING
              ? "Starting Recording"
              : recordingState === Constants.recordingEvents.RECORDING_STOPPED
                ? "Start Recording"
                : recordingState ===
                    Constants.recordingEvents.RECORDING_STOPPING
                  ? "Stopping Recording"
                  : "Start Recording"
        }
        lottieOption={isRecording ? defaultOptions : null}
        isRequestProcessing={isRequestProcessing}
      />
    </>
  );
};
export default RecordingBTN;
