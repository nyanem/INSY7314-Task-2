import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import styles from "../styles/PaymentHistoryStyles.module.css";

const PaymentHistory = () => {
  // ---------- CONSTANTS ----------
  const STATUS_FILTERS = ["All", "Pending", "Accepted", "Rejected"];
  const DATE_FILTER_OPTIONS = [
    { days: 7, label: "Last 7 Days" },
    { days: 30, label: "Last 30 Days" },
    { days: 90, label: "Last 3 Months" },
  ];

  // ---------- STATE MANAGEMENT ----------
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error] = useState(null);
  
  // Filtering state
  const [activeFilter, setActiveFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState(null);
  const [showDateOptions, setShowDateOptions] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // ---------- SIDE EFFECTS ----------
  useEffect(() => {
    fetchTransactions();
  }, []);

  // ---------- DATA FETCHING ----------
  const fetchTransactions = () => {
    setIsLoading(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      // Sample data -  this would come from an API
      const sampleData = [
        { id: "#101884", name: "Johnathan Jones", date: "29 August 2025", amount: "R 5000.00", status: "pending" },
        { id: "#101885", name: "Sarah Smith", date: "29 August 2025", amount: "R 3500.00", status: "accepted" },
        { id: "#101886", name: "Michael Brown", date: "28 August 2025", amount: "R 2000.00", status: "rejected" },
        { id: "#101887", name: "Emily Johnson", date: "27 August 2025", amount: "R 4200.00", status: "accepted" },
        { id: "#101888", name: "David Wilson", date: "25 August 2025", amount: "R 1800.00", status: "accepted" },
        { id: "#101889", name: "Lisa Garcia", date: "20 August 2025", amount: "R 3000.00", status: "accepted" },
        { id: "#101890", name: "Robert Miller", date: "15 August 2025", amount: "R 2500.00", status: "accepted" }
      ];
      
      setTransactions(sampleData);
      setIsLoading(false);
    }, 500);
  };

  // ---------- HELPER FUNCTIONS ----------
  /**
   * Converts a date string to a Date object
   */
  const getDateFromString = (dateString) => {
    const dateParts = dateString.split(' ');
    const day = parseInt(dateParts[0]);
    const monthNames = ["january", "february", "march", "april", "may", "june", 
                        "july", "august", "september", "october", "november", "december"];
    const month = monthNames.indexOf(dateParts[1].toLowerCase());
    const year = parseInt(dateParts[2]);
    return new Date(year, month, day);
  };

  /**
   * Checks if a date string is within the specified number of days from today
   */
  const isWithinLastDays = (dateString, days) => {
    const today = new Date();
    const transactionDate = getDateFromString(dateString);
    const diffTime = Math.abs(today - transactionDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    return diffDays <= days;
  };

  const getDateFilterText = () => {
    if (!dateFilter) return "Filter by date";
    const filter = DATE_FILTER_OPTIONS.find(f => f.days === dateFilter);
    return filter ? filter.label : "Filter by date";
  };

  // ---------- EVENT HANDLERS ----------
  const handleStatusFilter = (status) => {
    setActiveFilter(status);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const handleDateFilter = (days) => {
    setDateFilter(days);
    setShowDateOptions(false);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const toggleDateOptions = () => {
    setShowDateOptions(prev => !prev);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // ---------- DATA FILTERING & PAGINATION ----------
  const getFilteredTransactions = () => {
    let filtered = [...transactions];
    
    // Apply status filter
    if (activeFilter !== "All") {
      filtered = filtered.filter(t => 
        t.status.toLowerCase() === activeFilter.toLowerCase()
      );
    }
    
    // Apply date filter
    if (dateFilter) {
      filtered = filtered.filter(t => 
        isWithinLastDays(t.date, dateFilter)
      );
    }
    
    return filtered;
  };

  const filteredTransactions = getFilteredTransactions();
  
  // Paginate transactions
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTransactions = filteredTransactions.slice(
    startIndex, 
    startIndex + itemsPerPage
  );
  
  // Calculate total pages
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  
  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    
    // Always show first page
    pages.push(1);
    
    // Calculate range around current page
    let startPage = Math.max(2, currentPage - 1);
    let endPage = Math.min(totalPages - 1, currentPage + 1);
    
    // Add ellipsis if needed
    if (startPage > 2) {
      pages.push('...');
    }
    
    // Add pages around current
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    // Add ellipsis if needed
    if (endPage < totalPages - 1) {
      pages.push('...');
    }
    
    // Always show last page if more than 1 page
    if (totalPages > 1) {
      pages.push(totalPages);
    }
    
    return pages;
  };
  
  const pageNumbers = getPageNumbers();

  // ---------- RENDER HELPERS ----------
  const renderStatusBadge = (status) => {
    // Determine class based on status
    let badgeClass;
    let statusText;
    
    switch(status) {
      case "pending":
        badgeClass = styles.pendingStatusBadge;
        statusText = "⦿ pending";
        break;
      case "accepted":
        badgeClass = styles.acceptedStatusBadge;
        statusText = "✓ accepted";
        break;
      case "rejected":
        badgeClass = styles.rejectedStatusBadge;
        statusText = "✗ rejected";
        break;
      default:
        badgeClass = styles.statusBadge;
        statusText = status;
    }
    
    return <span className={badgeClass}>{statusText}</span>;
  };

  // ---------- MAIN RENDER ----------
  return (
    <div>
      {/* Navigation */}
      <Navbar isLoggedIn={true} />
      
      {/* Main content container */}
      <div className={styles.container}>
        <h2 className={styles.title}>Payment History</h2>

        {/* Filter section */}
        <div className={styles.filterContainer}>
          {/* Status filter tabs */}
          <div className={styles.filterTabs}>
            {STATUS_FILTERS.map(filter => (
              <button 
                key={filter}
                className={`${styles.filterTab} ${filter === activeFilter ? styles.activeFilterTab : ''}`}
                onClick={() => handleStatusFilter(filter)}
              >
                {filter}
              </button>
            ))}
          </div>
          
          {/* Date filter dropdown */}
          <div className={styles.dateFilterContainer}>
            <button 
              className={`${styles.dateFilterButton} ${dateFilter ? styles.activeDateFilter : ''}`}
              onClick={toggleDateOptions}
            >
              {getDateFilterText()} ▾
            </button>
            
            {showDateOptions && (
              <div className={styles.dateOptions}>
                {DATE_FILTER_OPTIONS.map(filter => (
                  <button 
                    key={filter.days}
                    className={styles.dateOption} 
                    onClick={() => handleDateFilter(filter.days)}
                  >
                    {filter.label}
                  </button>
                ))}
                <button className={styles.dateOption} onClick={() => handleDateFilter(null)}>
                  Clear Filter
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Transaction table */}
        <div className={styles.tableContainer}>
          {/* Loading state */}
          {isLoading && (
            <div className={styles.loadingState}>Loading transactions...</div>
          )}
          
          {/* Error state */}
          {error && (
            <div className={styles.errorState}>
              <p>Error: {error}</p>
              <button 
                onClick={fetchTransactions} 
                className={styles.actionButton}
              >
                Try Again
              </button>
            </div>
          )}
          
          {/* Transaction table - shown when not loading and no error */}
          {!isLoading && !error && (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.th}>Ref No.</th>
                  <th className={styles.th}>Full Name</th>
                  <th className={styles.th}>Date</th>
                  <th className={styles.th}>Amount</th>
                  <th className={styles.th}>Status</th>
                </tr>
              </thead>
              <tbody>
                {paginatedTransactions.map((transaction, index) => (
                  <tr key={transaction.id + index}>
                    <td className={styles.td}>{transaction.id}</td>
                    <td className={styles.td}>{transaction.name}</td>
                    <td className={styles.td}>{transaction.date}</td>
                    <td className={styles.td}>{transaction.amount}</td>
                    <td className={styles.td}>
                      {renderStatusBadge(transaction.status)}
                    </td>
                  </tr>
                ))}
                
                {/* Empty state when no transactions match filters */}
                {filteredTransactions.length === 0 && (
                  <tr>
                    <td colSpan={5} className={styles.td} style={{ textAlign: 'center' }}>
                      No transactions found matching the current filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
        
        {/* Pagination */}
        {!isLoading && !error && filteredTransactions.length > 0 && (
          <div className={styles.pagination}>
            {/* Previous button */}
            <button 
              className={styles.paginationButton} 
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              &lt; Previous
            </button>

            {/* Page numbers */}
            <div className={styles.pageNumbers}>
              {pageNumbers.map((page, index) => (
                <button 
                  key={index}
                  className={`${styles.pageNumberButton} ${page === currentPage ? styles.activePageButton : ''}`}
                  onClick={() => typeof page === 'number' && handlePageChange(page)}
                  disabled={typeof page !== 'number'}
                >
                  {page}
                </button>
              ))}
            </div>

            {/* Next button */}
            <button 
              className={styles.paginationButton} 
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            >
              Next &gt;
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentHistory;