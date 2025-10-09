import React, { useState } from "react";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import axios from "axios";


const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    idNumber: "",
    accountNumber: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      // Make sure your backend is running on this URL
      const res = await axios.post("https://localhost:5000/api/auth/register", formData, {
        withCredentials: true,
      });

      if (res.status === 201) {
        setSuccess("Registration successful!");
        setTimeout(() => navigate("/login"), 1500);
      }
    } catch (err) {
      console.error("Registration error:", err);
      if (err.response) {
        setError(err.response.data.message || "Registration failed");
      } else {
        setError("Could not connect to server");
      }
    }
  };

  return (
    <div>
      <Navbar />
      <div style={styles.container}>
        <div style={styles.formBox}>
          <h1 style={styles.title}>Register</h1>
          <p style={styles.subtitle}>
            Join our community today! <br /> Create an account to unlock features and personalized experiences.
          </p>

          <form onSubmit={handleSubmit} style={styles.form}>
            {/* Row 1 */}
            <div style={styles.inputRow}>
              <input
                type="text"
                name="firstName"
                placeholder="Enter your first name"
                value={formData.firstName}
                onChange={handleChange}
                style={styles.input}
                required
              />
              <input
                type="text"
                name="middleName"
                placeholder="Enter your middle name"
                value={formData.middleName}
                onChange={handleChange}
                style={styles.input}
              />
            </div>

            {/* Row 2 */}
            <div style={styles.inputRow}>
              <input
                type="text"
                name="lastName"
                placeholder="Enter your last name"
                value={formData.lastName}
                onChange={handleChange}
                style={styles.input}
                required
              />
              <input
                type="text"
                name="accountNumber"
                placeholder="Enter your account number"
                value={formData.accountNumber}
                onChange={handleChange}
                style={styles.input}
                required
              />
            </div>

            {/* Row 3 */}
            <div style={styles.inputRow}>
              <input
                type="text"
                name="idNumber"
                placeholder="Enter your ID number"
                value={formData.idNumber}
                onChange={handleChange}
                style={styles.input}
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                style={styles.input}
                required
              />
            </div>

            {error && <p style={{ color: "red" }}>{error}</p>}
            {success && <p style={{ color: "green" }}>{success}</p>}

            <button type="submit" style={styles.registerButton}>
              Register
            </button>
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
    width: "500px",
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
    gap: "20px",
  },
  inputRow: {
    display: "flex",
    gap: "10px",
  },
  input: {
    flex: 1, // each input takes 50% of the row
    padding: "12px 18px",
    borderRadius: "25px",
    border: "none",
    outline: "none",
    background: "#1a1a1a",
    color: "#fff",
    fontSize: "14px",
  },
  registerButton: {
    background: "#1a1a70",
    color: "#fff",
    padding: "12px 20px",
    borderRadius: "25px",
    border: "none",
    fontWeight: "bold",
    cursor: "pointer",
    marginTop: "10px",
  },
};

export default Register;
