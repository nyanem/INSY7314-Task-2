import React, { useState } from "react";
import Header from "./Navbar";
import SessionTimeout from "./timer";
import mastercard from "../assets/mastercard.png";
import visa from "../assets/visa.png";
import axios from "axios";

const PaymentStepper = ({ initialStep = 1, onStepChange, timeLimitSeconds = 300, onTimeout, onReset } = {}) => {
  const [currentStep, setCurrentStep] = useState(initialStep);

 const [form, setForm] = useState({
  cardBrand: "VISA",
  cardNumber: "",
  cardHolderName: "",
  expiryMonth: "",
  expiryYear: "",
  ccv: "",
  amount: "",
  currency: "ZAR",
  provider: "",
  swiftCode: "",
});


  const [savedPayment, setSavedPayment] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleTimeout = () => {
  setForm({
    cardBrand: "VISA",
    cardNumber: "",
    cardHolderName: "",
    expiryMonth: "",
    expiryYear: "",
    ccv: "",
    amount: "",
    currency: "ZAR",
    provider: "",
    swiftCode: "",
  });
  setSavedPayment(null);
  setCurrentStep(1);
};

  const steps = [
    { id: 1, label: "Make Payment" },
    { id: 2, label: "Confirm Payment"},
    { id: 3, label: "Payment Completion"},
  ];

  const goTo = (step) => {
    const next = Math.max(1, Math.min(steps.length, step));
    setCurrentStep(next);
    if (typeof onStepChange === "function") onStepChange(next);
  };

  const handleBack = () => goTo(currentStep - 1);

  const handleConfirm = async () => {
    if (currentStep === 1) {
      const required = [
      "cardBrand",
      "cardNumber",
      "cardHolderName",
      "expiryMonth",
      "expiryYear",
      "ccv",
      "amount",
      "currency",
      "provider",
      "swiftCode"
    ];

      const missing = required.filter((k) => !form[k]);
      if (missing.length) {
        alert("Please complete all required fields.");
        return;
      }

      const snapshot = { ...form, confirmedAt: new Date().toISOString() };
      setSavedPayment(snapshot);
      setPreview(snapshot);
      goTo(2);
      return;
    }

    if (currentStep === 2) {
    try {

      // build payload without storing sensitive info
      const payload = {
        ...savedPayment,
        cardToken: "none",
        cardNumber: undefined,
        ccv: undefined,
        cardLast4: savedPayment.cardNumber.slice(-4),
        savedAt: new Date().toISOString(),
      };

      // send to backend
      const response = await axios.post(
        "https://localhost:5000/api/payments/createPayment",
        payload,
        { withCredentials: true }
      );

      console.log("Payment saved:", response.data);
      goTo(3);
    } catch (err) {
      console.error("Payment error:", err);
      alert("There was an error processing your payment. Please try again.");
    }
  }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const handleCardSelect = (type) => setForm((s) => ({ ...s, cardBrand: type }));

  const stepData = steps.find((s) => s.id === currentStep) || steps[0];

  return (
    <div>
      {/* fixed stepper (stays visible when scrolling) */}
      <div className="stepper" aria-label="payment stepper" style={styles.stepper}>
        <div style={styles.connector} />
        {steps.map((step) => (
          <div key={step.id} style={styles.step}>
            <div
              style={{
                ...styles.circle,
                ...(currentStep === step.id ? styles.circleActive : currentStep > step.id ? styles.circleCompleted : {}),
              }}
            >
              {step.id}
            </div>

            <span style={styles.label}>{step.label}</span>
          </div>
        ))}
      </div>

      {}
      <div aria-hidden="true" style={{ height: 120 }} />

      <div style={{ ...styles.card, marginTop: 24 }}>
        {}
        <div style={{ position: "relative", paddingRight: 80, paddingBottom: 18 }}>
          <h3 style={styles.cardHeading}>{stepData.label}</h3>
          <div style={styles.timerWrapper}>
            <SessionTimeout timeLimitSeconds={timeLimitSeconds} onTimeout={handleTimeout} onReset={onReset} />
          </div>
        </div>

        <p style={{ textAlign: "center", marginTop: 8, color: "#6b6b7a" }}>{stepData.content}</p>

        {currentStep === 1 && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleConfirm();
            }}
            style={{ marginTop: 16 }}
          >
            <div style={{ display: "flex", gap: 32, alignItems: "flex-start" }}>
              <div style={styles.leftColumn}>

                <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
                <label
                    style={{
                    ...styles.cardOption,
                    ...(form.cardBrand === "visa" ? styles.cardSelectButtonActive : {}),
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    paddingLeft: 12,
                    }}
                    onClick={() => handleCardSelect("VISA")}
                >
                    <div style={{ ...styles.radioOuter, ...(form.cardBrand === "VISA" ? styles.radioOuterActive : {}) }}>
                    <div style={{ ...styles.radioInner, ...(form.cardBrand === "VISA" ? styles.radioInnerActive : {}) }} />
                    </div>

                    <img src={visa} alt="VISA" style={styles.cardImage} />

                    <input
                    type="radio"
                    name="cardBrand"
                    value="VISA"
                    checked={form.cardBrand === "VISA"}
                    onChange={() => handleCardSelect("VISA")}
                    style={{ display: "none" }}
                    />
                </label>

                <label
                    style={{
                    ...styles.cardOption,
                    ...(form.cardBrand === "MASTERCARD" ? styles.cardSelectButtonActive : {}),
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    paddingLeft: 12,
                    }}
                    onClick={() => handleCardSelect("MASTERCARD")}
                >
                    <div style={{ ...styles.radioOuter, ...(form.cardBrand === "MASTERCARD" ? styles.radioOuterActive : {}) }}>
                    <div style={{ ...styles.radioInner, ...(form.cardBrand === "MASTERCARD" ? styles.radioInnerActive : {}) }} />
                    </div>

                    <img src={mastercard} alt="MASTERCARD" style={styles.cardImage} />

                    <input
                    type="radio"
                    name="cardBrand"
                    value="MASTERCARD"
                    checked={form.cardBrand === "MASTERCARD"}
                    onChange={() => handleCardSelect("MASTERCARD")}
                    style={{ display: "none" }}
                    />
                </label>
                </div>


                <div style={styles.row}>
                  <label style={styles.labelField}>Card Number</label>
                  <input
                    name="cardNumber"
                    value={form.cardNumber}
                    onChange={handleChange}
                    placeholder="4455 6677 8899 1011"
                    style={styles.inputFull}
                  />
                </div>

                <div style={styles.row}>
                  <label style={styles.labelField}>Cardholder</label>
                  <input
                    name="cardHolderName"
                    value={form.cardHolderName}
                    onChange={handleChange}
                    placeholder="Samantha Jones"
                    style={styles.input}
                  />
                </div>

                
                <div style={styles.row}>
                  <label style={styles.labelField}>Expiry Date</label>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <input
                      name="expiryMonth"
                      value={form.expiryMonth}
                      onChange={handleChange}
                      placeholder="MM"
                      style={{ ...styles.smallInput, width: 72 }}
                    />
                    <span style={{ color: "#6b6b7a" }}>/</span>
                    <input
                      name="expiryYear"
                      value={form.expiryYear}
                      onChange={handleChange}
                      placeholder="YY"
                      style={{ ...styles.smallInput, width: 72 }}
                    />
                  </div>
                </div>

                <div style={styles.row}>
                  <label style={styles.labelField}>CCV</label>
                  <input
                    name="ccv"
                    value={form.ccv}
                    onChange={handleChange}
                    placeholder="665"
                    style={{ ...styles.smallInput, width: 140 }}
                  />
                </div>
                
              </div>

              <div style={{ width: 340 }}>
                <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
                  <label style={styles.blockLabel}>Enter Amount</label>
                  <input
                    name="amount"
                    value={form.amount}
                    onChange={handleChange}
                    placeholder="e.g. 1000.00"
                    style={{ ...styles.inputFull, borderRadius: 8 }}
                  />
                </div>

                <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
                  <label style={styles.blockLabel}>Currency</label>
                  <select
                    name="currency"
                    value={form.currency}
                    onChange={handleChange}
                    style={{ width: 100, padding: 8, borderRadius: 6, border: "1px solid #ddd", background: "#fff", color: "#301b5b" }}
                  >
                    <option value="ZAR">ZAR</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                    <option value="JPY">JPY</option>
                  </select>
                </div>

                <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
                  <label style={styles.blockLabel}>Provider</label>
                  <input
                    name="provider"
                    value={form.provider}
                    onChange={handleChange}
                    placeholder="e.g ABSA"
                    style={{ ...styles.inputFull, borderRadius: 8 }}
                  />
                </div>

                <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
                  <label style={styles.blockLabel}>SWIFT Code</label>
                  <input
                    name="swiftCode"
                    value={form.swiftCode}
                    onChange={handleChange}
                    placeholder="e.g AAAA-BB-CC-123"
                    style={{ ...styles.inputFull, background: "#f9f9fb", color: "#301b5b" }}
                  />
                </div>

                <div style={{ marginTop: 18 }}>
                  <button
                    type="button"
                    style={styles.actionButton}
                    onClick={handleConfirm}
                  >
                    Pay Now
                  </button>
                </div>
              </div>
            </div>
          </form>
        )}

       
        {currentStep === 2 && (
          <div style={{ marginTop: 12, maxWidth: 760 }}>
            <h2 style={{ textAlign: "center", color: "#301b5b", marginBottom: 18 }}>Payment Confirmation</h2>

            <section style={{ borderTop: "1px solid #e6e6ee", paddingTop: 16 }}>
              <h4 style={{ margin: "0 0 12px 0", color: "#6b6b7a", fontWeight: 700 }}>Account Details</h4>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 220px", rowGap: 12, alignItems: "center" }}>
                <div style={{ color: "#6b6b7a" }}>Card Number</div>
                <div style={{ textAlign: "right", fontWeight: 700 }}>
                  {(() => {
                    const num = (savedPayment?.cardNumber || "").replace(/\s+/g, "");
                    if (!num) return "**** **** **** **";
                    const last2 = num.slice(-2);
                    return "**** **** **** **" + last2;
                  })()}
                </div>

                <div style={{ color: "#6b6b7a" }}>Cardholder</div>
                <div style={{ textAlign: "right", fontWeight: 700 }}>{savedPayment?.cardHolderName || "—"}</div>

                <div style={{ color: "#6b6b7a" }}>Expiry Date</div>
                <div style={{ textAlign: "right", fontWeight: 700 }}>
                  {savedPayment?.expiryMonth || savedPayment?.expiryYear 
                    ? `${savedPayment?.expiryMonth || "--"}/${savedPayment?.expiryYear || "--"}`
                    : "—"}
                </div>

                <div style={{ color: "#6b6b7a" }}>CCV</div>
                <div style={{ textAlign: "right", fontWeight: 700 }}>***</div>
              </div>
            </section>

            <section style={{ borderTop: "1px solid #e6e6ee", paddingTop: 16, marginTop: 18 }}>
              <h4 style={{ margin: "0 0 12px 0", color: "#6b6b7a", fontWeight: 700 }}>Payment Summary</h4>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 220px", rowGap: 12, alignItems: "center" }}>
                <div style={{ color: "#6b6b7a" }}>Provider</div>
                <div style={{ textAlign: "right", fontWeight: 700 }}>{savedPayment?.provider || "—"}</div>

                <div style={{ color: "#6b6b7a" }}>SWIFT Code</div>
                <div style={{ textAlign: "right", fontWeight: 700 }}>
                  {(() => {
                    const s = savedPayment?.swift || "";
                    if (!s) return "";
                    if (s.length <= 2) return "*".repeat(s.length);
                    const last = s.slice(-1);
                    return "*".repeat(s.length - 1) + last;
                  })()}
                </div>

                <div style={{ color: "#6b6b7a" }}>Total Amount</div>
                <div style={{ textAlign: "right", fontWeight: 700 }}>
                  {(savedPayment?.currency || "R") + " " + (savedPayment?.amount || "0.00")}
                </div>
              </div>
            </section>

            <div style={{ display: "flex", gap: 16, justifyContent: "center", marginTop: 24 }}>
              <button
                onClick={handleBack}
                style={styles.actionButton}
              >
                Back
              </button>

              <button
                onClick={handleConfirm}
                style={styles.actionButton}
              >
                Confirm
              </button>
            </div>
          </div>
        )}


      {currentStep === 3 && (
        <div style={{ marginTop: 12, textAlign: "center", maxWidth: 760, margin: "0 auto" }}>
          <div style={{ marginBottom: 24 }}>
            <div style={{ 
              width: 60, 
              height: 60, 
              borderRadius: "50%", 
              background: "#301b5b", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center",
              margin: "0 auto 16px"
            }}>
              <div style={{ fontSize: 30, color: "white" }}>✓</div>
            </div>
            <h2 style={{ color: "#301b5b", marginBottom: 8 }}>Your Payment was successful!</h2>
            <p style={{ color: "#6b6b7a", marginBottom: 40 }}>Thank you for the Payment!</p>
          </div>
          
          <div style={{ 
            textAlign: "left", 
            maxWidth: 500, 
            margin: "0 auto", 
            border: "1px solid #e6e6ee",
            borderRadius: 12,
            padding: 32,
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
          }}>
            <h3 style={{ 
              fontSize: 18, 
              fontWeight: 700, 
              marginBottom: 24, 
              color: "#333", 
              borderBottom: "1px solid #e6e6ee", 
              paddingBottom: 12 
            }}>Payment Summary</h3>
            
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
              <div style={{ color: "#6b6b7a", fontWeight: 500 }}>Provider</div>
              <div style={{ color: "#333", fontWeight: 700 }}>{savedPayment?.provider || "—"}</div>
            </div>
            
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
              <div style={{ color: "#6b6b7a", fontWeight: 500 }}>SWIFT Code</div>
              <div style={{ color: "#333", fontWeight: 700 }}>
                {(() => {
                  const s = savedPayment?.swift || "";
                  if (!s) return "";
                  if (s.length <= 2) return "*".repeat(s.length);
                  const last = s.slice(-1);
                  return "*".repeat(s.length - 1) + last;
                })()}
              </div>
            </div>
            
            <div style={{ 
              display: "flex", 
              justifyContent: "space-between", 
              marginTop: 16,
              paddingTop: 16,
              borderTop: "1px solid #e6e6ee"
            }}>
              <div style={{ color: "#6b6b7a", fontWeight: 500 }}>Total Amount</div>
              <div style={{ color: "#333", fontWeight: 700, fontSize: 18 }}>
                {(savedPayment?.currency || "R") + " " + (savedPayment?.amount || "0.00")}
              </div>
            </div>
          </div>
          
            <div style={{ display: "flex", gap: 16, justifyContent: "center", marginTop: 24 }}>
                <button onClick={() => goTo(1)} style={styles.actionButton}>Make another payment</button>
                <button onClick={() => (window.location.href = "/dashboard")} style={styles.actionButton}>Dashboard</button>
            </div>
        </div>
      )}

      </div>
    </div>
  );
};

