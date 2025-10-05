// the main logic for onboarding section - get started, features, contact

// this is for the backend testing purposes, when the frontend is ready, these will be replaced by actual pages

// GET /api/onboarding/start
export const getStarted = (req, res) => {
  res.json({
    title: "Welcome to International Banking System",
    message: "👋 Thank you for choosing us! Let’s help you get started.",
    actions: {
      register: "/api/auth/register",
      login: "/api/auth/login"
    }
  });
};

// GET /api/onboarding/features
export const showFeatures = (req, res) => {
  res.json({
    title: "Why Choose Us?",
    features: [
      "🌍 International money transfers",
      "💳 Multi-currency accounts",
      "📈 Real-time exchange rates",
      "🔐 Bank-grade security"
    ]
  });
};

// GET /api/onboarding/contact
export const showContact = (req, res) => {
  res.json({
    title: "Need Help?",
    message: "Reach out to our support team anytime.",
    email: "support@intbanking.com",
    phone: "+1-800-555-0199"
  });
};
//-------------------------------------------------------------------End of File----------------------------------------------------------//