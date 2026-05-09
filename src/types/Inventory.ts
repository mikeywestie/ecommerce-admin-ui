export type InventoryProduct = {
  id: number;
  name: string;
  price: number;
};

export type InventoryItem = {
  inventoryId: number;
  product: InventoryProduct;
  quantityAvailable: number;
  inStock: boolean;
};