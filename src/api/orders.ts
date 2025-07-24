import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import {
  createOrder,
  getOrderById,
  getOrders,
  getOrdersByEmail,
  verifyOrder
} from "../services/orderService";
import {
  CreateOrderBody,
  createOrderBodyJsonSchema,
  VerifyOrderBody,
  verifyOrderBodyJsonSchema
} from "./schemas/orderSchemas";

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

  fastify.post("/orders", {
    schema: {
      body: createOrderBodyJsonSchema
    }
  }, async (request: FastifyRequest<{ Body: CreateOrderBody }>, reply: FastifyReply) => {
      const { email, quantity, shippingLat, shippingLng } = request.body;
      const result = await createOrder(email, quantity, shippingLat, shippingLng);
      return reply.send(result);
    }
  );

  fastify.get("/orders", async (request: FastifyRequest<{ Querystring: { email: string } }>, reply: FastifyReply) => {
    const { email } = request.query;

    if (email){
      const orders = await getOrdersByEmail(email);
      return reply.send(orders);
    }

    const orders = await getOrders();
    return reply.send(orders);
  });

  fastify.get("/orders/:id", async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    const { id } = request.params;
    if (!id) {
      return reply.status(400).send({ error: "Invalid id" });
    }
    const order = await getOrderById(id);
    if (!order) {
      return reply.status(404).send({ error: "Order not found" });
    }
    return reply.send(order);
  })
}
