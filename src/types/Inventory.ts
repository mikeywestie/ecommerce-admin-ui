export type InventoryProduct = {
  id: number;
  name: string;
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