import React from "react";
import Navbar from "./Navbar";

const Dashboard = () => {
  return (
    <div>
      <Navbar isLoggedIn={true} />
      <div style={styles.container}>
        <h2 style={styles.greeting}>Welcome to Our Bank. Hi, Samantha Jones. Welcome Back!</h2>

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
              <button style={styles.actionButton}>Make Payment</button>
              <button style={styles.actionButton}>View Payment History</button>
            </div>
          </div>
        </div>

        {/* Recent Payments Section */}
        <div style={styles.paymentsContainer}>
          <h3 style={styles.sectionTitle}>Recent Payments</h3>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Transaction ID</th>
                <th style={styles.th}>By</th>
                <th style={styles.th}>Date</th>
                <th style={styles.th}>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={styles.td}>#108884</td>
                <td style={styles.td}>Johnathan Jones</td>
                <td style={styles.td}>29 August 2025</td>
                <td style={styles.td}>Pending</td>
              </tr>
              <tr>
                <td style={styles.td}>#108883</td>
                <td style={styles.td}>Johnathan Jones</td>
                <td style={styles.td}>29 August 2025</td>
                <td style={styles.td}>Completed</td>
              </tr>
              <tr>
                <td style={styles.td}>#108882</td>
                <td style={styles.td}>Johnathan Jones</td>
                <td style={styles.td}>29 August 2025</td>
                <td style={styles.td}>Rejected</td>
              </tr>
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
    borderRadius: "25px", // more rounded corners
    transition: "all 0.3s ease", // subtle shadow
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
    borderRadius: "25px", // more rounded corners
    transition: "all 0.3s ease", // subtle shadow
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
