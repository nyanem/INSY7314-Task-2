export const maskPan = (pan) => {
  if (!pan || typeof pan !== "string") return "";
  const last4 = pan.replace(/\D/g, "").slice(-4);
  return { last4, masked: last4 ? `**** **** **** ${last4}` : "" };
};
