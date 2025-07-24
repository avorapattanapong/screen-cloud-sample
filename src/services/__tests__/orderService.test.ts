import { createOrder, getOrderById } from '../orderService';
import { OrderRepository } from '../../repositories/orderRepository';
import { WarehouseRepository } from '../../repositories/warehouseRepository';
import { ServiceError } from '../errors';

jest.mock('../../repositories/orderRepository');
jest.mock('../../repositories/warehouseRepository');

const warehouses = [
  {
    id: 'w1',
    name: 'Warehouse 1',
    stock: 100,
    latitude: 13.7563, // Bangkok
    longitude: 100.5018,
  },
  {
    id: 'w2',
    name: 'Warehouse 2',
    stock: 50,
    latitude: 35.6895, // Tokyo
    longitude: 139.6917,
  }
];
describe('orderService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createOrder', () => {
    it('throws ServiceError if order creation fails', async () => {
      (OrderRepository.createOrder as jest.Mock).mockResolvedValue(null);
      await expect(createOrder('a@b.com', 1, 0, 0)).rejects.toThrow(ServiceError);
    });
    it('returns order payload on success', async () => {
      (WarehouseRepository.getWarehouses as jest.Mock).mockResolvedValue(warehouses);
      (OrderRepository.createOrder as jest.Mock).mockResolvedValue({ id: '1', createdAt: new Date(), status: 'PENDING', isValid: true, totalPrice: 100, discount: 0, shippingCost: 0 });
      (WarehouseRepository.updateWarehouseStock as jest.Mock).mockResolvedValue(undefined);
      const result = await createOrder('a@b.com', 1, 14.7367, 100.5231);
      expect(result).toBeTruthy();
      expect(result.status).toBe('PENDING');
    });
  });

  describe('getOrderById', () => {
    it('returns order if found', async () => {
      (OrderRepository.getOrderById as jest.Mock).mockResolvedValue({ id: '1' });
      const result = await getOrderById('1');
      expect(result).toBeTruthy();
      expect(result?.id).toBe('1');
    });
    it('returns null if not found', async () => {
      (OrderRepository.getOrderById as jest.Mock).mockResolvedValue(null);
      const result = await getOrderById('none');
      expect(result).toBeNull();
    });

  });
});
