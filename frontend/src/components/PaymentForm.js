import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import SessionTimeout from "./timer";
import mastercard from "../assets/mastercard.png";
import visa from "../assets/visa.png";
import styles from "../styles/PaymentFormStyles.module.css";
import axios from "axios";

const PaymentForm = () => {
  // ---------- CONSTANTS ----------
  const PAYMENT_STEPS = [
    { id: 1, label: "Make Payment" },
    { id: 2, label: "Confirm Payment" },
    { id: 3, label: "Payment Completion" },
  ];

  const INITIAL_FORM_STATE = {
    cardType: "visa",
    cardNumber: "",
    cardholder: "",
    expiryMonth: "",
    expiryYear: "",
    ccv: "",
    amount: "",
    currency: "R",
    provider: "",
    swift: "",
  };

  // ---------- STATE MANAGEMENT ----------
  // Navigation
  const navigate = useNavigate();
  
  // Form state
  const [currentStep, setCurrentStep] = useState(1);
  const [form, setForm] = useState(INITIAL_FORM_STATE);
  const [savedPayment, setSavedPayment] = useState(null);
  
  // Timer state
  const [resetKey, setResetKey] = useState(0);

  // ---------- EVENT HANDLERS ----------
  const goToStep = (step) => {
    // Ensure step is within valid range
    const nextStep = Math.max(1, Math.min(PAYMENT_STEPS.length, step));
    setCurrentStep(nextStep);
  };

  const handleBack = () => {
    goToStep(currentStep - 1);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prevForm => ({
      ...prevForm,
      [name]: value
    }));
  };

  const handleCardSelect = (type) => {
    setForm(prevForm => ({
      ...prevForm,
      cardType: type
    }));
  };

  const handleConfirm = async () => {
    // Step 1: Initial form submission
    if (currentStep === 1) {
      // Validate form
      const requiredFields = ["cardNumber", "cardholder", "expiryMonth", "expiryYear", "ccv", "amount"];
      const missingFields = requiredFields.filter(field => !form[field]);
      
      if (missingFields.length > 0) {
        alert("Please complete all required fields.");
        return;
      }

      try {
        const cardNumberClean = form.cardNumber.replace(/\s+/g, "");
        
        // Prepare payment data for backend
        const paymentData = {
          customerId: form.cardholder,
          amount: parseFloat(form.amount),
          currency: form.currency,
          provider: form.provider || "",
          swiftCode: form.swift || "",
          cardBrand: form.cardType,
          cardNumber: cardNumberClean,
          cardLast4: cardNumberClean.slice(-4),
          expiryMonth: form.expiryMonth,
          expiryYear: form.expiryYear,
          ccv: form.ccv
        };

        // Send to backend
        const response = await axios.post("/api/payments", paymentData, {
          withCredentials: true
        });

        // Save response data and proceed to confirmation
        const paymentSnapshot = { 
          ...form,
          paymentId: response.data.id,
          confirmedAt: new Date().toISOString()
        };
        setSavedPayment(paymentSnapshot);
        goToStep(2);

      } catch (err) {
        console.error("Payment creation failed:", err);
        alert(err.response?.data?.message || "Payment failed. Please try again.");
      }
      return;
    }

    // Step 2: Confirm payment
    if (currentStep === 2) {
      try {
        setTimeout(() => goToStep(3), 400);
      } catch (err) {
        console.error("Payment confirmation failed:", err);
        alert(err.response?.data?.message || "Confirmation failed. Please try again.");
      }
    }
  };

  const handleTimeout = () => {
    alert("Your session has timed out. Please start again.");
    setResetKey(prevKey => prevKey + 1);
    setCurrentStep(1);
    setForm(INITIAL_FORM_STATE);
  };

  // ---------- RENDER HELPERS ----------
  const renderMaskedValue = (value, showLastChars = 2, placeholder = "—") => {
    if (!value) return placeholder;
    
    if (value.length <= showLastChars) {
      return "*".repeat(value.length);
    }
    
    return "*".repeat(value.length - showLastChars) + value.slice(-showLastChars);
  };

  const renderFormRow = (label, children) => (
    <div className={styles.row}>
      <label className={styles.labelField}>{label}</label>
      {children}
    </div>
  );

  const renderCardOption = (type, image) => (
    <label
      className={`${styles.cardOption} ${styles.inlineField} ${form.cardType === type ? styles.cardSelectButtonActive : ''}`}
      onClick={() => handleCardSelect(type)}
    >
      <div className={`${styles.radioOuter} ${form.cardType === type ? styles.radioOuterActive : ''}`}>
        <div className={`${styles.radioInner} ${form.cardType === type ? styles.radioInnerActive : ''}`} />
      </div>

      <img src={image} alt={type === "visa" ? "VISA" : "MasterCard"} className={styles.cardImage} />

      <input
        type="radio"
        name="cardType"
        value={type}
        checked={form.cardType === type}
        onChange={() => handleCardSelect(type)}
        style={{ display: "none" }}
      />
    </label>
  );

  // ---------- STEP COMPONENTS ----------
  const renderPaymentDetailsForm = () => (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleConfirm();
      }}
      className={styles.form}
    >
      <div className={styles.formRow}>
        {/* Card type selection */}
        <div className={styles.cardOptionContainer}>
          {renderCardOption("visa", visa)}
          {renderCardOption("mastercard", mastercard)}
        </div>

        <div className={styles.formColumns}>
          {/* Left column - card details */}
          <div className={styles.leftColumn}>
            {renderFormRow("Card Number", 
              <input
                name="cardNumber"
                value={form.cardNumber}
                onChange={handleChange}
                placeholder="4455 6677 8899 1011"
                className={styles.inputFull}
              />
            )}

            {renderFormRow("Cardholder", 
              <input
                name="cardholder"
                value={form.cardholder}
                onChange={handleChange}
                placeholder="Samantha Jones"
                className={styles.input}
              />
            )}

            {renderFormRow("Expiry Date", 
              <div className={styles.expiryDateContainer}>
                <input
                  name="expiryMonth"
                  value={form.expiryMonth}
                  onChange={handleChange}
                  placeholder="MM"
                  className={`${styles.smallInput} ${styles.dateField}`}
                />
                <span className={styles.dateSeparator}>/</span>
                <input
                  name="expiryYear"
                  value={form.expiryYear}
                  onChange={handleChange}
                  placeholder="YY"
                  className={`${styles.smallInput} ${styles.dateField}`}    
                />
              </div>
            )}

            {renderFormRow("CCV", 
              <input
                name="ccv"
                value={form.ccv}
                onChange={handleChange}
                placeholder="665"
                className={`${styles.smallInput} ${styles.ccvField}`}
              />
            )}
            
            {renderFormRow("Enter Amount", 
              <input
                name="amount"
                value={form.amount}
                onChange={handleChange}
                placeholder="e.g. 1000.00"
                className={`${styles.inputFull} ${styles.roundedInput}`}
              />
            )}
          </div>

          {/* Right column - payment details */}
          <div className={styles.rightColumn}>
            {renderFormRow("Currency", 
              <select
                name="currency"
                value={form.currency}
                onChange={handleChange}
                className={styles.select}
              >
                <option>R</option>
                <option>USD</option>
                <option>EUR</option>
              </select>
            )}

            {renderFormRow("Provider", 
              <input
                name="provider"
                value={form.provider}
                onChange={handleChange}
                placeholder="e.g ABSA"
                className={`${styles.inputFull} ${styles.roundedInput}`}
              />
            )}

            {renderFormRow("SWIFT Code", 
              <input
                name="swift"
                value={form.swift}
                onChange={handleChange}
                placeholder="e.g AAAA-BB-CC-123"
                className={`${styles.inputFull} ${styles.swiftInput}`}
              />
            )}

            {/* Submit button */}
            <div className={styles.row}>
              <button
                type="button"
                className={styles.actionButton}
                onClick={handleConfirm}
              >
                Pay Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );

  /**
   * Step 2: Payment confirmation
   */
  const renderPaymentConfirmation = () => (
    <div className={styles.confirmationContainer}>
      <h2 className={styles.centerHeading}>Payment Confirmation</h2>
      
      {/* Account details section */}
      <section className={styles.sectionDivider}>
        <h4 className={styles.sectionHeading}>Account Details</h4>
        <div className={styles.summaryGrid}>
          <div className={styles.summaryLabel}>Card Number</div>
          <div className={styles.summaryValue}>
            {savedPayment?.cardNumber ? 
              "**** **** **** **" + savedPayment.cardNumber.replace(/\s+/g, "").slice(-2) : 
              "**** **** **** **"}
          </div>

          <div className={styles.summaryLabel}>Cardholder</div>
          <div className={styles.summaryValue}>{savedPayment?.cardholder || "—"}</div>

          <div className={styles.summaryLabel}>Expiry Date</div>
          <div className={styles.summaryValue}>
            {savedPayment?.expiryMonth || savedPayment?.expiryYear
              ? `${savedPayment?.expiryMonth || "--"}/${savedPayment?.expiryYear || "--"}`
              : "—"}
          </div>

          <div className={styles.summaryLabel}>CCV</div>
          <div className={styles.summaryValue}>{savedPayment?.ccv || "—"}</div>
        </div>
      </section>

      {/* Payment summary section */}
      <section className={`${styles.sectionDivider} ${styles.sectionMargin}`}>
        <h4 className={styles.sectionHeading}>Payment Summary</h4>
        <div className={styles.summaryGrid}>
          <div className={styles.summaryLabel}>Provider</div>
          <div className={styles.summaryValue}>{savedPayment?.provider || "—"}</div>

          <div className={styles.summaryLabel}>SWIFT Code</div>
          <div className={styles.summaryValue}>
            {renderMaskedValue(savedPayment?.swift, 1)}
          </div>

          <div className={styles.summaryLabel}>Total Amount</div>
          <div className={styles.summaryValue}>
            {(savedPayment?.currency || "R") + " " + (savedPayment?.amount || "0.00")}
          </div>
        </div>
      </section>

      {/* Action buttons */}
      <div className={styles.actionContainer}>
        <button onClick={handleBack} className={styles.actionButton}>Back</button>
        <button onClick={handleConfirm} className={styles.actionButton}>Confirm</button>
      </div>
    </div>
  );

  /**
   * Step 3: Payment success
   */
  const renderPaymentSuccess = () => (
    <div className={styles.successContainer}>
      {/* Success message */}
      <div className={styles.successMessageContainer}>
        <div className={styles.successIconContainer}>
          <div className={styles.successIcon}>✓</div>
        </div>
        <h2 className={styles.successHeading}>Your Payment was successful!</h2>
        <p className={styles.successMessage}>Thank you for the Payment!</p>
      </div>

      {/* Receipt */}
      <div className={styles.receiptContainer}>
        <h3 className={styles.receiptHeader}>Payment Summary</h3>

        <div className={styles.receiptRow}>
          <div className={styles.receiptLabel}>Provider</div>
          <div className={styles.receiptValue}>{savedPayment?.provider || "—"}</div>
        </div>
    
        <div className={styles.receiptRow}>
          <div className={styles.receiptLabel}>SWIFT Code</div>
          <div className={styles.receiptValue}>
            {renderMaskedValue(savedPayment?.swift, 1)}
          </div>
        </div>

        <div className={styles.receiptTotal}>
          <div className={styles.receiptLabel}>Total Amount</div>
          <div className={styles.receiptTotalValue}>
            {(savedPayment?.currency || "R") + " " + (savedPayment?.amount || "0.00")}
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className={styles.buttonContainer}>
        <button onClick={() => goToStep(1)} className={styles.actionButton}>
          Make another payment
        </button>
        <button onClick={() => navigate("/dashboard")} className={styles.actionButton}>
          Dashboard
        </button>
      </div>
    </div>
  );

  // ---------- MAIN RENDER ----------
  return (
    <div className="app-root">
      {/* Navigation */}
      <Navbar />
      
      <main className="container">
        {/* Stepper navigation */}
        <div className={styles.stepper} aria-label="payment stepper">
          <div className={styles.connector} />
          {PAYMENT_STEPS.map((step) => (
            <div key={step.id} className={styles.step}>
              <div
                className={`${styles.circle} ${
                  currentStep === step.id ? styles.circleActive : ''} ${
                  currentStep > step.id ? styles.circleCompleted : ''
                }`}
              >
                {step.id}
              </div>
              <span className={styles.label}>{step.label}</span>
            </div>
          ))}
        </div>

        {/* Spacer for proper positioning */}
        <div className={styles.spacer} aria-hidden="true" />

        {/* Main card container */}
        <div className={`${styles.card} ${styles.cardContainer}`}>
          {/* Header with timer */}
          <div className={styles.headingContainer}>
            <h3 className={styles.cardHeading}>
              {PAYMENT_STEPS.find(step => step.id === currentStep)?.label || "Make Payment"}
            </h3>
            <div className={styles.timerWrapper}>
              <SessionTimeout 
                key={resetKey}
                timeLimitSeconds={300} 
                onTimeout={handleTimeout}
              />
            </div>
          </div>

          {/* Render current step */}
          {currentStep === 1 && renderPaymentDetailsForm()}
          {currentStep === 2 && renderPaymentConfirmation()}
          {currentStep === 3 && renderPaymentSuccess()}
        </div>
      </main>
    </div>
  );
};

export default PaymentForm;