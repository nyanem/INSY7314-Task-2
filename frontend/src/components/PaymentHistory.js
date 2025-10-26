import React, { useState, useEffect  } from "react";
import Navbar from "./Navbar";
import axios from "axios";

const PaymentHistory = () => {
  
  const [transactions, setTransactions] = useState([]);
  const [activeFilter, setActiveFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [dateFilter, setDateFilter] = useState(null);
  const [showDateOptions, setShowDateOptions] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token"); 
        const res = await axios.get("/api/payments/myPayments", {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setTransactions(res.data || []);
      } catch (err) {
        console.error("Failed to fetch payments:", err);
        setError("Unable to load payment history.");
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  const isWithinLastDays = (dateString, days) => {
    const transactionDate = new Date(dateString); 
    const today = new Date();
    const diffTime = Math.abs(today - transactionDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    return diffDays <= days;
  };

  const applyFilters = () => {
    let filtered = [...transactions];
    
    // Apply status filter
    if (activeFilter !== "All") {
      filtered = filtered.filter(t => t.status.toLowerCase() === activeFilter.toLowerCase());
    }
    
    if (dateFilter) {
      filtered = filtered.filter((t) => isWithinLastDays(t.createdAt, dateFilter));
    }
    
    return filtered;
  };

  const filteredTransactions = applyFilters();

  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentTransactions = filteredTransactions.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredTransactions.length / rowsPerPage);

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, "...", totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
      }
    }
    return pages;
  };

  const handleDateFilter = (days) => {
    setDateFilter(days);
    setShowDateOptions(false);
    setCurrentPage(1);
  };

  const getStatusBadge = (status) => {
    switch(status.toLowerCase()) {
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

  const getDateFilterText = () => {
    if (!dateFilter) return "Filter by date";
    if (dateFilter === 7) return "Last 7 Days";
    if (dateFilter === 30) return "Last 30 Days";
    if (dateFilter === 90) return "Last 3 Months";
    return "Filter by date";
  };

  if (loading) return <p style={{ textAlign: "center" }}>Loading payments...</p>;
  if (error) return <p style={{ textAlign: "center", color: "red" }}>{error}</p>;

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
                style={filter === activeFilter ? {...styles.filterTab, ...styles.activeFilterTab} : styles.filterTab}
                onClick={() => { setActiveFilter(filter); setCurrentPage(1); }}
              >
                {filter}
              </button>
            ))}
          </div>

          <div style={styles.dateFilterContainer}>
            <button
              style={{...styles.dateFilterButton, ...(dateFilter ? styles.activeDateFilter : {})}}
              onClick={() => setShowDateOptions(!showDateOptions)}
            >
              {dateFilter ? `Last ${dateFilter} Days` : "Filter by date"} ▾
            </button>

            {showDateOptions && (
              <div style={styles.dateOptions}>
                <button style={styles.dateOption} onClick={() => handleDateFilter(7)}>Last 7 Days</button>
                <button style={styles.dateOption} onClick={() => handleDateFilter(30)}>Last 30 Days</button>
                <button style={styles.dateOption} onClick={() => handleDateFilter(90)}>Last 3 Months</button>
                <button style={styles.dateOption} onClick={() => handleDateFilter(null)}>Clear Filter</button>
              </div>
            )}
          </div>
        </div>

        <div style={styles.tableContainer}>
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
              {currentTransactions.length > 0 ? currentTransactions.map((transaction, index) => {
                const shortRef = transaction.paymentId.slice(0, 8);
                return (
                  <tr key={index}>
                    <td style={styles.td}>{shortRef}</td>
                    <td style={styles.td}>{transaction.amount.toFixed(2)}</td>
                    <td style={styles.td}>{transaction.currency}</td>
                    <td style={styles.td}>{transaction.provider}</td>
                    <td style={styles.td}>{new Date(transaction.createdAt).toLocaleDateString()}</td>
                    <td style={styles.td}>
                      <span style={getStatusBadge(transaction.status)}>
                        {transaction.status.toLowerCase()}
                      </span>
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center", padding: "10px" }}>No transactions found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div style={styles.pagination}>
          <button
            style={styles.paginationButton}
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            &lt; Previous
          </button>

          <div style={styles.pageNumbers}>
            {getPageNumbers().map((page, index) => (
              <button
                key={index}
                style={page === currentPage ? {...styles.pageNumberButton, ...styles.activePageButton} : styles.pageNumberButton}
                onClick={() => typeof page === "number" && setCurrentPage(page)}
                disabled={typeof page !== "number"}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            style={styles.paginationButton}
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
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