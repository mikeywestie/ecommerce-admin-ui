import api from "./api";
import type { Order } from "../types/Order";

export async function getOrders(): Promise<Order[]> {
  return [
    {
      id: "ORD-1001",
      customer: "Michael Westman",
      amount: "R1,250",
      status: "PAID",
    },
    {
      id: "ORD-1002",
      customer: "Sarah Johnson",
      amount: "R890",
      status: "PENDING",
    },
  ];

  // Later:
  // const response = await api.get("/orders");
  // return response.data;
}