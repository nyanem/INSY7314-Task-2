import React, { useState } from "react";
import Navbar from "./Navbar";

const PaymentHistory = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [dateFilter, setDateFilter] = useState(null); // Add date filter state
  const [showDateOptions, setShowDateOptions] = useState(false); // For dropdown
  
  // Sample data - in a real app, this would come from an API
  const transactions = [
    { id: "#101884", name: "Johnathan Jones", date: "29 August 2025", amount: "R 5000.00", status: "pending" },
    { id: "#101884", name: "Johnathan Jones", date: "29 August 2025", amount: "R 5000.00", status: "accepted" },
    { id: "#101884", name: "Johnathan Jones", date: "28 August 2025", amount: "R 5000.00", status: "rejected" },
    { id: "#101884", name: "Johnathan Jones", date: "27 August 2025", amount: "R 5000.00", status: "accepted" },
    { id: "#101884", name: "Johnathan Jones", date: "25 August 2025", amount: "R 5000.00", status: "accepted" },
    { id: "#101884", name: "Johnathan Jones", date: "20 August 2025", amount: "R 5000.00", status: "accepted" },
    { id: "#101884", name: "Johnathan Jones", date: "15 August 2025", amount: "R 5000.00", status: "accepted" }
  ];

  // Date filter helper functions
  const getDateFromString = (dateString) => {
    // Parse date string to Date object
    const dateParts = dateString.split(' ');
    const day = parseInt(dateParts[0]);
    const month = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"].indexOf(dateParts[1].toLowerCase());
    const year = parseInt(dateParts[2]);
    return new Date(year, month, day);
  };

  const isWithinLastDays = (dateString, days) => {
    const today = new Date();
    const transactionDate = getDateFromString(dateString);
    const diffTime = Math.abs(today - transactionDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    return diffDays <= days;
  };

  // Apply both status and date filters
  const applyFilters = () => {
    let filtered = transactions;
    
    // Apply status filter
    if (activeFilter !== "All") {
      filtered = filtered.filter(t => t.status.toLowerCase() === activeFilter.toLowerCase());
    }
    
    // Apply date filter if active
    if (dateFilter) {
      if (dateFilter === 7) {
        filtered = filtered.filter(t => isWithinLastDays(t.date, 7));
      } else if (dateFilter === 30) {
        filtered = filtered.filter(t => isWithinLastDays(t.date, 30));
      } else if (dateFilter === 90) {
        filtered = filtered.filter(t => isWithinLastDays(t.date, 90));
      }
    }
    
    return filtered;
  };

  const filteredTransactions = applyFilters();

  // Handle date filter selection
  const handleDateFilter = (days) => {
    setDateFilter(days);
    setShowDateOptions(false);
  };

  // Get status badge styling based on status
  const getStatusBadge = (status) => {
    switch(status) {
      case "pending":
        return { ...styles.statusBadge, ...styles.pendingBadge };
      case "accepted":
        return { ...styles.statusBadge, ...styles.acceptedBadge };
      case "rejected":
        return { ...styles.statusBadge, ...styles.rejectedBadge };
      default:
        return styles.statusBadge;
    }
  };

  // Handle pagination
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const pageNumbers = [1, 2, 3, 4, "...", 10, 11];

  // Get date filter button text
  const getDateFilterText = () => {
    if (!dateFilter) return "Filter by date";
    if (dateFilter === 7) return "Last 7 Days";
    if (dateFilter === 30) return "Last 30 Days";
    if (dateFilter === 90) return "Last 3 Months";
    return "Filter by date";
  };

  return (
    <div>
      <Navbar isLoggedIn={true} />
      <div style={styles.container}>
        <h2 style={styles.title}>Payment History</h2>
        
        <div style={styles.filterContainer}>
          <div style={styles.filterTabs}>
            {["All", "Pending", "Accepted", "Rejected"].map(filter => (
              <button 
                key={filter}
                style={filter === activeFilter ? 
                  {...styles.filterTab, ...styles.activeFilterTab} : 
                  styles.filterTab
                }
                onClick={() => setActiveFilter(filter)}
              >
                {filter}
              </button>
            ))}
          </div>
          
          <div style={styles.dateFilterContainer}>
            <button 
              style={{
                ...styles.dateFilterButton,
                ...(dateFilter ? styles.activeDateFilter : {})
              }}
              onClick={() => setShowDateOptions(!showDateOptions)}
            >
              {getDateFilterText()} ▾
            </button>
            
            {showDateOptions && (
              <div style={styles.dateOptions}>
                <button style={styles.dateOption} onClick={() => handleDateFilter(7)}>
                  Last 7 Days
                </button>
                <button style={styles.dateOption} onClick={() => handleDateFilter(30)}>
                  Last 30 Days
                </button>
                <button style={styles.dateOption} onClick={() => handleDateFilter(90)}>
                  Last 3 Months
                </button>
                <button style={styles.dateOption} onClick={() => handleDateFilter(null)}>
                  Clear Filter
                </button>
              </div>
            )}
          </div>
        </div>
        
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Ref No.</th>
                <th style={styles.th}>Full Name</th>
                <th style={styles.th}>Date</th>
                <th style={styles.th}>Amount</th>
                <th style={styles.th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((transaction, index) => (
                <tr key={index}>
                  <td style={styles.td}>{transaction.id}</td>
                  <td style={styles.td}>{transaction.name}</td>
                  <td style={styles.td}>{transaction.date}</td>
                  <td style={styles.td}>{transaction.amount}</td>
                  <td style={styles.td}>
                    <span style={getStatusBadge(transaction.status)}>
                      {transaction.status === "pending" && "⦿ pending"}
                      {transaction.status === "accepted" && "✓ accepted"}
                      {transaction.status === "rejected" && "✗ rejected"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div style={styles.pagination}>
          <button style={styles.paginationButton} onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}>
            &lt; Previous
          </button>
          
          <div style={styles.pageNumbers}>
            {pageNumbers.map((page, index) => (
              <button 
                key={index}
                style={page === currentPage ? 
                  {...styles.pageNumberButton, ...styles.activePageButton} : 
                  styles.pageNumberButton
                }
                onClick={() => typeof page === 'number' && handlePageChange(page)}
                disabled={typeof page !== 'number'}
              >
                {page}
              </button>
            ))}
          </div>
          
          <button style={styles.paginationButton} onClick={() => setCurrentPage(currentPage + 1)}>
            Next &gt;
          </button>
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
    minHeight: "calc(100vh - 60px)",
  },
  title: {
    fontSize: "24px",
    color: "#301b5b",
    textAlign: "center",
    marginBottom: "40px",
    fontWeight: "bold",
  },
  filterContainer: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "20px",
    alignItems: "center",
  },
  filterTabs: {
    display: "flex",
    gap: "10px",
  },
  filterTab: {
    padding: "8px 16px",
    background: "transparent",
    border: "none",
    borderBottom: "2px solid transparent",
    cursor: "pointer",
    fontSize: "16px",
    color: "#333",
  },
  activeFilterTab: {
    borderBottom: "2px solid #301b5b",
    color: "#301b5b",
    fontWeight: "bold",
  },
  dateFilterContainer: {
    position: "relative",
  },
  dateFilterButton: {
    padding: "8px 16px",
    background: "#fff",
    border: "1px solid #ddd",
    borderRadius: "20px",
    cursor: "pointer",
    fontSize: "14px",
  },
  activeDateFilter: {
    backgroundColor: "#301b5b",
    color: "white",
    borderColor: "#301b5b",
  },
  dateOptions: {
    position: "absolute",
    top: "100%",
    right: 0,
    marginTop: "5px",
    backgroundColor: "white",
    borderRadius: "5px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    zIndex: 10,
    width: "150px",
  },
  dateOption: {
    padding: "10px 15px",
    display: "block",
    width: "100%",
    textAlign: "left",
    border: "none",
    borderBottom: "1px solid #eee",
    background: "transparent",
    cursor: "pointer",
    fontSize: "14px",
  },
  tableContainer: {
    backgroundColor: "#fff",
    overflow: "hidden",
    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
    marginBottom: "20px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    backgroundColor: "#143664ff",
    color: "white",
    padding: "10px",
    textAlign: "left",
  },
  td: {
    padding: "15px 20px",
    borderBottom: "1px solid #eee",
    color: "#333",
    fontSize: "14px",
  },
  statusBadge: {
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600",
    display: "inline-block",
    textAlign: "center",
    minWidth: "100px",
  },
  pendingBadge: {
    backgroundColor: "#fff3cd",
    color: "#856404",
  },
  acceptedBadge: {
    backgroundColor: "#d4edda",
    color: "#155724",
  },
  rejectedBadge: {
    backgroundColor: "#f8d7da",
    color: "#721c24",
  },
  pagination: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "20px",
  },
  paginationButton: {
    padding: "8px 16px",
    background: "transparent",
    border: "none",
    cursor: "pointer",
    color: "#301b5b",
    display: "flex",
    alignItems: "center",
    gap: "5px",
  },
  pageNumbers: {
    display: "flex",
    gap: "5px",
    alignItems: "center",
  },
  pageNumberButton: {
    width: "30px",
    height: "30px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "50%",
    border: "none",
    background: "transparent",
    cursor: "pointer",
    color: "#333",
  },
  activePageButton: {
    backgroundColor: "#301b5b",
    color: "#fff",
  },
};

export default PaymentHistory;