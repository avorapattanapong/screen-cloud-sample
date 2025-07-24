import fastify from 'fastify';
import { ordersRoutes } from '../orders';
import { registerGlobalErrorHandler } from '../errorHandler';

describe('Orders API', () => {
  let app: ReturnType<typeof fastify>;

  beforeAll(async () => {
    app = fastify();
    registerGlobalErrorHandler(app);
    await app.register(ordersRoutes);
  });

  it('returns 400 for invalid order verification', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/orders/verify',
      payload: { quantity: 0, shippingLat: 91, shippingLng: 181 }
    });
    expect(res.statusCode).toBe(400);
    expect(res.json().error).toBe('Validation error');
  });

  it('returns 200 and empty array for GET /orders with no orders', async () => {
    const res = await app.inject({ method: 'GET', url: '/orders?email=test@example.com' });
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.json())).toBe(true);
  });

  it('returns 404 for GET /orders/:id when not found', async () => {
    const res = await app.inject({ method: 'GET', url: '/orders/unknown-id' });
    expect(res.statusCode).toBe(404);
    expect(res.json().error).toBeDefined();
  });

  it('returns 400 for POST /orders with invalid body', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/orders',
      payload: { email: 'bad', quantity: -1 }
    });
    expect(res.statusCode).toBe(400);
    expect(res.json().error).toBe('Validation error');
  });

  // Add more as needed: mock service/repo for positive cases

});
