export type WarehouseAllocation = {
  warehouseId: string;
  warehouseName: string;
  quantity: number;
  distanceKm: number;
  shippingCost: number;
}

export interface OrderQuote {
  isValid: boolean;
  totalPrice: number;
  discount: number;
  shippingCost: number;
  invalidReason: string | null;
  allocations: WarehouseAllocation[];
}

export type Warehouse = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  stock: number;
}

// Response body after order creation
export interface OrderPayload extends OrderQuote {
  id: string | null;
  createdAt: Date | null;
  status: string;
}

export interface GetOrderResponse {
  id: string;
  email: string;
  createdAt: Date;
  quantity: number;
  shippingLat: number;
  shippingLng: number;
  totalPrice: number;
  discount: number;
  shippingCost: number;
  isValid: boolean;
  status: string;
  allocations: GetOrderWarehousesAllocations[];
}

export interface GetOrderWarehousesAllocations {
  warehouseId: string;
  warehouseName: string;
  quantity: number;
}
