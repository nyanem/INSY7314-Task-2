import React, { useEffect, useRef, useState } from "react";

const SessionTimeout = ({ timeLimitSeconds = 300, onTimeout, onReset, startOnMount = true }) => {
  const [timeRemaining, setTimeRemaining] = useState(timeLimitSeconds);
  const [timedOut, setTimedOut] = useState(false);
  const timerRef = useRef(null);
  
  const storeResetTime = () => {
    localStorage.setItem('timerLastReset', Date.now().toString());
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const startTimer = () => {
    clearInterval(timerRef.current);
    setTimedOut(false);
    setTimeRemaining(timeLimitSeconds);
    storeResetTime();
    
    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setTimedOut(true);
          
          if (typeof onTimeout === "function") onTimeout();
          
          setTimeout(() => {

            localStorage.setItem('timerReloading', 'true');
            window.location.reload();
          }, 2000);
          
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
    storeResetTime();
    
    if (typeof onReset === "function") onReset();
    startTimer();
  };

  useEffect(() => {
    const reloading = localStorage.getItem('timerReloading') === 'true';
    if (reloading) {
      localStorage.removeItem('timerReloading');
      resetTimer();
    } else if (startOnMount) {
      startTimer();
    }
    
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {

        resetTimer();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      clearInterval(timerRef.current);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };

  }, [timeLimitSeconds]);

  return (
    <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, alignItems: "center", marginBottom: 12 }}>
      <div style={styles.timerContainer}>
        <div style={styles.timeBox}>{formatTime(timeRemaining).split(":")[0]}</div>
        <div style={styles.separator}>:</div>
        <div style={styles.timeBox}>{formatTime(timeRemaining).split(":")[1]}</div>
      </div>     
    </div>
  );
};

const styles = {
  timerContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "5px",
  },
  timeBox: {
    width: "30px",
    height: "30px",
    backgroundColor: "#b4aee8", 
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "28px",
    fontWeight: "bold",
    color: "#301b5b", 
    padding: "8px",
  },
  separator: {
    fontSize: "28px",
    fontWeight: "bold",
    color: "#301b5b",
  },
  resetButton: {
    padding: "6px 10px",
    background: "#ffffff",
    border: "1px solid #ddd",
    borderRadius: 8,
    cursor: "pointer",
  }
};

export default SessionTimeout;