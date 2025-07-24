import { OrderRepository } from '../orderRepository';
import { RepositoryError } from '../errors';

jest.mock('../../utils/prisma', () => ({
  order: {
    findUnique: jest.fn(),
    create: jest.fn(),
    findMany: jest.fn(),
  },
  orderAllocation: {
    create: jest.fn(),
  },
}));
const prisma = require('../../utils/prisma');

describe('OrderRepository', () => {
  afterEach(() => jest.clearAllMocks());

  describe('getOrderById', () => {
    it('returns mapped order when found', async () => {
      prisma.order.findUnique.mockResolvedValue({ id: '1', allocations: [], createdAt: new Date(), quantity: 1, shippingLat: 0, shippingLng: 0, totalPrice: 100, discount: 0, shippingCost: 0, isValid: true, status: 'PENDING', email: 'a@b.com' });
      const result = await OrderRepository.getOrderById('1');
      expect(result).toBeTruthy();
      expect(result?.id).toBe('1');
    });
    it('returns null when not found', async () => {
      prisma.order.findUnique.mockResolvedValue(null);
      const result = await OrderRepository.getOrderById('none');
      expect(result).toBeNull();
    });
    it('throws RepositoryError on Prisma error', async () => {
      prisma.order.findUnique.mockRejectedValue(new Error('fail'));
      await expect(OrderRepository.getOrderById('bad')).rejects.toThrow(RepositoryError);
    });
  });

  describe('getOrdersByEmail', () => {
    it('returns orders array when found', async () => {
      prisma.order.findMany.mockResolvedValue([
        { id: '1', allocations: [], createdAt: new Date(), quantity: 1, shippingLat: 0, shippingLng: 0, totalPrice: 100, discount: 0, shippingCost: 0, isValid: true, status: 'PENDING', email: 'a@b.com' },
        { id: '2', allocations: [], createdAt: new Date(), quantity: 2, shippingLat: 0, shippingLng: 0, totalPrice: 200, discount: 0, shippingCost: 0, isValid: true, status: 'PENDING', email: 'a@b.com' }
      ]);
      const result = await OrderRepository.getOrdersByEmail('a@b.com');
      expect(Array.isArray(result)).toBe(true);
      if (result === null) fail("result should not be null");
      expect(result.length).toBe(2);
      expect(result[0].id).toBe('1');
    });
    it('returns empty array when no orders found', async () => {
      prisma.order.findMany.mockResolvedValue([]);
      const result = await OrderRepository.getOrdersByEmail('none@b.com');
      expect(Array.isArray(result)).toBe(true);
      if (result === null) fail("result should not be null");
      expect(result.length).toBe(0);
    });
    it('throws RepositoryError on Prisma error', async () => {
      prisma.order.findMany.mockRejectedValue(new Error('fail'));
      await expect(OrderRepository.getOrdersByEmail('bad@b.com')).rejects.toThrow(RepositoryError);
    });
  });

  describe('createOrder', () => {
    it('returns order payload on success', async () => {
      prisma.order.create.mockResolvedValue({ id: '2', createdAt: new Date(), status: 'PENDING', isValid: true, totalPrice: 100, discount: 0, shippingCost: 0 });
      prisma.orderAllocation.create.mockResolvedValue({});
      const result = await OrderRepository.createOrder('a@b.com', 1, 0, 0, 100, 0, 0, []);
      expect(result).toBeTruthy();
      expect(result.status).toBe('PENDING');
    });
    it('throws RepositoryError on Prisma error', async () => {
      prisma.order.create.mockRejectedValue(new Error('fail'));
      await expect(OrderRepository.createOrder('a@b.com', 1, 0, 0, 100, 0, 0, [])).rejects.toThrow(RepositoryError);
    });
  });
});
