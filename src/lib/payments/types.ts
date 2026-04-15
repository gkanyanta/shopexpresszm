export interface PaymentProvider {
  name: string;
  initiate(
    amount: number,
    currency: string,
    metadata: Record<string, string>
  ): Promise<PaymentResult>;
  verify(transactionId: string): Promise<PaymentVerification>;
}

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  redirectUrl?: string;
  error?: string;
}

export interface PaymentVerification {
  status: "paid" | "pending" | "failed";
  transactionId: string;
  amount: number;
}
