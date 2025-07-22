import {VOLUME_DISCOUNTS} from "../config/contants";

export function calculateDiscountRate(quantity: number): number {
  for (const tier of VOLUME_DISCOUNTS) {
    if (quantity >= tier.minQty) {
      return tier.discount;
    }
  }
  return 0;
}
