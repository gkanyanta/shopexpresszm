import type {
  PaymentProvider,
  PaymentResult,
  PaymentVerification,
} from "./types";

export class MockPaymentProvider implements PaymentProvider {
  name = "mock";

  async initiate(
    amount: number,
    currency: string,
    metadata: Record<string, string>
  ): Promise<PaymentResult> {
    // Simulate a short delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const transactionId = `mock_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

    return {
      success: true,
      transactionId,
    };
  }

  async verify(transactionId: string): Promise<PaymentVerification> {
    await new Promise((resolve) => setTimeout(resolve, 200));

    return {
      status: "paid",
      transactionId,
      amount: 0, // In a real provider, this would come from the API
    };
  }
}
