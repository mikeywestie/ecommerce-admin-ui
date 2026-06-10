export type InventoryProduct = {
  id: number;
  name: string;
  description?: string;
  category?: string;
  imageUrl?: string;
  active?: boolean;
  price: number;
};

export type InventoryItem = {
  inventoryId: number;
  product: InventoryProduct;
  quantityAvailable: number;
  inStock: boolean;
};

export type ProductFormPayload = {
  name: string;
  description: string;
  category: string;
  imageUrl: string;
  active: boolean;
  price: number;
  initialStock?: number | null;
};