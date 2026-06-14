import api from "./api";

export type CouponType = "PERCENTAGE" | "FIXED_AMOUNT";

export type CouponResponse = {
  id: number;
  code: string;
  type: CouponType;
  value: number;
  active: boolean;
  expiresAt: string;
  reusable: boolean;
  maxUsesPerCustomer: number | null;
  maxTotalUses: number | null;
  totalRedemptions: number;
};

export type CreateCouponRequest = {
  code: string;
  type: CouponType;
  value: number;
  expiresAt: string;
  reusable: boolean;
  maxUsesPerCustomer: number | null;
  maxTotalUses: number | null;
};

export async function getCoupons(): Promise<CouponResponse[]> {
  const response = await api.get<CouponResponse[]>("/api/coupons");
  return response.data;
}

export async function createCoupon(request: CreateCouponRequest): Promise<CouponResponse> {
  const response = await api.post<CouponResponse>("/api/coupons", request);
  return response.data;
}
