import React, { useState } from "react";

const PaymentStepper = ({ initialStep = 1, onStepChange } = {}) => {
  const [currentStep, setCurrentStep] = useState(initialStep);

  // --- form state for "Make payment" ---
  const [form, setForm] = useState({
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
  });

  const [savedPayment, setSavedPayment] = useState(null); // persisted when confirmed

  const steps = [
    { id: 1, label: "Make payment", content: "Enter card details and amount to pay." },
    { id: 2, label: "Confirm payment", content: "Review the payment details and confirm." },
    { id: 3, label: "Payment completion", content: "Payment successful — show receipt and next actions." },
  ];

  const goTo = (step) => {
    const next = Math.max(1, Math.min(steps.length, step));
    setCurrentStep(next);
    if (typeof onStepChange === "function") onStepChange(next);
  };

  const handleNext = () => goTo(currentStep + 1);
  const handleBack = () => goTo(currentStep - 1);

  // validate minimal required fields before advancing
  const handleConfirm = () => {
    if (currentStep === 1) {
      // simple validation
      const required = ["cardNumber", "cardholder", "expiryMonth", "expiryYear", "ccv", "amount"];
      const missing = required.filter((k) => !form[k]);
      if (missing.length) {
        alert("Please complete all required fields.");
        return;
      }

      // save snapshot for confirmation/completion steps
      setSavedPayment({ ...form, confirmedAt: new Date().toISOString() });
      goTo(2);
      return;
    }

    if (currentStep === 2) {
      // simulate submission
      setTimeout(() => {
        goTo(3);
      }, 400);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const handleCardSelect = (type) => setForm((s) => ({ ...s, cardType: type }));

  const isFirst = currentStep === 1;
  const isLast = currentStep === steps.length;
  const stepData = steps.find((s) => s.id === currentStep) || steps[0];

  return (
    <div>
      <div className="stepper" aria-label="payment stepper">
        {steps.map((step, index) => (
          <div key={step.id} className="step">
            {index > 0 && <div className={`line ${currentStep > step.id ? "completed" : ""}`}></div>}

            <div
              className={`circle ${
                currentStep === step.id ? "active" : currentStep > step.id ? "completed" : ""
              }`}
            >
              {step.id}
            </div>

            <span className="label">{step.label}</span>
          </div>
        ))}
      </div>

      {/* Step content area */}
      <div className="card" style={{ marginTop: 24 }}>
        <h3 style={{ textTransform: "capitalize" }}>{stepData.label}</h3>
        <p>{stepData.content}</p>

        {/* --- STEP 1: Payment form --- */}
        {currentStep === 1 && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleConfirm();
            }}
            style={{ marginTop: 16 }}
          >
            <div style={{ display: "flex", gap: 32, alignItems: "flex-start" }}>
              {/* left column: card details */}
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
                  <button
                    type="button"
                    onClick={() => handleCardSelect("visa")}
                    style={{
                      padding: 8,
                      border: form.cardType === "visa" ? "2px solid #1e1b5b" : "1px solid #ddd",
                      background: "#fff",
                      borderRadius: 6,
                    }}
                  >
                    VISA
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCardSelect("mastercard")}
                    style={{
                      padding: 8,
                      border: form.cardType === "mastercard" ? "2px solid #1e1b5b" : "1px solid #ddd",
                      background: "#fff",
                      borderRadius: 6,
                    }}
                  >
                    MasterCard
                  </button>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                  <label
                    style={{
                      width: 180, /* or use flexBasis: "140px" */
                      fontWeight: 700,
                      color: "#301b5b",
                      marginBottom: 0, /* remove block spacing since label is inline now */
                    }}
                  >
                    Card Number
                  </label>
                  <input
                    name="cardNumber"
                    value={form.cardNumber}
                    onChange={handleChange}
                    placeholder="4455 6677 8899 1011"
                    style={{ width: "100%", padding: 10, borderRadius: 6, border: "1px solid #ddd", background: "#fff", color: "#301b5b" }}
                  />
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                  <label
                    style={{
                      width: 120, /* or use flexBasis: "140px" */
                      fontWeight: 700,
                      color: "#301b5b",
                      marginBottom: 0, /* remove block spacing since label is inline now */
                    }}
                  >
                    Cardholder
                  </label>

                  <input
                    name="cardholder"
                    value={form.cardholder}
                    onChange={handleChange}
                    placeholder="Samantha Jones"
                    style={{
                      flex: 1,
                      padding: 10,
                      borderRadius: 6,
                      border: "1px solid #ddd",
                      background: "#fff",
                      color: "#301b5b",
                    }}
                  />
                </div>

                <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
                  <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
                    <label style={{ display: "block", fontWeight: 700, marginBottom: 6, color: "#301b5b"}}>Expiry Date</label>
                    <div style={{ display: "flex", gap: 8 }}>
                      <input
                        name="expiryMonth"
                        value={form.expiryMonth}
                        onChange={handleChange}
                        placeholder="MM"
                        style={{ width: 80, padding: 10, borderRadius: 6, border: "1px solid #ddd", background: "#fff", color: "#301b5b" }}
                      />
                      <span style={{ alignSelf: "center" }}>/</span>
                      <input
                        name="expiryYear"
                        value={form.expiryYear}
                        onChange={handleChange}
                        placeholder="YY"
                        style={{ width: 80, padding: 10, borderRadius: 6, border: "1px solid #ddd", background: "#fff", color: "#301b5b" }}
                      />
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
                    <label style={{ display: "block", fontWeight: 700, marginBottom: 6, color: "#301b5b"}}>CCV</label>
                    <input
                      name="ccv"
                      value={form.ccv}
                      onChange={handleChange}
                      placeholder="665"
                      style={{ width: "100%", padding: 10, borderRadius: 6, border: "1px solid #ddd", background: "#fff", color: "#301b5b" }}
                    />
                  </div>
                </div>
              </div>

              {/* right column: amount + provider */}
              <div style={{ width: 340 }}>
                <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
                  <label style={{ display: "block", fontWeight: 700, marginBottom: 6, color: "#301b5b"}}>Enter Amount</label>
                  <input
                    name="amount"
                    value={form.amount}
                    onChange={handleChange}
                    placeholder="e.g. 1000.00"
                    style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #ddd", background: "#fff", color: "#301b5b" }}
                  />
                </div>


                <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
                  <label style={{ display: "block", fontWeight: 700, marginBottom: 6, color: "#301b5b"}}>Currency</label>
                  <select
                    name="currency"
                    value={form.currency}
                    onChange={handleChange}
                    style={{ width: 100, padding: 8, borderRadius: 6, border: "1px solid #ddd", background: "#fff", color: "#301b5b" }}
                  >
                    <option>R</option>
                    <option>USD</option>
                    <option>EUR</option>
                  </select>
                </div>

                <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
                  <label style={{ display: "block", fontWeight: 700, marginBottom: 6, color: "#301b5b"}}>Provider</label>
                  <input
                    name="provider"
                    value={form.provider}
                    onChange={handleChange}
                    placeholder="e.g ABSA"
                    style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #ddd", background: "#fff", color: "#301b5b" }}
                  />
                </div>

                <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
                  <label style={{ display: "block", fontWeight: 700, marginBottom: 6, color: "#301b5b"}}>SWIFT Code</label>
                  <input
                    name="swift"
                    value={form.swift}
                    onChange={handleChange}
                    placeholder="e.g AAAA-BB-CC-123"
                    style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #ddd", color: "#301b5b",background: "#f9f9fb" }}
                  />
                </div>

                <div style={{ marginTop: 18 }}>
                  <button
                    type="submit"
                    style={{
                      width: "100%",
                      padding: "14px 18px",
                      background: "#301b5b",
                      color: "#fff",
                      borderRadius: 12,
                      border: "none",
                      fontWeight: 700,
                    }}

                    onClick={handleNext}
                  >
                    Pay Now
                  </button>
                </div>
              </div>
            </div>
          </form>
        )}

        {/* --- STEP 2: Confirmation --- */}
        {currentStep === 2 && (
          <div style={{ marginTop: 12 }}>
            <h4>Confirm Payment</h4>
            <pre style={{ background: "#f6f6f6", padding: 12, borderRadius: 8 }}>
              {JSON.stringify(savedPayment || form, null, 2)}
            </pre>
            <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
              <button onClick={handleBack}>Back</button>
              <button onClick={handleConfirm} style={{ background: "#16a34a", color: "#fff", padding: "8px 12px" }}>
                Submit Payment
              </button>
            </div>
          </div>
        )}

        {/* --- STEP 3: Completion --- */}
        {currentStep === 3 && (
          <div style={{ marginTop: 12 }}>
            <h4>Payment Completed</h4>
            <p>Receipt</p>
            <pre style={{ background: "#f6f6f6", padding: 12, borderRadius: 8 }}>
              {JSON.stringify(savedPayment, null, 2)}
            </pre>
            <div style={{ marginTop: 12 }}>
              <button onClick={() => goTo(1)}>Make another payment</button>
            </div>
          </div>
        )}

        {/* Controls kept for keyboard navigation if needed
        <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
          <button onClick={handleBack} disabled={isFirst}>
            Back
          </button>

          {!isLast && (
            <>
              <button onClick={handleNext} style={{ background: "#1a73e8", color: "#fff" }}>
                Next
              </button>

              <button onClick={handleConfirm} style={{ background: "#16a34a", color: "#fff" }}>
                Confirm
              </button>
            </>
          )}

          {isLast && (
            <button
              onClick={() => {
                goTo(1);
              }}
              style={{ background: "#6b21a8", color: "#fff" }}
            >
              Finish
            </button>
          )}
        </div> */}
      </div>
    </div>
  );
};

export default PaymentStepper;