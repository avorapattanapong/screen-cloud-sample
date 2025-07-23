import {Warehouse} from "../types/orders";
import {WarehouseRepository} from "../repositories/warehouseRepository";

/**
 * Get all warehouses from the database.
 *
 * @returns A promise resolving to an array of Warehouse objects.
 */
export const getWarehouses = async (): Promise<Warehouse[]> => {
  return WarehouseRepository.getWarehouses();
}
