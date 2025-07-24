// src/index.ts
import Fastify from 'fastify';
import dotenv from 'dotenv';
import {ordersRoutes} from "./api/orders";
import {warehouseRoutes} from "./api/warehouse";
import { registerGlobalErrorHandler } from "./api/errorHandler";

// Load .env variables (e.g., DB connection)
dotenv.config();

// Create the Fastify instance
const app = Fastify({
  logger: true  // Enables built-in logging
});

registerGlobalErrorHandler(app);

// Monitoring endpoint
app.get('/health', async (request, reply) => {
  return { status: 'ok' };
});

// Register routes
app.register(warehouseRoutes, { prefix: '/v1' });
app.register(ordersRoutes, { prefix: '/v1' });

// Start the server
app.listen({ port: 3000, host: '0.0.0.0' }, (err, address) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
