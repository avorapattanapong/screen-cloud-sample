// src/index.ts
import Fastify from 'fastify';
import dotenv from 'dotenv';

// Load .env variables (e.g., DB connection)
dotenv.config();

// Create the Fastify instance
const app = Fastify({
  logger: true  // Enables built-in logging
});

// Example health route
app.get('/health', async (request, reply) => {
  return { status: 'ok' };
});

// Start the server
app.listen({ port: 3000 }, (err, address) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
