export type OrderStatus = "CREATED" | "PENDING" | "PAID" | "PAYMENT_FAILED" | "CANCELLED";

export type OrderItem = {
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
};

export type Order = {
  id: number;
  customerName: string;
  customerEmail: string;
  status: OrderStatus;
  totalAmount: number;
  couponCode: string | null;
  discountAmount: number;
  createdAt: string;
  items: OrderItem[];
};
