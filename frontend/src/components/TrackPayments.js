import React, { useState } from "react";
import { payments as initialPayments } from "../data/payments";
import "./TrackPayments.css";
import Navbar from "./Navbar"; // ✅ Fixed: component name must match import

export default function TrackPayments() {
  const [payments, setPayments] = useState(initialPayments);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [comment, setComment] = useState("");
  const [swiftCode, setSwiftCode] = useState("");

  const openPanel = (payment) => setSelectedPayment(payment);

  const closePanel = () => {
    setSelectedPayment(null);
    setComment("");
    setSwiftCode("");
  };

  const handleSubmit = () => {
    if (!selectedPayment) return;

    alert(
      `✅ Payment ${selectedPayment.paymentId} updated to "${selectedPayment.status}"\nComment: ${comment || "None"}`
    );
    closePanel();
  };

  return (
    <div>
      {/* ✅ Navbar must be inside ONE root div */}
      <Navbar />

      <div className="track-container">
        <h2 className="page-title">Track Payment</h2>

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Ref No.</th>
                <th>Full Name</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {payments.length > 0 ? (
                payments.map((payment) => (
                  <tr key={payment.paymentId}>
                    <td>#{payment.paymentId.substring(0, 8)}</td>
                    <td>{payment.fullName}</td>
                    <td>{new Date(payment.createdAt).toLocaleDateString()}</td>
                    <td>R {payment.amount.toFixed(2)}</td>
                    <td>{payment.status}</td>
                    <td>
                      <button
                        className="verify-btn"
                        onClick={() => openPanel(payment)}
                      >
                        Verify
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center" }}>
                    No Payments Found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ✅ Slide-Out Verify Panel */}
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
              <input
                value={"#" + selectedPayment.paymentId.substring(0, 8)}
                readOnly
              />

              <label>Full Name</label>
              <input value={selectedPayment.fullName} readOnly />

              <label>Account Number</label>
              <input value={selectedPayment.accountNumber} readOnly />

              <label>Date</label>
              <input
                value={new Date(selectedPayment.createdAt).toLocaleDateString()}
                readOnly
              />

              <label>Amount</label>
              <input
                value={`R ${selectedPayment.amount.toFixed(2)}`}
                readOnly
              />

              <label>SWIFT Code</label>
              <input
                placeholder="BKENG..."
                value={swiftCode}
                onChange={(e) => setSwiftCode(e.target.value)}
              />

              <label>Status</label>
              <select
                value={selectedPayment.status}
                onChange={(e) =>
                  setSelectedPayment({
                    ...selectedPayment,
                    status: e.target.value,
                  })
                }
              >
                <option>Pending</option>
                <option>Accepted</option>
                <option>Rejected</option>
              </select>

              <label>Comment</label>
              <textarea
                placeholder="Add a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />

              <button type="submit" className="submit-btn">
                Submit
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
