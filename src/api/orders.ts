import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import zodToJsonSchema from "zod-to-json-schema";
import {verifyOrder} from "../services/orderService";

const verifyOrderBodySchema = z.object({
  quantity: z.number().int().min(1),
  shippingLat: z.number().refine((lat) => lat >= -90 && lat <= 90, {
    message: "Latitude must be between -90 and 90",
  }),
  shippingLng: z.number().refine((lng) => lng >= -180 && lng <= 180, {
    message: "Longitude must be between -180 and 180",
  }),
});
const verifyOrderBodyJsonSchema = zodToJsonSchema(verifyOrderBodySchema);
type VerifyOrderBody = z.infer<typeof verifyOrderBodySchema>;

/**
 * @openapi
 * /orders/verify:
 *   post:
 *     summary: Verify order details
 *     description: Verify order details and get the price quote
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VerifyOrderBody'
 *     responses:
 *       200:
 *         description: Order details and price quote
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OrderQuote'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 **/
export const ordersRoutes = async (fastify :FastifyInstance) => {
  fastify.post("/orders/verify", {
    schema: {
      body: verifyOrderBodyJsonSchema
    }
  }, async (request: FastifyRequest<{ Body: VerifyOrderBody }>, reply: FastifyReply) => {
      const { quantity, shippingLat, shippingLng } = request.body;
      const result = await verifyOrder(quantity, shippingLat, shippingLng);
      return reply.send(result);
    }
  );
}
