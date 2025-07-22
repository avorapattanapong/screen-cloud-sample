import { PrismaClient } from '@prisma/client';

import { calculateDistanceKm } from '../utils/distance';
import { calculateDiscountRate } from '../utils/discount';
import {
  DEVICE_PRICE,
  DEVICE_WEIGHT_KG,
  SHIPPING_COST_LIMIT,
  SHIPPING_RATE_PER_KG_KM
} from "../config/contants";
import {OrderQuote, WarehouseAllocation} from "../types/orders";

const prisma = new PrismaClient();

/**
 * Verify whether an order can be fulfilled given the current warehouse stock and location.
 *
 * @param quantity The quantity of devices to be ordered.
 * @param shippingLat The latitude of the shipping destination.
 * @param shippingLng The longitude of the shipping destination.
 *
 * @returns An object describing the order quote, including whether or not the order is valid
 * and the total price, discount, shipping cost, and warehouse allocations.
 *
 * @throws An error if the quantity is not greater than zero, or if there is insufficient
 * stock to fulfill the order.
 */
export const verifyOrder = async (quantity: number, shippingLat: number, shippingLng: number): Promise<OrderQuote> => {
  if (quantity <= 0) throw new Error('Quantity must be greater than zero.');

  // Get all warehouses from the database
  const warehouses = await prisma.warehouse.findMany();
  const allocations: WarehouseAllocation[] = [];

  // Calculate the shipping cost for each warehouse
  const warehouseCosts = warehouses.map(w => {
    const distanceKm = calculateDistanceKm(shippingLat, shippingLng, w.latitude, w.longitude);
    const shippingCostPerUnit = distanceKm * DEVICE_WEIGHT_KG * SHIPPING_RATE_PER_KG_KM;
    return { ...w, distanceKm, shippingCostPerUnit };
  });

  warehouseCosts.sort((a, b) => a.shippingCostPerUnit - b.shippingCostPerUnit);

  let remaining = quantity;
  let totalShipping = 0;

  // Allocate devices from different warehouses
  // 1. if a warehouse cannot fulfill the order, look for the next one
  // 2. if all warehouses cannot fulfill the order, throw an error
  for (const wh of warehouseCosts) {
    if (remaining === 0) break;

    const allocated = Math.min(wh.stock, remaining);
    const shippingCost = allocated * wh.shippingCostPerUnit;

    allocations.push({
      warehouseId: wh.id,
      warehouseName: wh.name,
      quantity: allocated,
      distanceKm: wh.distanceKm,
      shippingCost
    });

    totalShipping += shippingCost;
    remaining -= allocated;
  }

  if (remaining > 0) {
    throw new Error(`Insufficient stock to fulfill order. Still need ${remaining} units.`);
  }

  const discountRate = calculateDiscountRate(quantity);
  const originalTotal = DEVICE_PRICE * quantity;
  const discountAmount = originalTotal * discountRate;
  const discountedTotal = originalTotal - discountAmount;

  const isValid = totalShipping <= discountedTotal * SHIPPING_COST_LIMIT;

  return {
    isValid,
    totalPrice: discountedTotal,
    discount: discountAmount,
    shippingCost: totalShipping,
    allocations
  };
}
