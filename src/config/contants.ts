// SCOS Device Info
export const DEVICE_PRICE = 150;
export const DEVICE_WEIGHT_KG = 0.365;
export const SHIPPING_RATE_PER_KG_KM = 0.01;

// Shipping policy
export const SHIPPING_COST_LIMIT = 0.15; // 15% of total after discount

// Volume discounts
export const VOLUME_DISCOUNTS = [
  { minQty: 250, discount: 0.20 },
  { minQty: 100, discount: 0.15 },
  { minQty: 50,  discount: 0.10 },
  { minQty: 25,  discount: 0.05 }
];
