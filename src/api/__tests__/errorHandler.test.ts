import fastify from 'fastify';
import { registerGlobalErrorHandler } from '../errorHandler';
import { ServiceError } from '../../services/errors';

describe('Global Error Handler', () => {
  let app: ReturnType<typeof fastify>;

  beforeEach(() => {
    app = fastify();
    registerGlobalErrorHandler(app);
    app.get('/error', async () => {
      throw new ServiceError('OrderFailed', 'Order failed test');
    });
    app.get('/validation', async () => {
      const err: any = new Error('Validation');
      err.validation = [{ message: 'bad input' }];
      throw err;
    });
    app.get('/unknown', async () => {
      throw new Error('Unknown error');
    });
  });

  it('returns 400 for OrderFailed', async () => {
    const res = await app.inject({ method: 'GET', url: '/error' });
    expect(res.statusCode).toBe(400);
    expect(res.json().error).toBe('Order failed test');
  });

  it('returns 400 for validation errors', async () => {
    const res = await app.inject({ method: 'GET', url: '/validation' });
    expect(res.statusCode).toBe(400);
    expect(res.json().error).toBe('Validation error');
    expect(res.json().details).toBeDefined();
  });

  it('returns 500 for unknown errors', async () => {
    const res = await app.inject({ method: 'GET', url: '/unknown' });
    expect(res.statusCode).toBe(500);
    expect(res.json().error).toBe('Internal server error');
  })
});
