import React, { useState } from "react";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    idNumber: "",
    accountNumber: "",
    username: "",
    password: "",
  });
  // Inside Register component:
const navigate = useNavigate();

const handleSubmit = (e) => {
  e.preventDefault();
  alert("Registration successful!");
  navigate("/dashboard");
};

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                style={styles.input}
                required
              /> 
               <input
                type="text"
                name="accountNumber"
                placeholder="Account Number"
                value={formData.accountNumber}
                onChange={handleChange}
                style={styles.input}
                required
              />
               
              
            </div>

            {/* Row 2 */}
            <div style={styles.inputRow}>
           <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                style={styles.input}
                required
              />
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
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
                placeholder="ID Number"
                value={formData.idNumber}
                onChange={handleChange}
                style={styles.input}
                required
              />
              
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                style={styles.input}
                required
              />
            </div>

            <button Link to="/dashboard" type="submit" style={styles.registerButton}>Register</button>
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
