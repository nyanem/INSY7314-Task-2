import { z } from "zod";

const currencyRegex = /^[A-Z]{3}$/;                  // e.g., ZAR, USD
const providerRegex = /^[A-Za-z0-9 .&()-]{2,40}$/;   // simple whitelist
const swiftRegex    = /^[A-Z0-9-]{6,20}$/;           // UI shows AAAA-BB-CC-123, allow simple forms
const cardBrandEnum = ["VISA", "MASTERCARD", "AMEX", "UNKNOWN"];

export const paymentCreateSchema = z.object({
  customerId: z.string().trim().min(1).optional(),
  amount: z.number().positive(),
  currency: z.string().regex(currencyRegex),
  provider: z.string().regex(providerRegex),
  swiftCode: z.string().regex(swiftRegex),

  // from the UI we only accept masked/derived card metadata
  cardBrand: z.enum(cardBrandEnum).default("UNKNOWN"),
  cardLast4: z.string().regex(/^\d{4}$/),
  expiryMonth: z.number().int().min(1).max(12),
  expiryYear: z.number().int().min(2024).max(2100)
});
