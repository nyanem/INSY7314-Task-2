import React, { useEffect, useRef, useState } from "react";

const SessionTimeout = ({ timeLimitSeconds = 300, onTimeout, onReset, startOnMount = true }) => {
  const [timeRemaining, setTimeRemaining] = useState(timeLimitSeconds);
  const [timedOut, setTimedOut] = useState(false);
  const timerRef = useRef(null);
  
  // Store last reset timestamp in localStorage
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
    storeResetTime(); // Record when we started the timer
    
    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setTimedOut(true);
          
          // Call timeout callback if provided
          if (typeof onTimeout === "function") onTimeout();
          
          // Auto reload the page after timeout
          setTimeout(() => {
            // Mark that we're doing a timeout reload
            localStorage.setItem('timerReloading', 'true');
            window.location.reload();
          }, 2000); // Give 2 seconds to show the timeout message before reload
          
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
    // Check if we're coming from a reload
    const reloading = localStorage.getItem('timerReloading') === 'true';
    if (reloading) {
      // Clear the reload flag
      localStorage.removeItem('timerReloading');
      // Ensure we start fresh after reload
      resetTimer();
    } else if (startOnMount) {
      startTimer();
    }
    
    // Set up page visibility change event to handle browser tab switching
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // When tab becomes visible again, reset the timer to ensure accuracy
        resetTimer();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      clearInterval(timerRef.current);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLimitSeconds]); // Re-initialize when timeLimitSeconds changes

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
    width: "60px",
    height: "60px",
    backgroundColor: "#b4aee8", // Light purple color like in the image
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "28px",
    fontWeight: "bold",
    color: "#301b5b", // Dark purple color for text
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