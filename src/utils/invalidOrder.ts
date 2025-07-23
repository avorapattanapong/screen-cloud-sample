import {SHIPPING_COST_LIMIT} from "../config/contants";

export enum InvalidOrderCode {
  INSUFFICIENT_STOCK = "INSUFFICIENT_STOCK",
  EXCEEDS_COST_THRESHOLD = "EXCEEDS_COST_THRESHOLD",
  ZERO_QUANTITY = "ZERO_QUANTITY"
}

export const INVALID_ORDER_REASONS: Record<InvalidOrderCode, string> = {
  [InvalidOrderCode.INSUFFICIENT_STOCK]: "Order rejected — insufficient stock across all warehouses.",
  [InvalidOrderCode.EXCEEDS_COST_THRESHOLD]: "Order rejected — shipping cost exceeds threshold of total revenue after discount.",
  [InvalidOrderCode.ZERO_QUANTITY]: "Order rejected — quantity must be greater than zero."
};

export function getInvalidOrderReason(
  totalPrice: number,
  shippingCost: number,
  quantity: number,
  isInsufficientStock: boolean
): InvalidOrderCode | null {
  if (isInsufficientStock) {
    return InvalidOrderCode.INSUFFICIENT_STOCK;
  }

  // Total price assumes discount is already applied
  if (shippingCost > totalPrice * SHIPPING_COST_LIMIT) {
    return InvalidOrderCode.EXCEEDS_COST_THRESHOLD;
  }

  if (quantity <= 0) {
    return InvalidOrderCode.ZERO_QUANTITY;
  }

  return null;
}
