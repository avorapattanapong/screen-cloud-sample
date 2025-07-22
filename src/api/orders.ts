import { FastifyInstance } from "fastify";
import { z } from "zod";

export const ordersRoutes = async (fastify :FastifyInstance) => {
  fastify.post("/orders/verify", {
    schema: {
      body: z.object({
        quantity: z.number().int().min(1),
        shippingLat: z.number(),
        shippingLng: z.number(),
    })
  }, async (request, reply) => {
      const { quantity, shippingLat, shippingLng } = request.body;
      const result = await verifyOrder(quantity, shippingLat, shippingLng);
      return reply.send(result);
    }
  })
}