export default function PaymentForm() {
  const [resetKey, setResetKey] = useState(0);

  const handleTimeout = () => {
    setResetKey((k) => k + 1);
  };

  const handleReset = () => {
    // optional: remount stepper or reset timer
  };

  return (
    <div className="app-root">
      <Header />

      <main className="container">
        {/* SessionTimeout moved inside the card and passed into stepper so it appears inline with the heading */}
        <PaymentStepper
          key={resetKey}
          initialStep={1}
          timeLimitSeconds={300}
          onTimeout={handleTimeout}
          onReset={handleReset}
        />
      </main>
    </div>
  );
}

const styles = {
  stepper: {
    position: "absolute",
    left: "50%",
    transform: "translateX(-50%)",
    top: "120px",
    zIndex: 2000,
    width: "min(980px, 96%)",
    display: "flex",
    gap: 16,
    alignItems: "center",
    justifyContent: "center",
    padding: "8px 20px",
    height: 80,            // increase so stacked circle+label is centered
    background: "transparent",
    pointerEvents: "none",
  },
  connector: {
    position: "absolute",
    left: "22%",
    right: "22%",
    top: "40%",            // center line vertically in the stepper
    height: 2,
    background: "#e6e6ee",
    zIndex: 0,
    transform: "translateY(-50%)",
  },
  step: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 8,
    position: "relative",
    zIndex: 2,
    pointerEvents: "auto",
    /* ensure the stack is vertically centered inside the taller stepper */
    justifyContent: "center",
  },
  lineCompleted: {
    background: "#301b5b",
  },
  circle: {
    width: 36,
    height: 36,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f1f1f6",
    color: "#6b6b7a",
    fontWeight: 700,
    zIndex: 3,
  },
  circleActive: {
    background: "#301b5b",
    color: "#fff",
  },
  circleCompleted: {
    background: "#dedefe",
    color: "#301b5b",
  },
  label: {
    fontSize: 13,
    color: "#6b6b7a",
    marginLeft: 0,
    marginBottom: 6,
    textAlign: "center",
  },

  /* Card container */
  card: {
    background: "#fff",
    padding: 36,
    borderRadius: 12,
    boxShadow: "0 8px 24px rgba(18, 20, 46, 0.06)",
    maxWidth: 980,
    margin: "0 auto",
    width: "100%",
  },
  cardHeading: {
    textTransform: "capitalize",
    textAlign: "center",
    margin: 0,
    marginBottom: 42,   // <-- add spacing under the heading
    fontSize: 20,
    color: "#301b5b",
    fontWeight: 700,
  },
  timerWrapper: {
    position: "absolute",
    right: 0,
    top: 0,
    padding: "12px",
    display: "flex",
    alignItems: "center",
    height: "100%",
    color: "#6b6b7a",
    fontSize: 12,
  },

  /* Card type buttons (VISA / Mastercard) */
  cardSelectButton: {
    padding: 12,
    border: "1px solid #e6e6ee",
    background: "#fff",
    borderRadius: 8,
    cursor: "pointer",
    minWidth: 80,
    minHeight: 56,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 1px 0 rgba(0,0,0,0.02)",
  },
  cardSelectButtonActive: {
    border: "2px solid #301b5b",
    boxShadow: "0 6px 18px rgba(48,27,91,0.08)",
  },

  /* rows and labels */
  row: {
    marginBottom: 12,
    display: "grid",
    gridTemplateColumns: "160px 1fr", // label column + input column
    alignItems: "center",
    columnGap: 16,
  },
  labelField: {
    fontWeight: 700,
    color: "#301b5b",
    marginBottom: 0,
    minWidth: 140,
    fontSize: 13,
  },

  /* Inputs - muted grey boxes  */
  inputFull: {
    width: "100%",
    padding: "10px 14px",
    borderRadius: 8,
    border: "none",
    background: "#f3f4f8",
    color: "#301b5b",
    fontSize: 13,
    boxSizing: "border-box",
  },
  input: {
    flex: 1,
    padding: "10px 14px",
    borderRadius: 8,
    border: "none",
    background: "#f3f4f8",
    color: "#301b5b",
    fontSize: 13,
    boxSizing: "border-box",
  },
  smallInput: {
    padding: "8px 10px",
    borderRadius: 8,
    border: "none",
    background: "#f3f4f8",
    color: "#301b5b",
    fontSize: 13,
    boxSizing: "border-box",
  },
  blockLabel: {
    display: "block",
    fontWeight: 700,
    marginBottom: 6,
    color: "#301b5b",
    fontSize: 13,
  },

  /* Action buttons */
  actionButton: {
    padding: "12px 28px",
    background: "#004aad",
    color: "#fff",
    textDecoration: "none",
    borderRadius: 24,
    transition: "all 0.18s ease",
    fontWeight: 700,
    border: "none",
    cursor: "pointer",
    boxShadow: "0 6px 18px rgba(48,27,91,0.12)",
  },

  /* helper responsive widths for the two-column layout in step 1 */
  leftColumn: {
    flex: 1,
    minWidth: 300,
  },
  rightColumn: {
    width: 360,
    minWidth: 260,
  },
  cardOption: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    border: "1px solid #e6e6ee",
    borderRadius: 8,
    background: "#fff",
    minWidth: 96,
    minHeight: 64,
    cursor: "pointer",
    boxShadow: "0 1px 0 rgba(0,0,0,0.02)",
  },
  cardImage: {
    height: 36,
    objectFit: "contain",
  },

  /* custom radio visuals (circle left of logo) */
  radioOuter: {
    width: 18,
    height: 18,
    borderRadius: "50%",
    border: "2px solid #6b6b7a",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxSizing: "border-box",
    background: "transparent",
  },
  radioInner: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    background: "transparent",
    transition: "background 0.15s ease",
  },
  radioOuterActive: {
    borderColor: "#301b5b",
  },
  radioInnerActive: {
    background: "#301b5b",
  },
};