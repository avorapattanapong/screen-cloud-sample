import { calculateDistanceKm } from '../utils/distance';
import { calculateDiscountRate } from '../utils/discount';
import {
  DEVICE_PRICE,
  DEVICE_WEIGHT_KG, ORDER_STATUS,
  SHIPPING_COST_LIMIT,
  SHIPPING_RATE_PER_KG_KM
} from "../config/contants";
import {GetOrderResponse, OrderPayload, OrderQuote, WarehouseAllocation} from "../types/orders";
import {WarehouseRepository} from "../repositories/warehouseRepository";
import {getInvalidOrderReason, INVALID_ORDER_REASONS} from "../utils/invalidOrder";
import {OrderRepository} from "../repositories/orderRepository";

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
  const warehouses = await WarehouseRepository.getWarehouses();
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

  const discountRate = calculateDiscountRate(quantity);
  const originalTotal = DEVICE_PRICE * quantity;
  const discountAmount = originalTotal * discountRate;
  const discountedTotal = originalTotal - discountAmount;

  if (remaining > 0) {
    // Set up an alert system here to notify warehouses
    console.error('Insufficient stock to fulfill order');
  }

  const isValid = remaining <= 0 && totalShipping <= discountedTotal * SHIPPING_COST_LIMIT;

  const invalidErrorCode = getInvalidOrderReason(discountedTotal, totalShipping, quantity, remaining > 0);
  return {
    isValid,
    totalPrice: discountedTotal,
    discount: discountAmount,
    shippingCost: totalShipping,
    invalidReason: invalidErrorCode ? INVALID_ORDER_REASONS[invalidErrorCode] : 'Order rejected - not valid',
    allocations
  };
}

/**
 * Creates an order given the input parameters.
 * @param email The customer's email address.
 * @param quantity The quantity of SCOS devices to order.
 * @param shippingLat The shipping latitude.
 * @param shippingLng The shipping longitude.
 * @returns A promise that resolves to an `OrderPayload` object, which contains the order information.
 * If the order is invalid, the `id` and `createdAt` fields will be null and the `status` will be set to `ORDER_STATUS.CANCELLED`.
 */
export const createOrder = async (email: string, quantity: number, shippingLat: number, shippingLng: number): Promise<OrderPayload> => {
  const quote = await verifyOrder(quantity, shippingLat, shippingLng);

  if (!quote.isValid) {
    return {
      id: null,
      createdAt: null,
      ...quote,
      status: ORDER_STATUS.CANCELLED
    }
  }

  const order = await OrderRepository.createOrder(email, quantity, shippingLat, shippingLng, quote.totalPrice, quote.discount, quote.shippingCost, quote.allocations);
  if (!order || !order.id) {
    throw new Error("Order creation failed");
  }

  // once order is created, deduduct stock from warehouses
  for (const alloc of quote.allocations) {
    // Quantity is negative to decrement stock from warehouse
    await WarehouseRepository.updateWarehouseStock(alloc.warehouseId, alloc.quantity * -1);
  }

  return order;
}

export const getOrderById = async (id: string): Promise<GetOrderResponse | null> => {
  return await OrderRepository.getOrderById(id);
}
