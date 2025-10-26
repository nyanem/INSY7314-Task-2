import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import axios from "axios";

const Dashboard = () => {
  const [customerName, setCustomerName] = useState("Customer");
  const [recentPayments, setRecentPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch customer details and recently added payments on mount
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) throw new Error("User not authenticated");

        // Fetch customer details
        const userRes = await axios.get("/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCustomerName(userRes.data.fullName || "Customer");

        // Fetch recent payments
        const paymentsRes = await axios.get("/api/payments/myPayments", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const payments = paymentsRes.data || [];
        const latestPayments = payments
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 3);
        setRecentPayments(latestPayments);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Unable to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <p style={{ textAlign: "center" }}>Loading dashboard...</p>;
  if (error) return <p style={{ textAlign: "center", color: "red" }}>{error}</p>;

  return (
    <div>
      <Navbar isLoggedIn={true} />
      <div style={styles.container}>
        <h2 style={styles.greeting}>Hi, {customerName}! Welcome Back.</h2>

        {/* Top Sections Container */}
        <div style={styles.topSections}>
          {/* Debit Card Section */}
          <div style={styles.cardContainer}>
            <h3 style={styles.sectionTitle}>Your Debit Card</h3>
            <div style={styles.cardSection}>
              <div style={styles.card}>
                <h4 style={styles.cardTitle}>Platinum Debit</h4>
                <p style={styles.cardNumber}>4725 5733 7803 9002</p>
                <p style={styles.cardValid}>Valid Thru 11/26</p>
              </div>
              <button style={styles.addCardButton}>Add Debit Card</button>
            </div>
          </div>

          {/* Balance Section */}
          <div style={styles.balanceContainer}>
            <h3 style={styles.sectionTitle}>Your Total Balance</h3>
            <p style={styles.balance}>R 80 000,00</p>
            <p style={styles.timestamp}>As of 29 August 2025, 5:05 PM</p>
            <div style={styles.actions}>
              <button style={styles.actionButton} onClick={() => window.location.href = "/paymentForm"}>
                Make Payment
              </button>
              <button style={styles.actionButton} onClick={() => window.location.href = "/paymentHistory"}>
                View Payment History
              </button>
            </div>
          </div>
        </div>

        {/* Recent Payments Section */}
        <div style={styles.paymentsContainer}>
          <h3 style={styles.sectionTitle}>Recent Payments</h3>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Ref No.</th>
                <th style={styles.th}>Amount</th>
                <th style={styles.th}>Currency</th>
                <th style={styles.th}>Provider</th>
                <th style={styles.th}>Date</th>
                <th style={styles.th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentPayments.length > 0 ? (
                recentPayments.map((payment, index) => {
                  const shortRef = payment.paymentId.slice(0, 8); // short ref
                  return (
                    <tr key={index}>
                      <td style={styles.td}>{shortRef}</td>
                      <td style={styles.td}>R {payment.amount.toFixed(2)}</td>
                      <td style={styles.td}>{payment.currency}</td>
                      <td style={styles.td}>{payment.provider}</td>
                      <td style={styles.td}>{new Date(payment.createdAt).toLocaleDateString()}</td>
                      <td style={styles.td}>
                        <span style={{
                          ...styles.statusBadge,
                          ...(payment.status.toLowerCase() === "pending" ? styles.pendingBadge : {}),
                          ...(payment.status.toLowerCase() === "accepted" ? styles.acceptedBadge : {}),
                          ...(payment.status.toLowerCase() === "rejected" ? styles.rejectedBadge : {}),
                        }}>
                          {payment.status.toLowerCase()}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center", padding: "10px" }}>
                    No Payments Yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: "40px",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f4f6f8",
  },
  greeting: {
    fontSize: "20px",
    marginBottom: "30px",
  },
  topSections: {
    display: "flex",
    flexDirection: "row",
    gap: "20px",
    flexWrap: "wrap",
    marginBottom: "40px",
  },
  cardContainer: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  },
  balanceContainer: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: "18px",
    marginBottom: "20px",
    color: "#1a1a40",
  },
  cardSection: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    flexWrap: "wrap",
  },
  card: {
    backgroundColor: "#0a2a53ff",
    color: "white",
    padding: "20px",
    borderRadius: "10px",
    minWidth: "220px",
    flex: 1,
  },
  cardTitle: {
    fontSize: "16px",
    marginBottom: "10px",
  },
  cardNumber: {
    fontSize: "14px",
    letterSpacing: "2px",
  },
  cardValid: {
    fontSize: "12px",
    marginTop: "10px",
  },
  addCardButton: {
    padding: "12px 28px",
    background: "#004aad",
    color: "#fff",
    textDecoration: "none",
    borderRadius: "25px",
    transition: "all 0.3s ease",
    fontWeight: "bold",
  },
  balance: {
    fontSize: "32px",
    fontWeight: "bold",
    margin: "10px 0",
  },
  timestamp: {
    fontSize: "14px",
    color: "#666",
  },
  actions: {
    marginTop: "20px",
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    flexWrap: "wrap",
  },
  actionButton: {
    padding: "12px 28px",
    background: "#004aad",
    color: "#fff",
    textDecoration: "none",
    borderRadius: "25px",
    transition: "all 0.3s ease",
    fontWeight: "bold",
  },
  paymentsContainer: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "10px",
  },
  th: {
    backgroundColor: "#143664ff",
    color: "white",
    padding: "10px",
    textAlign: "left",
  },
  td: {
    padding: "10px",
    borderBottom: "1px solid #ddd",
  },
};

export default Dashboard;
