import { useEffect, useRef, useState, useCallback } from "react";
import { useMeeting, Constants } from "@videosdk.live/react-sdk";

// ─── CONFIG ───────────────────────────────────────────────────────────────────
const AUTH_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlrZXkiOiI5N2ViNGM3YS04ZGZmLTQwMWEtYTM0NC04MzJhN2I5ZDIyMGEiLCJwZXJtaXNzaW9ucyI6WyJhbGxvd19qb2luIl0sImlhdCI6MTc3MzQzNDQ0MSwiZXhwIjoxNzc0MDM5MjQxfQ.OfpnMVQrGDn_VvvmQ6GZteXA6qGPVlU6xNi8CQNRuDc"; // ← غيّره بالـ token بتاعك

async function fetchRecordingsForRoom(roomId) {
  const res = await fetch(
    `https://api.videosdk.live/v2/recordings?roomId=${roomId}`,
    { headers: { Authorization: AUTH_TOKEN } }
  );
  const data = await res.json();
  return data?.data || [];
}

// ─── DOWNLOAD MODAL ───────────────────────────────────────────────────────────
function DownloadModal({ recordings, polling, onClose }) {
  return (
    <div style={{
      position: "fixed", inset: 0,
      background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)",
      zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <div style={{
        background: "#13151f", border: "1px solid #2a2d3e",
        borderRadius: 16, padding: 32, width: "90%", maxWidth: 460,
        fontFamily: "'DM Sans', sans-serif",
      }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h2 style={{ margin: 0, color: "#f1f5f9", fontSize: 18, fontWeight: 700 }}>
            🎬 التسجيل
          </h2>
          <button onClick={onClose} style={{
            background: "none", border: "none", color: "#64748b",
            fontSize: 20, cursor: "pointer",
          }}>✕</button>
        </div>

        {/* Still processing */}
        {recordings.length === 0 ? (
          <div style={{ textAlign: "center", padding: "28px 0" }}>
            {polling ? (
              <>
                <div style={{
                  width: 40, height: 40, border: "3px solid #6366f1",
                  borderTopColor: "transparent", borderRadius: "50%",
                  animation: "spin 0.8s linear infinite",
                  margin: "0 auto 16px",
                }} />
                <p style={{ color: "#94a3b8", margin: 0, lineHeight: 1.7, fontSize: 14 }}>
                  جاري معالجة التسجيل…<br />
                  <span style={{ color: "#64748b", fontSize: 12 }}>ده بياخد من 1 لـ 3 دقايق</span>
                </p>
              </>
            ) : (
              <>
                <div style={{ fontSize: 36, marginBottom: 12 }}>⏳</div>
                <p style={{ color: "#94a3b8", margin: 0, fontSize: 14 }}>
                  لسه مفيش تسجيلات متاحة
                </p>
              </>
            )}
            <button onClick={onClose} style={{
              marginTop: 20, padding: "10px 28px",
              background: "#6366f1", color: "#fff",
              border: "none", borderRadius: 8, cursor: "pointer",
              fontSize: 14, fontWeight: 600,
            }}>
              إغلاق
            </button>
          </div>
        ) : (
          /* Recording list */
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {recordings.map((rec, i) => (
              <div key={rec.file?.fileUrl || i} style={{
                background: "#1a1d2e", borderRadius: 10, padding: "14px 16px",
                display: "flex", alignItems: "center", justifyContent: "space-between",
                border: "1px solid #2a2d3e",
              }}>
                <div>
                  <div style={{ color: "#e2e8f0", fontWeight: 600, fontSize: 14 }}>
                    تسجيل {i + 1}
                  </div>
                  <div style={{ color: "#64748b", fontSize: 12, marginTop: 3 }}>
                    {rec.file?.size
                      ? `${(rec.file.size / (1024 * 1024)).toFixed(1)} MB`
                      : "MP4"}
                  </div>
                </div>

                <div style={{ display: "flex", gap: 8 }}>
                  {/* Play in new tab */}
                  <button
                    onClick={() => window.open(rec.file?.fileUrl, "_blank")}
                    style={{
                      padding: "8px 14px", background: "#1e293b",
                      color: "#94a3b8", border: "1px solid #334155",
                      borderRadius: 8, cursor: "pointer", fontSize: 12,
                    }}
                  >
                    ▶ تشغيل
                  </button>

                  {/* Force download */}
                  <button
                    onClick={() => {
                      const a = document.createElement("a");
                      a.href = rec.file?.fileUrl;
                      a.download = `recording-${i + 1}.mp4`;
                      a.target = "_blank";
                      document.body.appendChild(a);
                      a.click();
                      document.body.removeChild(a);
                    }}
                    style={{
                      padding: "8px 14px",
                      background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                      color: "#fff", border: "none",
                      borderRadius: 8, cursor: "pointer", fontSize: 12, fontWeight: 600,
                    }}
                  >
                    ⬇ تحميل
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

// ─── RECORDING MANAGER — الـ component الرئيسي ────────────────────────────────
/**
 * الاستخدام:
 *   <RecordingManager meetingId="xxx-yyy-zzz" />
 *
 * لازم يكون جوه <MeetingProvider> بتاعك
 */
export default function RecordingControl() {
   const { meetingId } = useMeeting();
  const [recordingState, setRecordingState] = useState(
    Constants.recordingEvents.RECORDING_STOPPED
  );
  const [recordings, setRecordings]   = useState([]);
  const [showModal, setShowModal]     = useState(false);
  const [polling, setPolling]         = useState(false);
  const pollingRef                    = useRef(null);

  // ── Polling: يفحص كل 6 ثواني لحد ما الملف يبقى جاهز ─────────────────────
  const startPolling = useCallback(() => {
    setPolling(true);
    let attempts = 0;

    pollingRef.current = setInterval(async () => {
      attempts++;
      try {
        const recs = await fetchRecordingsForRoom(meetingId);
        if (recs.length > 0) {
          setRecordings(recs);
          clearInterval(pollingRef.current);
          setPolling(false);
        }
      } catch (_) {}

      if (attempts >= 20) {           // max ~2 دقيقة
        clearInterval(pollingRef.current);
        setPolling(false);
      }
    }, 6000);
  }, [meetingId]);

  useEffect(() => () => clearInterval(pollingRef.current), []);

  // ── useMeeting: بس للـ recording events ──────────────────────────────────
  const { startRecording, stopRecording } = useMeeting({
    onRecordingStateChanged: ({ status }) => {
      setRecordingState(status);

      if (status === Constants.recordingEvents.RECORDING_STOPPED) {
        setRecordings([]);   // reset قديم
        setShowModal(true);  // افتح الـ modal فوراً
        startPolling();      // ابدأ تفتش عن الملف
      }
    },
  });

  // ── Toggle ────────────────────────────────────────────────────────────────
  const handleToggle = () => {
    const isRec = recordingState === Constants.recordingEvents.RECORDING_STARTED;

    if (isRec) {
      stopRecording();
    } else if (recordingState === Constants.recordingEvents.RECORDING_STOPPED) {
      startRecording(null, null, {
        layout:      { type: "GRID", priority: "SPEAKER", gridSize: 4 },
        theme:       "DARK",
        mode:        "video-and-audio",
        quality:     "high",
        orientation: "landscape",
      });
    }
  };

  const isRecording  = recordingState === Constants.recordingEvents.RECORDING_STARTED;
  const isStarting   = recordingState === Constants.recordingEvents.RECORDING_STARTING;
  const isStopping   = recordingState === Constants.recordingEvents.RECORDING_STOPPING;
  const isLoading    = isStarting || isStopping;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        @keyframes recPulse {
          0%,100% { opacity:1; transform:scale(1); }
          50%      { opacity:.4; transform:scale(.8); }
        }
        .rec-btn {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 9px 18px; border: none; border-radius: 10px;
          font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600;
          cursor: pointer; transition: all .15s; user-select: none;
        }
        .rec-btn:disabled { opacity: .45; cursor: not-allowed; }
        .rec-btn.idle    { background: #1e1b4b; color: #a5b4fc; border: 1px solid #6366f1; }
        .rec-btn.idle:hover:not(:disabled) { background: #312e81; }
        .rec-btn.live    { background: #2d0f0f; color: #fca5a5; border: 1px solid #ef4444; }
        .rec-btn.live:hover:not(:disabled) { background: #3d1010; }
        .rec-btn.loading { background: #1a1d2e; color: #64748b; border: 1px solid #2a2d3e; }
        .dl-btn {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 9px 16px; border-radius: 10px; border: none;
          background: linear-gradient(135deg,#6366f1,#8b5cf6);
          color:#fff; font-family:'DM Sans',sans-serif;
          font-size:13px; font-weight:600; cursor:pointer; transition:opacity .15s;
        }
        .dl-btn:hover { opacity:.88; }
      `}</style>

      <div style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>

        {/* ── زرار التسجيل ── */}
        <button
          className={`rec-btn ${isLoading ? "loading" : isRecording ? "live" : "idle"}`}
          onClick={handleToggle}
          disabled={isLoading}
        >
          {/* نقطة وامضة وهو شغال */}
          {isRecording && (
            <span style={{
              width: 8, height: 8, borderRadius: "50%",
              background: "#ef4444",
              animation: "recPulse 1.4s ease-in-out infinite",
              flexShrink: 0,
            }} />
          )}

          {isStarting  ? "⏳ جاري البدء…"
          : isStopping ? "⏳ جاري الإيقاف…"
          : isRecording ? "⏹ إيقاف التسجيل"
          :               "⏺ بدء التسجيل"}
        </button>

        {/* ── زرار التحميل (يظهر بس لما الملف جاهز) ── */}
        {recordings.length > 0 && (
          <button className="dl-btn" onClick={() => setShowModal(true)}>
            ⬇ تحميل التسجيل
          </button>
        )}

        {/* ── مؤشر المعالجة ── */}
        {polling && (
          <span style={{
            color: "#64748b", fontSize: 12,
            fontFamily: "'DM Sans', sans-serif",
          }}>
            ⏳ جاري المعالجة…
          </span>
        )}
      </div>

      {/* ── Modal ── */}
      {showModal && (
        <DownloadModal
          recordings={recordings}
          polling={polling}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}