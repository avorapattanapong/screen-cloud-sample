import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { ServiceError } from "../services/errors";

export function registerGlobalErrorHandler(fastify: FastifyInstance) {
  fastify.setErrorHandler((error: any, request: FastifyRequest, reply: FastifyReply) => {
    // Handle Fastify/Zod schema validation errors
    if (error.validation && Array.isArray(error.validation)) {
      // Fastify validation error
      return reply.status(400).send({
        error: 'Validation error',
        details: error.validation
      });
    }
    if (error.name === 'ZodError' && error.errors) {
      // Zod validation error (if thrown directly)
      return reply.status(400).send({
        error: 'Validation error',
        details: error.errors
      });
    }

    if (error instanceof ServiceError) {
      switch (error.type) {
        case "OrderFailed":
        case "InvalidInput":
        case "BusinessRule":
          return reply.status(400).send({ error: error.message });
        case "Repository":
        default:
          return reply.status(500).send({ error: error.message });
      }
    }
    // fallback for unhandled errors
    reply.status(500).send({ error: "Internal server error" });
  });
}
