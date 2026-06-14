export type PaymentStatus = "SUCCESS" | "PENDING" | "FAILED";

export type Payment = {
  id: number;
  orderId: number;
  paymentMethod: string;
  paymentStatus: PaymentStatus;
  amount: number;
  paidAt: string;
};
