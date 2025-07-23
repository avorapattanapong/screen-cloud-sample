import prisma from '../utils/prisma';
import {Warehouse} from "@prisma/client";

export const WarehouseRepository = {
  /**
   * Retrieve all warehouses from the database.
   *
   * @returns A promise resolving to an array of Warehouse objects.
   */
  getWarehouses: async (): Promise<Warehouse[]> => {
    return prisma.warehouse.findMany();
  },

  updateWarehouseStock  : async (warehouseId: string, quantity: number): Promise<void> => {
    await prisma.warehouse.update({
      where: {
        id: warehouseId
      },
      data: {
        stock: {
          increment: quantity
        }
      }
    });
  }
}
