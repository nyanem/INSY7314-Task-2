import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./components/Index";
import AboutUs from "./components/AboutUs";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Register from "./components/Register";
import PaymentForm from "./components/PaymentForm";
import PaymentHistory from "./components/PaymentHistory";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/aboutUs" element={<AboutUs />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/register" element={<Register />} />
        <Route path="/paymentForm" element={<PaymentForm />} />
        <Route path="/paymentHistory" element={<PaymentHistory />} />

      </Routes>
    </Router>
  );
}www;

export default App;



