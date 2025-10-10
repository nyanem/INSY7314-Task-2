import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import logo from "../assets/logo.png"

const Index = () => {

  // eslint-disable-next-line no-unused-vars
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [landingData, setLandingData] = useState(null);

  useEffect(() => {
    // fetch landing page data from backend
    const fetchLandingData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/onboarding/start`, {
          method: "GET",
          credentials: "include", // needed if you later want cookies (JWT) sent
        });
        const data = await response.json();
        setLandingData(data);
      } catch (error) {
        console.error("Error fetching landing page data:", error);
      }
    };

    fetchLandingData();
  }, []);


  return (
    <div>
      <Navbar isLoggedIn={isLoggedIn} />

      <div style={styles.container}>
        <h1>Welcome to PaySmart</h1>
        <h2>The International Payment Portal</h2>
        <div style={styles.logoContainer}>
                <img src={logo} alt="PaySmart Logo" style={styles.logo} />
              </div>
        <div style={styles.buttonContainer}>
          {!isLoggedIn ? (
            <Link to="/register" style={styles.button}>Let's Get Started</Link>
          ) : (
            <Link to="/dashboard" style={styles.button}>Go to Dashboard</Link>
          )}
        </div>
        
      </div>
    </div>
  );
};

const styles = {
  container: { textAlign: "center", marginTop: "100px" },
  buttonContainer: { marginTop: "10px" },
   logo: {
    width: "350px",
    height: "350px",
    borderRadius: "20%",
  },
  button: {
    padding: "12px 28px",
    background: "#004aad",
    color: "#fff",
    textDecoration: "none",
    borderRadius: "25px", // more rounded corners
    transition: "all 0.3s ease",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.15)", // subtle shadow
    fontWeight: "bold",
  },
};


export default Index;
