import React, { useState } from "react";
import Header from "./components/header";
import SessionTimeout from "./components/timer";

const PaymentStepper = ({ initialStep = 1, onStepChange } = {}) => {
  const [currentStep, setCurrentStep] = useState(initialStep);

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

  const [savedPayment, setSavedPayment] = useState(null);
  const [preview, setPreview] = useState(null);

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

  const handleConfirm = () => {
    if (currentStep === 1) {
      const required = ["cardNumber", "cardholder", "expiryMonth", "expiryYear", "ccv", "amount"];
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

      <div className="card" style={{ marginTop: 24 }}>
        <h3 style={{ textTransform: "capitalize" }}>{stepData.label}</h3>
        <p>{stepData.content}</p>

        {currentStep === 1 && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleConfirm();
            }}
            style={{ marginTop: 16 }}
          >
            <div style={{ display: "flex", gap: 32, alignItems: "flex-start" }}>
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
                      width: 180,
                      fontWeight: 700,
                      color: "#301b5b",
                      marginBottom: 0,
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
                      width: 120,
                      fontWeight: 700,
                      color: "#301b5b",
                      marginBottom: 0,
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
                    type="button"
                    style={{
                      width: "100%",
                      padding: "14px 18px",
                      background: "#301b5b",
                      color: "#fff",
                      borderRadius: 12,
                      border: "none",
                      fontWeight: 700,
                    }}
                    onClick={handleConfirm}
                  >
                    Pay Now
                  </button>
                </div>
              </div>
            </div>
          </form>
        )}

        {currentStep === 2 && (() => {
          const data = preview ?? savedPayment ?? form ?? {};

          const maskCard = (num = "") => {
            const digits = (num || "").replace(/\s+/g, "");
            if (!digits) return "**** **** **** **";
            const last2 = digits.slice(-2);
            return "**** **** **** **" + last2;
          };

          const maskSwift = (s = "") => {
            if (!s) return "";
            if (s.length <= 2) return "*".repeat(s.length);
            const last = s.slice(-1);
            return "*".repeat(s.length - 1) + last;
          };

          const expiry = data.expiryMonth || data.expiryYear ? `${data.expiryMonth || "--"}/${data.expiryYear || "--"}` : "";

          return (
            <div style={{ marginTop: 12, maxWidth: 760 }}>
              <h2 style={{ textAlign: "center", color: "#301b5b", marginBottom: 18 }}>Payment Confirmation</h2>

              <section style={{ borderTop: "1px solid #e6e6ee", paddingTop: 16 }}>
                <h4 style={{ margin: "0 0 12px 0", color: "#6b6b7a", fontWeight: 700 }}>Account Details</h4>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 220px", rowGap: 12, alignItems: "center" }}>
                  <div style={{ color: "#6b6b7a" }}>Card Number</div>
                  <div style={{ textAlign: "right", fontWeight: 700 }}>{maskCard(data.cardNumber)}</div>

                  <div style={{ color: "#6b6b7a" }}>Cardholder</div>
                  <div style={{ textAlign: "right", fontWeight: 700 }}>{data.cardholder || "—"}</div>

                  <div style={{ color: "#6b6b7a" }}>Expiry Date</div>
                  <div style={{ textAlign: "right", fontWeight: 700 }}>{expiry || "—"}</div>

                  <div style={{ color: "#6b6b7a" }}>CCV</div>
                  <div style={{ textAlign: "right", fontWeight: 700 }}>{data.ccv || "—"}</div>
                </div>
              </section>

              <section style={{ borderTop: "1px solid #e6e6ee", paddingTop: 16, marginTop: 18 }}>
                <h4 style={{ margin: "0 0 12px 0", color: "#6b6b7a", fontWeight: 700 }}>Payment Summary</h4>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 220px", rowGap: 12, alignItems: "center" }}>
                  <div style={{ color: "#6b6b7a" }}>Provider</div>
                  <div style={{ textAlign: "right", fontWeight: 700 }}>{data.provider || "—"}</div>

                  <div style={{ color: "#6b6b7a" }}>SWIFT Code</div>
                  <div style={{ textAlign: "right", fontWeight: 700 }}>{maskSwift(data.swift)}</div>

                  <div style={{ color: "#6b6b7a" }}>Total Amount</div>
                  <div style={{ textAlign: "right", fontWeight: 700 }}>{(data.currency || "R") + " " + (data.amount || "0.00")}</div>
                </div>
              </section>

              <div style={{ borderTop: "1px solid #e6e6ee", marginTop: 20, paddingTop: 18, textAlign: "center" }}>
                <button
                  onClick={handleBack}
                  style={{
                    marginRight: 12,
                    padding: "10px 18px",
                    borderRadius: 8,
                    border: "1px solid #dcdce6",
                    background: "#fff",
                    cursor: "pointer",
                  }}
                >
                  Back
                </button>

                <button
                  onClick={handleConfirm}
                  style={{
                    padding: "12px 36px",
                    background: "#301b5b",
                    color: "#fff",
                    border: "none",
                    borderRadius: 12,
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Confirm
                </button>
              </div>
            </div>
          );
        })}

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
      </div>
    </div>
  );
};

export default function PaymentPage() {
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
        <SessionTimeout timeLimitSeconds={300} onTimeout={handleTimeout} onReset={handleReset} />
        <PaymentStepper key={resetKey} initialStep={1} />
      </main>
    </div>
  );
}