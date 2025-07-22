import {FastifyInstance, FastifyReply, FastifyRequest} from "fastify";
import {getWarehouses} from "../services/warehouseService";

export const warehouseRoutes = async (fastify :FastifyInstance) => {

  /**
   * @openapi
   * /warehouses:
   *   get:
   *     summary: Get all warehouses
   *     description: Retrieve a list of all warehouses.
   *     responses:
   *       200:
   *         description: A list of warehouses.
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Warehouse'
   *       500:
   *         $ref: '#/components/responses/InternalServerError'
   **/
  fastify.get("/warehouses", async (request: FastifyRequest, reply: FastifyReply) => {
    const warehouses = await getWarehouses();
    console.log(warehouses);
    return reply.send(warehouses);
  });
}
