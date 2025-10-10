 import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png"; // Make sure this exists (frontend/src/assets/logo.png)

const Navbar = ({ isLoggedIn }) => {
  return (
    <nav style={styles.navbar}>
      <div style={styles.logoContainer}>
        <img src={logo} alt="PaySmart Logo" style={styles.logo} />
        <h1 style={styles.logoText}>PaySmart</h1>
      </div>
      <div style={styles.navLinks}>
        <Link to="/" style={styles.navLink}>Home</Link>
        <Link to="/aboutUs" style={styles.navLink}>About Us</Link>
        {isLoggedIn ? (
          <>
            <Link to="/dashboard" style={styles.navLink}>Dashboard</Link>
            <Link to="/paymentForm" style={styles.navLink}>Payment</Link>
          </>
        ) : (
          <Link to="/login" style={styles.navLink}>Login</Link>
        )}
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    backgroundColor: "#004aad",
    color: "white",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px 40px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
  },
  logoContainer: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  logo: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
  },
  logoText: {
    fontSize: "24px",
    fontWeight: "bold",
  },
  navLinks: {
    display: "flex",
    gap: "20px",
  },
  navLink: {
    color: "white",
    textDecoration: "none",
    fontWeight: "500",
    transition: "color 0.3s ease",
  },
};

export default Navbar;
