import React, { useState, useEffect } from "react";
import "./TrackPayment.css";
import Navbar from "./Navbar";
import axios from "axios";

export default function TrackPayments() {
  const [payments, setPayments] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [comment, setComment] = useState("");
  const [swiftCode, setSwiftCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_BASE = "/api/employees";

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        setError("");
        const token = localStorage.getItem("employeeToken");
        if (!token) {
          setError("No employee token found. Please log in.");
          setLoading(false);
          return;
        }

        const response = await axios.get(`${API_BASE}/pendingPayments`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = Array.isArray(response.data) ? response.data : response.data.items || [];
        const normalized = data.map((p) => ({
          ...p,
          status: p.status || "PENDING",
          id: String(p.id || p._id),
        }));

        setPayments(normalized);
      } catch (err) {
        console.error("Error fetching payments:", err);
        const serverMsg = err.response?.data?.message || err.response?.data || err.message;
        setError(typeof serverMsg === "string" ? serverMsg : "Failed to load payments.");
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  // Open side panel & populate SWIFT code
  const openPanel = (payment) => {
    setSelectedPayment({ ...payment });
    setSwiftCode(payment.swiftCode || "");
    setComment(""); 
  };

  const closePanel = () => {
    setSelectedPayment(null);
    setSwiftCode("");
    setComment("");
  };

  const mapStatusToAction = (status) => {
    if (!status) return null;
    const s = String(status).toUpperCase();
    if (s === "ACCEPTED" || s === "ACCEPT") return "ACCEPT";
    if (s === "REJECTED" || s === "REJECT") return "REJECT";
    return null;
  };

  const handleSubmit = async () => {
    if (!selectedPayment) return;

    try {
      setLoading(true);
      const token = localStorage.getItem("employeeToken");
      if (!token) throw new Error("Missing employee token.");

      const action = mapStatusToAction(selectedPayment.status);
      if (!action) {
        alert("Please select Accepted or Rejected as the status.");
        setLoading(false);
        return;
      }

      const sanitizedSwift = swiftCode ? swiftCode.replace(/-/g, "").toUpperCase() : "";

      const response = await axios.post(
        `${API_BASE}/verifyPayment`,
        {
          paymentId: selectedPayment.id,
          action,
          swiftCode: sanitizedSwift,
          comment,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(response.data?.message || "Payment processed.");
      setPayments((prev) => prev.filter((p) => p.id !== selectedPayment.id));
      closePanel();
    } catch (err) {
      console.error("Error verifying payment:", err);
      const serverMsg = err.response?.data?.message || err.message || "Error verifying payment.";
      alert(serverMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />

      <div className="track-container">
        <h2 className="page-title">Track Payments</h2>

        {error && <p className="error-text">{error}</p>}
        {loading && <p className="loading-text">Loading...</p>}

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Ref No.</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {payments.length > 0 ? (
                payments.map((payment) => (
                  <tr key={payment.id}>
                    <td>#{String(payment.id).substring(0, 8)}</td>
                    <td>{payment.customerName || "Unknown Customer"}</td>
                    <td>{new Date(payment.createdAt).toLocaleDateString()}</td>
                    <td>
                      {payment.currency} {Number(payment.amount).toFixed(2)}
                    </td>
                    <td>{payment.status || "PENDING"}</td>
                    <td>
                      <button className="verify-btn" onClick={() => openPanel(payment)}>
                        Verify
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center" }}>
                    No Pending Payments Found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {selectedPayment && (
          <div className="verify-panel active">
            <div className="verify-header">
              <h3>Verify Payment</h3>
              <button className="close-btn" onClick={closePanel}>
                ×
              </button>
            </div>

            <form
              className="verify-form"
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
            >
              <label>Reference Number</label>
              <input value={"#" + String(selectedPayment.id).substring(0, 8)} readOnly />

              <label>Customer Name</label>
              <input value={selectedPayment.customerName} readOnly />

              <label>Provider</label>
              <input value={selectedPayment.provider || "N/A"} readOnly />

              <label>Date</label>
              <input value={new Date(selectedPayment.createdAt).toLocaleDateString()} readOnly />

              <label>Amount</label>
              <input value={`${selectedPayment.currency} ${Number(selectedPayment.amount).toFixed(2)}`} readOnly />

              <label>SWIFT Code</label>
              <input
                placeholder="BKENGZA..."
                value={swiftCode}
                onChange={(e) => setSwiftCode(e.target.value)}
              />

              <label>Status</label>
              <select
                value={selectedPayment.status || "PENDING"}
                onChange={(e) => setSelectedPayment({ ...selectedPayment, status: e.target.value })}
              >
                <option value="PENDING">Pending</option>
                <option value="ACCEPTED">Accepted</option>
                <option value="REJECTED">Rejected</option>
              </select>

              <label>Comment</label>
              <textarea placeholder="Add a comment..." value={comment} onChange={(e) => setComment(e.target.value)} />

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? "Processing..." : "Submit"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
