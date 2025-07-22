import { PrismaClient } from '@prisma/client';
import {Warehouse} from "../types/orders";

const prisma = new PrismaClient();

/**
 * Get all warehouses from the database.
 *
 * @returns A promise resolving to an array of Warehouse objects.
 */
export const getWarehouses = async (): Promise<Warehouse[]> => {
  return prisma.warehouse.findMany();
}
