import prisma from "../utils/prisma";
import {GetOrderResponse, OrderPayload, WarehouseAllocation} from "../types/orders";
import { ORDER_STATUS } from "../config/contants";
import { RepositoryError } from "./errors";
import { Prisma } from "@prisma/client";

// Helper to map Prisma order to GetOrderResponse
function mapOrderToGetOrderResponse(order: any): GetOrderResponse | null {
  if (!order) return null;

  const allocations = order.allocations.map((alloc: any) => ({
    warehouseId: alloc.warehouseId,
    warehouseName: alloc.warehouse.name,
    quantity: alloc.quantity
  }));

  return {
    id: order.id,
    createdAt: order.createdAt,
    quantity: order.quantity,
    shippingLat: order.shippingLat,
    shippingLng: order.shippingLng,
    totalPrice: order.totalPrice,
    discount: order.discount,
    shippingCost: order.shippingCost,
    isValid: order.isValid,
    status: order.status,
    allocations,
    email: order.email
  };
}

export const OrderRepository = {
  createOrder: async (
    email: string,
    quantity: number,
    shippingLat: number,
    shippingLng: number,
    totalPrice: number,
    discount: number,
    shippingCost: number,
    allocations: WarehouseAllocation[]
  ): Promise<OrderPayload> => {
    try {
      const order = await prisma.order.create({
        data: {
          email,
          quantity,
          shippingLat,
          shippingLng,
          totalPrice,
          discount,
          shippingCost,
          isValid: true,
          status: ORDER_STATUS.PENDING,
        },
      });
      for (const alloc of allocations) {
        await prisma.orderAllocation.create({
          data: {
            orderId: order.id,
            warehouseId: alloc.warehouseId,
            quantity: alloc.quantity,
          },
        });
      }
      return {
        id: order.id,
        createdAt: order.createdAt,
        status: order.status,
        isValid: order.isValid,
        totalPrice: order.totalPrice,
        discount: order.discount,
        shippingCost: order.shippingCost,
        invalidReason: null,
        allocations,
      };
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        throw new RepositoryError('Validation', 'Invalid order data', err);
      }
      throw new RepositoryError('Unknown', 'Failed to create order', err);
    }
  },

  getOrderById: async (id: string): Promise<GetOrderResponse | null> => {
    try {
      const order = await prisma.order.findUnique({
        where: {
          id,
        },
        include: {
          allocations: {
            include: {
              warehouse: true
            }
          }
        }
      });
      return mapOrderToGetOrderResponse(order);
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        throw new RepositoryError('Validation', 'Invalid order ID', err);
      }
      throw new RepositoryError('Unknown', 'Failed to fetch order', err);
    }
  },
  getOrdersByEmail: async (email: string): Promise<GetOrderResponse[] | null> => {
    try {
      const orders = await prisma.order.findMany({
        where: {
          email,
        },
        include: {
          allocations: {
            include: {
              warehouse: true
            }
          }
        }
      });
      const response = [];
      for(const order of orders) {
        const orderResponse = mapOrderToGetOrderResponse(order);
        if (orderResponse) response.push(orderResponse);
      }
      return response;
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        throw new RepositoryError('Validation', 'Invalid email', err);
      }
      throw new RepositoryError('Unknown', 'Failed to fetch orders by email', err);
    }
  },

  getOrders: async (): Promise<GetOrderResponse[] | null> => {
    try {
      const orders = await prisma.order.findMany({
        include: {
          allocations: {
            include: {
              warehouse: true
            }
          }
        }
      });
      const response = [];
      for (const order of orders) {
        const orderResponse = mapOrderToGetOrderResponse(order);
        if (orderResponse) response.push(orderResponse);
      }
      return response;
    } catch (err) {
      throw new RepositoryError('Unknown', 'Failed to fetch orders', err);
    }
  }
};
