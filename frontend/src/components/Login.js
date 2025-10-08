import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // import this
import Navbar from "./Navbar";

const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    accountNumber: "",
    password: "",
  });

  const navigate = useNavigate(); // hook for navigation

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // TODO: Add your authentication logic here
    // For now, we'll just navigate to dashboard
    alert("Login successful!");
    navigate("/dashboard"); // navigate to dashboard
  };

  return (
    <div>
      <Navbar />
      <div style={styles.container}>
        <div style={styles.formBox}>
          <h1 style={styles.title}>Login</h1>
          <p style={styles.subtitle}>
            Welcome back! <br /> Please log in to access your account.
          </p>

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.inputGroup}>
              <input
                type="text"
                name="username"
                placeholder="Enter your Username"
                value={formData.username}
                onChange={handleChange}
                style={styles.input}
                required
              />
              <input
                type="text"
                name="accountNumber"
                placeholder="Enter your Account number"
                value={formData.accountNumber}
                onChange={handleChange}
                style={styles.input}
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Enter your Password"
                value={formData.password}
                onChange={handleChange}
                style={styles.input}
                required
              />
            </div>

            <div style={styles.captchaBox}>
              <p style={{ fontSize: "13px", color: "#888" }}>🧩 I'm not a robot (captcha placeholder)</p>
            </div>

            <button type="submit" style={styles.loginButton}>Login</button>
            <button type="button" style={styles.forgotButton}>Forgot password</button>
          </form>
        </div>
      </div>
    </div>
  );
};



const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "90vh",
    backgroundColor: "#f9f9fb",
  },
  formBox: {
    width: "450px",
    background: "#fff",
    borderRadius: "12px",
    boxShadow: "0 6px 15px rgba(0,0,0,0.1)",
    padding: "40px 30px",
    textAlign: "center",
  },
  title: {
    fontSize: "2rem",
    color: "#1a1a40",
    marginBottom: "5px",
  },
  subtitle: {
    color: "#888",
    fontSize: "14px",
    marginBottom: "25px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  input: {
    padding: "12px 18px",
    borderRadius: "25px",
    border: "none",
    outline: "none",
    background: "#1a1a1a",
    color: "#fff",
    fontSize: "14px",
  },
  captchaBox: {
    background: "#f0f0f0",
    padding: "10px",
    borderRadius: "8px",
    textAlign: "center",
    margin: "10px 0",
  },
  loginButton: {
    background: "#1a1a70",
    color: "#fff",
    padding: "12px 20px",
    borderRadius: "25px",
    border: "none",
    fontWeight: "bold",
    cursor: "pointer",
    marginTop: "10px",
  },
  forgotButton: {
    background: "#1a1a1a",
    color: "#fff",
    padding: "12px 20px",
    borderRadius: "25px",
    border: "none",
    marginTop: "10px",
    cursor: "pointer",
  },
};

export default Login;
