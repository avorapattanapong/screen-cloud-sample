export type WarehouseAllocation = {
  warehouseId: string;
  warehouseName: string;
  quantity: number;
  distanceKm: number;
  shippingCost: number;
};

export type OrderQuote = {
  isValid: boolean;
  totalPrice: number;
  discount: number;
  shippingCost: number;
  allocations: WarehouseAllocation[];
};
