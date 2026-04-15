import type { PaymentMethod } from "@prisma/client";
import type { PaymentProvider } from "./types";
import { MockPaymentProvider } from "./mock-provider";

const providers: Record<string, PaymentProvider> = {
  mock: new MockPaymentProvider(),
};

export function getPaymentProvider(method: PaymentMethod): PaymentProvider {
  // In production, map each method to its real provider:
  // CARD -> Stripe/Flutterwave
  // MOBILE_MONEY -> MTN MoMo / Airtel Money
  // BANK_TRANSFER -> manual/bank integration
  // For now, all methods use the mock provider
  switch (method) {
    case "CARD":
    case "MOBILE_MONEY":
    case "BANK_TRANSFER":
    case "MANUAL":
      return providers.mock;
    default:
      return providers.mock;
  }
}

export { type PaymentProvider, type PaymentResult, type PaymentVerification } from "./types";
