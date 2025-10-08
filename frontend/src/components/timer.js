import React, { useEffect, useRef, useState } from "react";

const SessionTimeout = ({ timeLimitSeconds = 300, onTimeout, onReset, startOnMount = true }) => {
  const [timeRemaining, setTimeRemaining] = useState(timeLimitSeconds);
  const [timedOut, setTimedOut] = useState(false);
  const timerRef = useRef(null);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const startTimer = () => {
    clearInterval(timerRef.current);
    setTimedOut(false);
    setTimeRemaining(timeLimitSeconds);
    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setTimedOut(true);
          if (typeof onTimeout === "function") onTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const resetTimer = () => {
    clearInterval(timerRef.current);
    setTimedOut(false);
    setTimeRemaining(timeLimitSeconds);
    if (typeof onReset === "function") onReset();
    startTimer();
  };

  useEffect(() => {
    if (startOnMount) startTimer();
    return () => clearInterval(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, alignItems: "center", marginBottom: 12 }}>
      <div
        aria-live="polite"
        style={{
          padding: "6px 10px",
          borderRadius: 8,
          background: timedOut ? "#fee2e2" : timeRemaining <= 60 ? "#fef08a" : "#eef2ff",
          color: timedOut ? "#991b1b" : "#111827",
          fontWeight: 700,
          minWidth: 110,
          textAlign: "center",
        }}
      >
        {timedOut ? "Timed out" : `Time left ${formatTime(timeRemaining)}`}
      </div>

      {timedOut ? (
        <button
          onClick={resetTimer}
          style={{
            padding: "8px 12px",
            background: "#301b5b",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            cursor: "pointer",
          }}
        >
          Restart
        </button>
      ) : (
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={resetTimer}
            title="Reset timer"
            style={{
              padding: "6px 10px",
              background: "#ffffff",
              border: "1px solid #ddd",
              borderRadius: 8,
              cursor: "pointer",
            }}
          >
            Reset
          </button>
        </div>
      )}
    </div>
  );
};

export default SessionTimeout;